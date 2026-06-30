from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import get_settings
from app.api.routes.agent import router as agent_router
from app.api.routes.auth import router as auth_router

settings = get_settings()

app = FastAPI(title="AgentFolio API", version="0.1.0")

app.mount("/data", StaticFiles(directory="data"), name="data")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agent_router, prefix="/api/v1", tags=["Agent"])
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])

@app.get("/")
async def root():
    return {"message": "AgentFolio API is running 🚀"}