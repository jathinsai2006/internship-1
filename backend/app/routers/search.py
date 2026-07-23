from fastapi import APIRouter
from pydantic import BaseModel

from app.rag.retrieval import search_documents

router = APIRouter()


class SearchQuery(BaseModel):
    query: str


@router.post("/search")
async def semantic_search(data: SearchQuery):
    try:
        results = search_documents(data.query)

        documents = results["documents"]
        metadatas = results["metadatas"]
        distances = results["distances"]

        search_results = []

        for doc, meta, distance in zip(documents, metadatas, distances):

            similarity = max(0, min(100, round((1 / (1 + distance)) * 100, 2)))  

            search_results.append({
                "document": meta.get("document", "Unknown"),
                "page": meta.get("page", 0),
                "chunk": meta.get("chunk", 0),
                "similarity": similarity,
                "matched_text": doc
            })

        return {
            "success": True,
            "results": search_results
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }