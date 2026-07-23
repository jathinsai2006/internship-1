import chromadb
import uuid

# Persistent ChromaDB client
client = chromadb.PersistentClient(
    path="chroma_db"
)

# Create collection if not exists
collection = client.get_or_create_collection(
    name="documents"
)


def store_embeddings(chunks, embeddings, metadata):
    """
    Store chunks, embeddings and metadata in ChromaDB.
    """

    ids = [
        str(uuid.uuid4())
        for _ in chunks
    ]

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings.tolist(),
        metadatas=metadata
    )

    return len(chunks)