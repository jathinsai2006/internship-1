import re

def generate_summary(text: str):
    if not text:
        return "No document available."

    # Remove extra spaces
    text = re.sub(r"\s+", " ", text)

    # Split into sentences
    sentences = text.split(".")

    # Keep the first 8 meaningful sentences
    summary = []

    for sentence in sentences:
        sentence = sentence.strip()

        if len(sentence) > 40:
            summary.append(sentence)

        if len(summary) == 8:
            break

    return ".\n\n".join(summary) + "."