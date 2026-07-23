import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def generate_answer(context: str, question: str):

    prompt = f"""
You are an AI assistant.

Answer ONLY using the information provided below.

If the answer is not present, reply:

"I couldn't find that information in the uploaded document."

DOCUMENT:
{context}

QUESTION:
{question}
"""

    response = client.models.generate_content(
    model="models/gemini-3.5-flash",
    contents=prompt
)

    return response.text