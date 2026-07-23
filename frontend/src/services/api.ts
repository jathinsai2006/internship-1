import axios from "axios";

/**
 * FastAPI Backend URL
 */
const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

/* ==========================================================
   TYPES
========================================================== */

export interface UploadResult {
  filename: string;
  pages: number;
  characters: number;
  uploadTime: string;
  status: "Processed Successfully" | "Processing" | "Failed";
}

export interface ChatSource {
  document: string;
  page: number;
  chunk: number;
  confidence: string;
}

export interface ChatAnswer {
  answer: string;
  sources: ChatSource[];
  timestamp: string;
}

export interface DocumentSummary {
  documentName: string;
  executiveSummary: string;
  keyPoints: string[];
  readingTime: string;
}

export interface SearchResult {
  document: string;
  page: number;
  chunk: number;
  similarity: number;
  matchedText: string;
}

export interface HistoryItem {
  filename: string;
  pages: number;
  characters: number;
  chunk_count: number;
  uploaded_at: string;
}

/* ==========================================================
   REAL FASTAPI APIs
========================================================== */

/**
 * Upload PDF
 */
export async function uploadPdf(
  file: File,
  onProgress?: (pct: number) => void
): Promise<UploadResult> {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },

    onUploadProgress: (event) => {
      if (event.total && onProgress) {
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
    },
  });

  return {
    filename: data.original_filename,
    pages: data.pages,
    characters: data.characters,
    uploadTime: new Date().toISOString(),
    status: data.status,
  };
}

/**
 * Ask Question
 */
export async function askQuestion(
  question: string
): Promise<ChatAnswer> {
  const { data } = await api.post("/ask", {
    question,
  });

  return {
    answer: data.answer,

    timestamp: new Date().toISOString(),

    sources: [
      {
        document: data.source_document,
        page: data.page,
        chunk: data.chunk,
        confidence: data.confidence,
      },
    ],
  };
}

/**
 * Get Summary
 */
export async function getSummary(): Promise<DocumentSummary> {
  const { data } = await api.get("/summary");

  return {
    documentName: "Uploaded Document",
    executiveSummary: data.summary,
    keyPoints: [],
    readingTime: "~1 min",
  };
}

/**
 * Semantic Search
 */
export async function searchDocuments(
  query: string
): Promise<SearchResult[]> {
  try {
    const { data } = await api.post("/search", {
      query,
    });

    return data.results.map((item: any) => ({
      document: item.document,
      page: item.page,
      chunk: item.chunk,
      similarity: item.similarity,
      matchedText: item.matched_text,
    }));
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error.response?.data?.message || "Failed to search documents."
    );
  }
}

/**
 * Upload History
 */
export async function getHistory(): Promise<HistoryItem[]> {
  try {
    const { data } = await api.get("/history");
    return data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error.response?.data?.message || "Failed to load upload history."
    );
  }
}