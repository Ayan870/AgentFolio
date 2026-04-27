from app.agents.nodes.agent_nodes import (
    router_node,
    retriever_node,
    responder_node,
    general_chat_node,
)
from app.agents.graph.state import AgentState


async def run_agent(state: AgentState) -> AgentState:
    """
    Manual graph execution — replaces LangGraph.
    router → retriever → responder  (for cv/linkedin queries)
    router → general_chat           (for small talk)
    """
    # Node 1: Route
    state = await router_node(state)

    # Node 2: Branch
    if state["intent"] == "general_chat":
        state = await general_chat_node(state)
    else:
        state = await retriever_node(state)
        state = await responder_node(state)

    return state


# Keep same interface as before
agent_graph = type("Graph", (), {"ainvoke": staticmethod(run_agent)})()