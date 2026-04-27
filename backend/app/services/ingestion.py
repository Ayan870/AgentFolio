from app.models.schemas import CVData
from app.rag.retriever.chroma_store import upsert_documents
import json


def chunk_cv_data(cv: CVData) -> tuple[list[str], list[dict]]:
    """
    Convert structured CV data into embeddable text chunks.
    Each chunk gets metadata so we can trace it back to its source.
    """
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

    # Bio
    if cv.bio:
        add(f"{cv.name}: {cv.bio}", source="bio")

    # Skills (one chunk for the full list — concise)
    if cv.skills:
        add(f"{cv.name}'s skills: {', '.join(cv.skills)}", source="skills")

    # Projects (one chunk per project)
    for proj in cv.projects:
        tech = ", ".join(proj.get("tech", []))
        text = (
            f"Project: {proj.get('title', '')}\n"
            f"Description: {proj.get('description', '')}\n"
            f"Technologies: {tech}\n"
            f"URL: {proj.get('url', 'N/A')}"
        )
        add(text, source="project", subtype=proj.get("title", ""))

    # Experience (one chunk per role)
    for exp in cv.experience:
        text = (
            f"Work experience at {exp.get('company', '')} "
            f"as {exp.get('role', '')} ({exp.get('duration', '')}):\n"
            f"{exp.get('description', '')}"
        )
        add(text, source="experience", subtype=exp.get("company", ""))

    # Education (one chunk per entry)
    for edu in cv.education:
        text = (
            f"Education: {edu.get('degree', '')} "
            f"from {edu.get('institution', '')} ({edu.get('year', '')})"
        )
        add(text, source="education", subtype=edu.get("institution", ""))

    # Contact (single chunk)
    if cv.contact:
        add(
            f"Contact info for {cv.name}: {json.dumps(cv.contact)}",
            source="contact",
        )

    return texts, metadatas


def ingest_cv(cv: CVData) -> int:
    """Chunk, embed, and store CV data. Returns number of chunks indexed."""
    texts, metadatas = chunk_cv_data(cv)
    count = upsert_documents(
        user_id=cv.user_id,
        texts=texts,
        metadatas=metadatas,
    )
    print(f"[Ingest] Indexed {count} chunks for user: {cv.user_id}")
    return count
