import fitz


def extract_text(pdf_path):
    document = fitz.open(pdf_path)

    pages = []

    total_characters = 0

    for page_number, page in enumerate(document, start=1):
        text = page.get_text().strip()

        total_characters += len(text)

        pages.append(
            {
                "page": page_number,
                "text": text
            }
        )

    document.close()

    return {
        "pages": pages,
        "page_count": len(pages),
        "characters": total_characters
    }