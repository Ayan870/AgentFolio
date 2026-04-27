import pytest
from app.models.schemas import CVData
from app.services.ingestion import chunk_cv_data


SAMPLE_CV = CVData(
    user_id="test_user",
    name="Test User",
    bio="A passionate developer.",
    skills=["Python", "FastAPI"],
    projects=[
        {
            "title": "Cool Project",
            "description": "Does cool things.",
            "tech": ["Python"],
            "url": "https://github.com/test/cool",
        }
    ],
    experience=[
        {
            "company": "Acme",
            "role": "Engineer",
            "duration": "2022-2024",
            "description": "Built APIs.",
        }
    ],
    education=[
        {
            "institution": "MIT",
            "degree": "BSc CS",
            "year": "2022",
        }
    ],
    contact={"email": "test@test.com"},
)


def test_chunk_cv_produces_texts():
    texts, metadatas = chunk_cv_data(SAMPLE_CV)
    assert len(texts) > 0
    assert len(texts) == len(metadatas)


def test_chunk_metadata_has_user_id():
    _, metadatas = chunk_cv_data(SAMPLE_CV)
    for meta in metadatas:
        assert meta["user_id"] == "test_user"


def test_bio_chunk_present():
    texts, _ = chunk_cv_data(SAMPLE_CV)
    assert any("passionate developer" in t for t in texts)


def test_project_chunk_present():
    texts, _ = chunk_cv_data(SAMPLE_CV)
    assert any("Cool Project" in t for t in texts)
