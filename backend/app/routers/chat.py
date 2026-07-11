from fastapi import APIRouter
from pydantic import BaseModel

from app.rag.retrieval import search_documents

router = APIRouter()


class Question(BaseModel):
    question: str


@router.post("/ask")
async def ask_question(data: Question):

    results = search_documents(data.question)

    answer = results["documents"][0][0]

    return {
        "question": data.question,
        "answer": answer
    }