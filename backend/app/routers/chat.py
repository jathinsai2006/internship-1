from fastapi import APIRouter
from pydantic import BaseModel

from app.rag.retrieval import search_documents
from app.services.gemini_service import generate_answer

router = APIRouter()


class Question(BaseModel):
    question: str


@router.post("/ask")
async def ask_question(data: Question):

    results = search_documents(data.question)

    documents = results["documents"][0]

    context = "\n\n".join(documents)

    answer = generate_answer(
        context=context,
        question=data.question
    )
    return {
    "question": data.question,
    "answer": answer,
    "source": "Relevant Document Chunk",
    "confidence": "High"
}