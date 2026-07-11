import chromadb

# Create a persistent ChromaDB client
client = chromadb.PersistentClient(path="chroma_db")

# Create or get a collection
collection = client.get_or_create_collection(
    name="documents"
)


def store_embeddings(chunks, embeddings):
    """
    Store text chunks and their embeddings in ChromaDB.
    """

    ids = [str(i) for i in range(len(chunks))]

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings.tolist()
    )

    return len(chunks)