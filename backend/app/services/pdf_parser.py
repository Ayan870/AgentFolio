import pypdf 
import io
import json
import re
from openai import AsyncOpenAI
from app.core.config import get_settings

settings = get_settings()

_llm = AsyncOpenAI(
    api_key=settings.openrouter_api_key,
    base_url=settings.openrouter_base_url,
)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract raw text from PDF bytes."""
    reader = pypdf.PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text.strip()


async def parse_resume_with_llm(raw_text: str) -> dict:
    """Send raw resume text to LLM and get structured JSON back."""
    
    prompt = f"""You are a resume parser. Extract information from this resume and return ONLY valid JSON with no extra text, no markdown, no backticks.

Return this exact structure:
{{
  "name": "Full name",
  "bio": "2-3 sentence professional summary",
  "location": "City, Country or empty string",
  "github_url": "github URL or empty string",
  "website": "personal website URL or empty string", 
  "linkedin_url": "linkedin URL or empty string",
  "skills": ["skill1", "skill2", "skill3"],
  "projects": [
    {{
      "title": "Project name",
      "description": "What it does",
      "github_url": "github link or empty string",
      "live_url": "live URL or empty string",
      "tech": ["tech1", "tech2"]
    }}
  ],
  "experience": [
    {{
      "company": "Company name",
      "role": "Job title",
      "duration": "2022 - 2024",
      "description": "What you did"
    }}
  ],
  "education": [
    {{
      "institution": "University name",
      "degree": "Degree name",
      "year": "2024"
    }}
  ]
}}

If any field is missing from the resume, use empty string or empty array.
Do not invent information that is not in the resume.

RESUME TEXT:
{raw_text[:4000]}
"""

    response = await _llm.chat.completions.create(
        model="meta-llama/llama-3-8b-instruct",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000,
        temperature=0,
    )

    raw = (response.choices[0].message.content or "").strip()
    
    # Strip any accidental markdown fences
    raw = re.sub(r"```json|```", "", raw).strip()
    
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Try to extract JSON from the response
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            return json.loads(match.group())
        raise ValueError("Could not parse LLM response as JSON")