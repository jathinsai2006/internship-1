from app.rag.retrieval import search_documents

query = "What is Artificial Intelligence?"

results = search_documents(query)

print("Retrieved Chunks:\n")

for doc in results["documents"][0]:
    print("-" * 60)
    print(doc)