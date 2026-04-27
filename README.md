# 🤖 AgentFolio

> An AI-powered portfolio platform where your personal agent answers questions *as you* — backed by your CV data and LinkedIn activity.

## Tech Stack

| Layer | Technology |
|---|---|
| Orchestration | LangGraph |
| LLM Tools & Retrievers | LangChain |
| Vector DB | Chroma |
| LLM API | OpenRouter (Llama 3 / Mistral) |
| Embeddings | HuggingFace sentence-transformers |
| Backend | FastAPI |
| Frontend | Next.js 14 (App Router) |
| Auth | NextAuth.js + Supabase |

## Project Structure

```
agentfolio/
├── backend/           # FastAPI + LangGraph agent
│   └── app/
│       ├── api/       # Route handlers
│       ├── agents/    # LangGraph graph, nodes, prompts
│       ├── rag/       # Embeddings + retriever
│       ├── models/    # Pydantic schemas
│       ├── services/  # Business logic
│       └── core/      # Config, DB, settings
├── frontend/          # Next.js app
│   └── src/
│       ├── app/       # App router pages
│       ├── components/
│       ├── hooks/
│       └── lib/
├── scripts/           # Data ingestion, scraping utilities
├── shared/            # Shared types/constants
└── docs/              # Architecture docs
```

## Getting Started

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # Fill in your keys
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Phases

- [x] Phase 1 — Core agent + RAG pipeline
- [ ] Phase 2 — Frontend + Auth
- [ ] Phase 3 — LinkedIn scraper
- [ ] Phase 4 — Multi-user support
