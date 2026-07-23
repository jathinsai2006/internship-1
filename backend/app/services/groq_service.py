import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_answer(context: str, question: str):
    prompt = f"""
You are IntelliDocs AI.

Answer ONLY using the information provided below.

If the answer is not present in the document, reply exactly:

I couldn't find that information in the uploaded document.

DOCUMENT:
{context}

QUESTION:
{question}

ANSWER:
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
        max_tokens=1024
    )

    return response.choices[0].message.content