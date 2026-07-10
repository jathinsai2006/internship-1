import fitz

def extract_text(pdf_path):
    document = fitz.open(pdf_path)

    text = ""

    for page in document:
        text += page.get_text()

    page_count = len(document)

    document.close()

    return {
        "text": text,
        "pages": page_count,
        "characters": len(text)
    }