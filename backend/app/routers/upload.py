from fastapi import APIRouter, UploadFile, File
import shutil
import os
import uuid

from app.services.pdf_service import extract_text
from app.rag.chunker import split_text
router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    # Check file extension
    if not file.filename.lower().endswith(".pdf"):
        return {
            "success": False,
            "message": "Only PDF files are allowed."
        }

    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}.pdf"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        unique_filename
    )

    # Save uploaded PDF
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text
    pdf_data = extract_text(file_path)
    chunks = split_text(pdf_data["text"])
    

    print(pdf_data)
    print(chunks)

    return {
    "success": True,
    "original_filename": file.filename,
    "stored_filename": unique_filename,
    "pages": pdf_data["pages"],
    "characters": pdf_data["characters"],
    "chunk_count": len(chunks),
    "embedding_model": "all-MiniLM-L6-v2",
    "vector_database": "ChromaDB",
    "status": "Processed Successfully",
    "message": "PDF uploaded and processed successfully!"
}