from sentence_transformers import SentenceTransformer
from functools import lru_cache
from app.core.config import get_settings

settings = get_settings()


@lru_cache()
def get_embedding_model() -> SentenceTransformer:
    """Load the embedding model once and cache it."""
    print(f"[Embeddings] Loading model: {settings.embedding_model}")
    return SentenceTransformer(settings.embedding_model)


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Return embeddings for a list of text strings."""
    model = get_embedding_model()
    embeddings = model.encode(texts, convert_to_numpy=True)
    return embeddings.tolist()


def embed_query(text: str) -> list[float]:
    """Return embedding for a single query string."""
    return embed_texts([text])[0]
