from fastapi import APIRouter, UploadFile, File
import shutil
import os
import uuid
import json
from datetime import datetime

from app.services.pdf_service import extract_text
from app.rag.chunker import split_text
from app.rag.embeddings import generate_embeddings
from app.rag.vector_store import store_embeddings

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

HISTORY_FILE = "history.json"

# Create history file if it doesn't exist
if not os.path.exists(HISTORY_FILE):
    with open(HISTORY_FILE, "w") as f:
        json.dump([], f)


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    # Validate PDF
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

    # Extract PDF text
    pdf_data = extract_text(file_path)

    all_chunks = []
    all_metadata = []

    chunk_number = 0

    # Process page by page
    for page_data in pdf_data["pages"]:

        page_chunks = split_text(page_data["text"])

        for chunk in page_chunks:

            all_chunks.append(chunk)

            all_metadata.append({
                "document": file.filename,
                "page": page_data["page"],
                "chunk": chunk_number
            })

            chunk_number += 1

    # Generate embeddings
    embeddings = generate_embeddings(all_chunks)

    # Store embeddings in ChromaDB
    stored_chunks = store_embeddings(
        chunks=all_chunks,
        embeddings=embeddings,
        metadata=all_metadata
    )

    # -----------------------------
    # Save upload history
    # -----------------------------
    try:
        with open(HISTORY_FILE, "r") as f:
            history = json.load(f)

        history.append({
            "filename": file.filename,
            "pages": pdf_data["page_count"],
            "characters": pdf_data["characters"],
            "chunk_count": stored_chunks,
            "uploaded_at": datetime.now().strftime("%d-%m-%Y %H:%M:%S")
        })

        with open(HISTORY_FILE, "w") as f:
            json.dump(history, f, indent=4)

    except Exception as e:
        print("History save error:", e)

    # Response
    return {
        "success": True,
        "original_filename": file.filename,
        "stored_filename": unique_filename,
        "pages": pdf_data["page_count"],
        "characters": pdf_data["characters"],
        "chunk_count": stored_chunks,
        "embedding_model": "all-MiniLM-L6-v2",
        "vector_database": "ChromaDB",
        "status": "Processed Successfully",
        "message": "PDF uploaded, embedded and stored successfully!"
    }