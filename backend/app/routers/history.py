from fastapi import APIRouter
import json
import os

router = APIRouter()

HISTORY_FILE = "history.json"


@router.get("/history")
def get_history():
    if not os.path.exists(HISTORY_FILE):
        return []

    try:
        with open(HISTORY_FILE, "r") as f:
            history = json.load(f)

        history.reverse()
        return history

    except Exception:
        return []