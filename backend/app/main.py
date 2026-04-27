from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.api.routes.agent import router as agent_router

settings = get_settings()

app = FastAPI(
    title="AgentFolio API",
    description="Backend for the AgentFolio AI-powered portfolio platform",
    version="0.1.0",
)

# CORS — allow the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(agent_router, prefix="/api/v1", tags=["Agent"])


@app.get("/")
async def root():
    return {"message": "AgentFolio API is running 🚀"}
