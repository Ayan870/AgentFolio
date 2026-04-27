from app.agents.graph.state import AgentState
from app.agents.prompts.persona_prompt import PERSONA_SYSTEM_PROMPT, ROUTER_PROMPT
from app.rag.retriever.chroma_store import retrieve_relevant
from app.core.config import get_settings
from openai import AsyncOpenAI

settings = get_settings()

_llm = AsyncOpenAI(
    api_key=settings.openrouter_api_key,
    base_url=settings.openrouter_base_url,
)


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

    system_prompt = PERSONA_SYSTEM_PROMPT.format(
        name=state["user_name"],
        context=state["context"],
        history=history_str,
    )

    response = await _llm.chat.completions.create(
        model=settings.llm_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": state["message"]},
        ],
        max_tokens=600,
        temperature=0.7,
    )

    reply = response.choices[0].message.content.strip()
    print(f"[Responder] Reply generated")
    return {**state, "reply": reply}


async def general_chat_node(state: AgentState) -> AgentState:
    response = await _llm.chat.completions.create(
        model=settings.llm_model,
        messages=[
            {
                "role": "system",
                "content": f"You are a friendly AI agent representing {state['user_name']}. Respond naturally to greetings and small talk. Keep it brief.",
            },
            {"role": "user", "content": state["message"]},
        ],
        max_tokens=200,
        temperature=0.8,
    )

    reply = response.choices[0].message.content.strip()
    return {**state, "reply": reply, "sources": [], "context": ""}