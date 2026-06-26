from app.models.schemas import CVData, OnboardingData
from app.rag.retriever.chroma_store import upsert_documents
import json


def chunk_cv_data(cv: CVData) -> tuple[list[str], list[dict]]:
    texts: list[str] = []
    metadatas: list[dict] = []

    def add(text: str, source: str, subtype: str = ""):
        texts.append(text.strip())
        metadatas.append({
            "user_id": cv.user_id,
            "source": source,
            "subtype": subtype,
            "name": cv.name,
        })

    if cv.bio:
        add(f"{cv.name}: {cv.bio}", source="bio")
    if cv.skills:
        add(f"{cv.name}'s skills: {', '.join(cv.skills)}", source="skills")
    for proj in cv.projects:
        tech = ", ".join(proj.get("tech", []))
        text = (
            f"Project: {proj.get('title', '')}\n"
            f"Description: {proj.get('description', '')}\n"
            f"Technologies: {tech}\n"
            f"URL: {proj.get('url', 'N/A')}"
        )
        add(text, source="project", subtype=proj.get("title", ""))
    for exp in cv.experience:
        text = (
            f"Work experience at {exp.get('company', '')} "
            f"as {exp.get('role', '')} ({exp.get('duration', '')}):\n"
            f"{exp.get('description', '')}"
        )
        add(text, source="experience", subtype=exp.get("company", ""))
    for edu in cv.education:
        text = (
            f"Education: {edu.get('degree', '')} "
            f"from {edu.get('institution', '')} ({edu.get('year', '')})"
        )
        add(text, source="education", subtype=edu.get("institution", ""))
    if cv.contact:
        add(f"Contact info for {cv.name}: {json.dumps(cv.contact)}", source="contact")

    return texts, metadatas


def ingest_cv(cv: CVData) -> int:
    texts, metadatas = chunk_cv_data(cv)
    count = upsert_documents(user_id=cv.user_id, texts=texts, metadatas=metadatas)
    print(f"[Ingest] Indexed {count} chunks for user: {cv.user_id}")
    return count


def ingest_onboarding(data: OnboardingData) -> int:
    texts: list[str] = []
    metadatas: list[dict] = []

    def add(text: str, source: str, subtype: str = ""):
        texts.append(text.strip())
        metadatas.append({
            "user_id": data.user_id,
            "source": source,
            "subtype": subtype,
            "name": data.name,
        })

    # Basics
    bio_text = f"{data.name}: {data.bio}"
    if data.location:
        bio_text += f" Based in {data.location}."
    add(bio_text, source="bio")

    # Links
    links = []
    if data.github_url:
        links.append(f"GitHub: {data.github_url}")
    if data.website:
        links.append(f"Website: {data.website}")
    if data.linkedin_url:
        links.append(f"LinkedIn: {data.linkedin_url}")
    if links:
        add(f"Links for {data.name}: {', '.join(links)}", source="contact")

    # Skills
    if data.skills:
        add(f"{data.name}'s skills: {', '.join(data.skills)}", source="skills")

    # Projects
    for proj in data.projects:
        tech = ", ".join(proj.tech)
        text = (
            f"Project: {proj.title}\n"
            f"Description: {proj.description}\n"
            f"Technologies: {tech}\n"
            f"GitHub: {proj.github_url or 'N/A'}\n"
            f"Live URL: {proj.live_url or 'N/A'}"
        )
        add(text, source="project", subtype=proj.title)

    # Experience
    for exp in data.experience:
        text = (
            f"Work experience at {exp.company} "
            f"as {exp.role} ({exp.duration}):\n"
            f"{exp.description}"
        )
        add(text, source="experience", subtype=exp.company)

    # Education
    for edu in data.education:
        text = (
            f"Education: {edu.degree} "
            f"from {edu.institution} ({edu.year})"
        )
        add(text, source="education", subtype=edu.institution)

    # Story
    s = data.story
    if s.how_started:
        add(f"How {data.name} got into coding: {s.how_started}", source="story", subtype="origin")
    if s.biggest_win:
        add(f"{data.name}'s biggest win: {s.biggest_win}", source="story", subtype="win")
    if s.biggest_failure:
        add(f"A failure {data.name} learned from: {s.biggest_failure}", source="story", subtype="failure")
    if s.currently_obsessed:
        add(f"{data.name} is currently obsessed with: {s.currently_obsessed}", source="story", subtype="obsession")
    if s.looking_for:
        add(f"What {data.name} is looking for: {s.looking_for}", source="story", subtype="goals")

    count = upsert_documents(user_id=data.user_id, texts=texts, metadatas=metadatas)
    print(f"[Ingest] Indexed {count} chunks for user: {data.user_id}")
    return count