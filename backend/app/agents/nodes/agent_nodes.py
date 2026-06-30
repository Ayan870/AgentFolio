from app.agents.graph.state import AgentState
from app.agents.prompts.persona_prompt import (
    PERSONA_SYSTEM_PROMPT, ROUTER_PROMPT, TONE_INSTRUCTIONS, LENGTH_INSTRUCTIONS
)
from app.rag.retriever.chroma_store import retrieve_relevant
from app.core.config import get_settings
from openai import AsyncOpenAI
import json
import os

settings = get_settings()

_llm = AsyncOpenAI(
    api_key=settings.openrouter_api_key,
    base_url=settings.openrouter_base_url,
)


def get_agent_settings(user_id: str) -> dict:
    """Load per-user agent settings from their profile JSON."""
    profile_path = f"./data/profiles/{user_id}.json"
    if os.path.exists(profile_path):
        with open(profile_path) as f:
            data = json.load(f)
            return data.get("settings", {})
    return {}


async def router_node(state: AgentState) -> AgentState:
    prompt = ROUTER_PROMPT.format(message=state["message"])

    response = await _llm.chat.completions.create(
        model=settings.llm_model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=10,
        temperature=0,
    )

    intent = response.choices[0].message.content.strip().lower()
    if intent not in {"cv_query", "general_chat", "linkedin_query"}:
        intent = "cv_query"

    print(f"[Router] Intent: {intent}")
    return {**state, "intent": intent}


async def retriever_node(state: AgentState) -> AgentState:
    docs = retrieve_relevant(
        user_id=state["user_id"],
        query=state["message"],
        n_results=5,
    )

    context = "\n\n".join(d["text"] for d in docs) if docs else "No relevant information found."
    sources = [d["metadata"].get("source", "cv") for d in docs]

    print(f"[Retriever] Found {len(docs)} docs")
    return {**state, "retrieved_docs": docs, "context": context, "sources": sources}


async def responder_node(state: AgentState) -> AgentState:
    history_str = "\n".join(
        f"{m['role'].capitalize()}: {m['content']}"
        for m in state.get("history", [])
    ) or "None"

    agent_settings = get_agent_settings(state["user_id"])
    tone = agent_settings.get("tone", "professional")
    length = agent_settings.get("response_length", "medium")
    model = agent_settings.get("model", settings.llm_model)

    max_tokens_map = {"short": 150, "medium": 400, "detailed": 800}
    max_tokens = max_tokens_map.get(length, 400)

    system_prompt = PERSONA_SYSTEM_PROMPT.format(
        name=state["user_name"],
        context=state["context"],
        history=history_str,
        tone_instruction=TONE_INSTRUCTIONS.get(tone, TONE_INSTRUCTIONS["professional"]),
        length_instruction=LENGTH_INSTRUCTIONS.get(length, LENGTH_INSTRUCTIONS["medium"]),
    )

    # Build structured messages with history
    messages = [{"role": "system", "content": system_prompt}]
    for m in state.get("history", []):
        messages.append({"role": m["role"], "content": m["content"]})
    messages.append({"role": "user", "content": state["message"]})

    response = await _llm.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=max_tokens,
        temperature=0.7,
    )

    reply = response.choices[0].message.content.strip()
    print(f"[Responder] Reply generated using model={model}, tone={tone}, length={length}")
    return {**state, "reply": reply}


async def general_chat_node(state: AgentState) -> AgentState:
    agent_settings = get_agent_settings(state["user_id"])
    tone = agent_settings.get("tone", "professional")
    model = agent_settings.get("model", settings.llm_model)

    system_prompt = f"You are a friendly AI agent representing {state['user_name']}. {TONE_INSTRUCTIONS.get(tone, '')} Respond naturally to greetings and small talk. Keep it brief."

    # Build structured messages with history
    messages = [{"role": "system", "content": system_prompt}]
    for m in state.get("history", []):
        messages.append({"role": m["role"], "content": m["content"]})
    messages.append({"role": "user", "content": state["message"]})

    response = await _llm.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=200,
        temperature=0.8,
    )

    reply = response.choices[0].message.content.strip()
    return {**state, "reply": reply, "sources": [], "context": ""}













