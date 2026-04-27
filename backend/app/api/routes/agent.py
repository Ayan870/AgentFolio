from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse, IngestRequest, IngestResponse
from app.agents.graph.agent_graph import agent_graph
from app.services.ingestion import ingest_cv
import uuid

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message to the user's AI agent.
    The agent retrieves relevant CV/LinkedIn data and responds in first person.
    """
    session_id = request.session_id or str(uuid.uuid4())

    # Build initial state for the graph
    initial_state = {
        "user_id": request.user_id,
        "user_name": request.user_id,  # Will be replaced with real name after Phase 2 auth
        "message": request.message,
        "session_id": session_id,
        "history": [m.model_dump() for m in request.history],
        "intent": "",
        "retrieved_docs": [],
        "context": "",
        "reply": "",
        "sources": [],
    }

    try:
        result = await agent_graph.ainvoke(initial_state)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")

    return ChatResponse(
        reply=result["reply"],
        session_id=session_id,
        sources=list(set(result.get("sources", []))),
    )


@router.post("/ingest", response_model=IngestResponse)
async def ingest(request: IngestRequest):
    """
    Ingest CV data for a user — chunks, embeds, and stores in their Chroma collection.
    """
    try:
        count = ingest_cv(request.data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion error: {str(e)}")

    return IngestResponse(
        success=True,
        chunks_indexed=count,
        message=f"Successfully indexed {count} chunks for user {request.user_id}",
    )


@router.get("/health")
async def health():
    return {"status": "ok", "service": "agentfolio-backend"}
