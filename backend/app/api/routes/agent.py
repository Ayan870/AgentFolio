from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse, IngestRequest, IngestResponse, OnboardingData
from app.agents.graph.agent_graph import agent_graph
from app.services.ingestion import ingest_cv, ingest_onboarding
from app.models.schemas import CVData
import uuid
import json
import os

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    session_id = request.session_id or str(uuid.uuid4())
    initial_state = {
        "user_id": request.user_id,
        "user_name": request.user_id,
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


@router.post("/onboard")
async def onboard(data: OnboardingData):
    """
    Receive onboarding form data, save it, and ingest into Chroma.
    """
    try:
        # Save raw data as JSON
        os.makedirs("./data/profiles", exist_ok=True)
        profile_path = f"./data/profiles/{data.user_id}.json"
        with open(profile_path, "w") as f:
            json.dump(data.model_dump(), f, indent=2)

        # Ingest into Chroma
        count = ingest_onboarding(data)

        return {
            "success": True,
            "chunks_indexed": count,
            "agent_url": f"/agent/{data.user_id}",
            "message": f"Agent is live at /agent/{data.user_id}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Onboarding error: {str(e)}")


@router.get("/profile/{user_id}")
async def get_profile(user_id: str):
    """Load existing profile data for editing."""
    profile_path = f"./data/profiles/{user_id}.json"
    if not os.path.exists(profile_path):
        raise HTTPException(status_code=404, detail="Profile not found")
    with open(profile_path) as f:
        return json.load(f)


@router.get("/health")
async def health():
    return {"status": "ok", "service": "agentfolio-backend"}