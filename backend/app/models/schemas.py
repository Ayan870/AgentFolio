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
    user_id: str
    name: str
    bio: str
    skills: list[str] = []
    projects: list[dict] = []
    experience: list[dict] = []
    education: list[dict] = []
    contact: dict = {}


class ProjectItem(BaseModel):
    title: str
    description: str
    github_url: str = ""
    live_url: str = ""
    tech: list[str] = []


class ExperienceItem(BaseModel):
    company: str
    role: str
    duration: str
    description: str


class EducationItem(BaseModel):
    institution: str
    degree: str
    year: str


class StoryAnswers(BaseModel):
    how_started: str = ""
    biggest_win: str = ""
    biggest_failure: str = ""
    currently_obsessed: str = ""
    looking_for: str = ""


class AgentSettings(BaseModel):
    tone: str = "professional"  # professional | friendly | casual | witty
    response_length: str = "medium"  # short | medium | detailed
    model: str = "meta-llama/llama-3-8b-instruct"


class OnboardingData(BaseModel):
    user_id: str
    name: str
    bio: str
    location: str = ""
    github_url: str = ""
    website: str = ""
    linkedin_url: str = ""
    skills: list[str] = []
    projects: list[ProjectItem] = []
    experience: list[ExperienceItem] = []
    education: list[EducationItem] = []
    story: StoryAnswers = StoryAnswers()
    settings: AgentSettings = AgentSettings()


class IngestRequest(BaseModel):
    user_id: str
    data: CVData


class IngestResponse(BaseModel):
    success: bool
    chunks_indexed: int
    message: str