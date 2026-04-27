from typing import TypedDict, Annotated, Optional
import operator


class AgentState(TypedDict):
    """
    The state that flows through every node in the LangGraph graph.
    Each node reads from and writes to this shared state dict.
    """
    # Input
    user_id: str
    user_name: str
    message: str
    session_id: str

    # Routing
    intent: str  # cv_query | general_chat | linkedin_query

    # RAG
    retrieved_docs: list[dict]
    context: str

    # Conversation memory
    history: list[dict]  # [{role, content}]

    # Output
    reply: str
    sources: list[str]
