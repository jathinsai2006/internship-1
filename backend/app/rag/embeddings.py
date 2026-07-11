from sentence_transformers import SentenceTransformer

# Load embedding model only once
model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embeddings(chunks):
    """
    Convert text chunks into vector embeddings.
    """

    embeddings = model.encode(chunks)

    return embeddings