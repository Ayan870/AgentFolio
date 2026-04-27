#!/usr/bin/env python3
"""
Seed script — loads sample_cv.json into the Chroma vector store.

Usage:
    cd backend
    python ../scripts/seed_cv.py
"""
import sys
import json
from pathlib import Path

# Make sure we can import from the backend app
sys.path.append(str(Path(__file__).parent.parent / "backend"))

from app.models.schemas import CVData
from app.services.ingestion import ingest_cv


def main():
    sample_path = Path(__file__).parent / "sample_cv.json"
    with open(sample_path) as f:
        raw = json.load(f)

    cv = CVData(**raw)
    count = ingest_cv(cv)
    print(f"\n✅ Done — {count} chunks indexed for user: {cv.user_id}")
    print("You can now POST to /api/v1/chat with:")
    print(f'  {{"user_id": "{cv.user_id}", "message": "Tell me about your projects"}}')


if __name__ == "__main__":
    main()
