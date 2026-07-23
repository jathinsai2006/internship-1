from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.upload import router as upload_router
from app.routers.chat import router as chat_router
from app.routers.summary import router as summary_router
from app.routers.search import router as search_router
from app.routers.history import router as history_router
app = FastAPI(
    title="IntelliDocs AI",
    description="AI-powered Document Question Answering System",
    version="1.0.0"
)

# Enable CORS
# Enable CORS
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    # Add your Vercel frontend URL here after deployment
    # "https://intellidocs-ai.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Upload API
app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(summary_router)
app.include_router(search_router)
app.include_router(history_router)
@app.get("/")
def root():
    return {
        "message": "Welcome to IntelliDocs AI 🚀"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
    