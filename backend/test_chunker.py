from app.rag.chunker import split_text

sample_text = """
Artificial Intelligence is transforming industries.

Machine Learning is a subset of AI.

Deep Learning uses neural networks.

Natural Language Processing helps computers understand language.
""" * 100

chunks = split_text(sample_text)

print("Total Chunks:", len(chunks))

print("\nFirst Chunk:\n")

print(chunks[0])

print("\nSecond Chunk:\n")

print(chunks[1])