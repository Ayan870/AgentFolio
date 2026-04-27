from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class MessageRole(str, Enum):
    user = "user"
    assistant = "assistant"
    system = "system"


class ChatMessage(BaseModel):
    role: MessageRole
    content: str


class ChatRequest(BaseModel):
    user_id: str = Field(..., description="Unique ID of the agent owner")
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None
    history: list[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str
    session_id: str
    sources: list[str] = []


class CVData(BaseModel):
    """Schema for manual CV data ingestion."""
    user_id: str
    name: str
    bio: str
    skills: list[str] = []
    projects: list[dict] = []   # {title, description, tech, url}
    experience: list[dict] = [] # {company, role, duration, description}
    education: list[dict] = []  # {institution, degree, year}
    contact: dict = {}          # {email, linkedin, github, website}


class IngestRequest(BaseModel):
    user_id: str
    data: CVData


class IngestResponse(BaseModel):
    success: bool
    chunks_indexed: int
    message: str
