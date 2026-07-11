from app.rag.embeddings import generate_embeddings

chunks = [
    "Artificial Intelligence is changing the world.",
    "Machine Learning is a subset of AI.",
    "Deep Learning uses neural networks."
]

embeddings = generate_embeddings(chunks)

print("Total Embeddings:", len(embeddings))

print()

print("Dimension of first embedding:", len(embeddings[0]))