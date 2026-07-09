from fastapi import FastAPI

app = FastAPI(
    title="IntelliDocs AI",
    description="AI-powered Document Question Answering System",
    version="1.0.0"
)

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
    