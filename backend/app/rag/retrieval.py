from sentence_transformers import SentenceTransformer
import chromadb

# Load the same embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Connect to the existing ChromaDB database
client = chromadb.PersistentClient(path="chroma_db")

collection = client.get_or_create_collection(
    name="documents"
)


def search_documents(query, n_results=3):
    """
    Search for the most relevant document chunks.
    """

    query_embedding = model.encode(query)

    results = collection.query(
        query_embeddings=[query_embedding.tolist()],
        n_results=n_results
    )

    return results