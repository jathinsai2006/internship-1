from app.rag.embeddings import generate_embeddings
from app.rag.vector_store import store_embeddings

chunks = [
    "Artificial Intelligence is changing the world.",
    "Machine Learning is a subset of AI.",
    "Deep Learning uses neural networks."
]

embeddings = generate_embeddings(chunks)

count = store_embeddings(chunks, embeddings)

print(f"Stored {count} chunks successfully.")