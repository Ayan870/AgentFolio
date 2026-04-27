import chromadb
from chromadb.config import Settings as ChromaSettings
from app.core.config import get_settings
from app.rag.embeddings.embedder import embed_texts, embed_query
from typing import Optional
import uuid

settings = get_settings()

_client: Optional[chromadb.Client] = None


def get_chroma_client() -> chromadb.Client:
    global _client
    if _client is None:
        _client = chromadb.PersistentClient(
            path=settings.chroma_persist_dir,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
    return _client


def get_collection_name(user_id: str) -> str:
    return f"{settings.chroma_collection_prefix}{user_id}"


def get_or_create_collection(user_id: str):
    client = get_chroma_client()
    return client.get_or_create_collection(
        name=get_collection_name(user_id),
        metadata={"hnsw:space": "cosine"},
    )


def upsert_documents(
    user_id: str,
    texts: list[str],
    metadatas: list[dict],
    ids: Optional[list[str]] = None,
) -> int:
    """Embed and store documents in the user's Chroma collection."""
    collection = get_or_create_collection(user_id)
    embeddings = embed_texts(texts)

    if ids is None:
        ids = [str(uuid.uuid4()) for _ in texts]

    collection.upsert(
        documents=texts,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids,
    )
    return len(texts)


def retrieve_relevant(
    user_id: str,
    query: str,
    n_results: int = 5,
) -> list[dict]:
    """Retrieve the top-k most relevant documents for a query."""
    collection = get_or_create_collection(user_id)
    query_embedding = embed_query(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        include=["documents", "metadatas", "distances"],
    )

    docs = []
    for i, doc in enumerate(results["documents"][0]):
        docs.append({
            "text": doc,
            "metadata": results["metadatas"][0][i],
            "score": 1 - results["distances"][0][i],  # cosine similarity
        })
    return docs


def delete_user_collection(user_id: str) -> None:
    client = get_chroma_client()
    client.delete_collection(get_collection_name(user_id))
