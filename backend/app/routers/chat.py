from fastapi import APIRouter
from pydantic import BaseModel

from app.rag.retrieval import search_documents
from app.services.gemini_service import generate_answer

router = APIRouter()


class Question(BaseModel):
    question: str


@router.post("/ask")
async def ask_question(data: Question):
    try:
        # Search vector database
        results = search_documents(data.question)

        documents = results["documents"]
        metadatas = results["metadatas"]
        distances = results["distances"]

        if len(documents) == 0:
            return {
                "success": False,
                "message": "No relevant document found."
            }

        # Combine retrieved chunks into context
        context = "\n\n".join(documents)

        answer = generate_answer(
            context=context,
            question=data.question
        )

        source = metadatas[0]

        # Calculate confidence
        confidence = "Low"

        if len(distances) > 0:
            score = distances[0]

            if score < 0.5:
                confidence = "High"
            elif score < 1.0:
                confidence = "Medium"

        return {
            "success": True,
            "question": data.question,
            "answer": answer,
            "source_document": source.get("document", "Unknown"),
            "page": source.get("page", "Unknown"),
            "chunk": source.get("chunk", "Unknown"),
            "confidence": confidence
        }

    except Exception as e:
        import traceback
        traceback.print_exc()

        return {
            "success": False,
            "message": str(e)
        }