from fastapi import APIRouter
import chromadb

from app.services.summary_service import generate_summary

router = APIRouter()

client = chromadb.PersistentClient(path="chroma_db")

collection = client.get_or_create_collection(
    name="documents"
)


@router.get("/summary")
async def get_summary():

    data = collection.get()

    documents = data["documents"]

    if not documents:
        return {
            "summary": "No document found."
        }

    text = "\n".join(documents)

    summary = generate_summary(text)

    return {
        "summary": summary
    }