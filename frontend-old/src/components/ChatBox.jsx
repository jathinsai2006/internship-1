import { useState } from "react";
import api from "../api/api";
import jsPDF from "jspdf";

function ChatBox({ recentQuestions, setRecentQuestions }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);

      const response = await api.post("/ask", {
        question: question,
      });

      setMessages((prev) => [
        ...prev,
        {
          question,
          answer: response.data.answer,
          source: response.data.source_document,
          page: response.data.page,
          chunk: response.data.chunk,
          confidence: response.data.confidence,
          time: new Date().toLocaleTimeString(),
        },
      ]);

      // Save recent questions (latest 5, no duplicates)
      setRecentQuestions((prev) =>
        [question, ...prev.filter((q) => q !== question)].slice(0, 5)
      );

      setQuestion("");
    } catch (error) {
      console.log(error);
      alert("Failed to get answer.");
    } finally {
      setLoading(false);
    }
  };

  const downloadChat = () => {
    if (messages.length === 0) {
      alert("No chat available to export.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("IntelliDocs AI - Chat History", 20, 20);

    let y = 35;

    messages.forEach((msg, index) => {
      doc.setFontSize(12);

      doc.text(`Question ${index + 1}:`, 20, y);
      y += 8;

      const qLines = doc.splitTextToSize(msg.question, 170);
      doc.text(qLines, 20, y);
      y += qLines.length * 7 + 5;

      doc.text("Answer:", 20, y);
      y += 8;

      const aLines = doc.splitTextToSize(msg.answer, 170);
      doc.text(aLines, 20, y);
      y += aLines.length * 7 + 8;

      doc.text(`Time: ${msg.time}`, 20, y);
      y += 15;

      if (y > 260) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("ChatHistory.pdf");
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-slate-900 rounded-2xl border border-cyan-500 overflow-hidden shadow-xl">

      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-cyan-500">
        <h2 className="text-3xl font-bold text-cyan-400">
          🤖 Ask AI
        </h2>

        <div className="flex gap-3">
          <button
            onClick={downloadChat}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition"
          >
            📄 Export PDF
          </button>

          <button
            onClick={() => setMessages([])}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
          >
            🗑 Clear Chat
          </button>
        </div>
      </div>

      {/* Chat History */}
      <div className="max-h-[500px] overflow-y-auto p-6 space-y-6">

        {messages.length === 0 && !loading && (
          <div className="text-center text-gray-400 py-16">
            <h3 className="text-2xl font-semibold">
              👋 Welcome to IntelliDocs AI
            </h3>

            <p className="mt-3">
              Upload a PDF and ask questions about your document.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index}>

            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-cyan-600 text-white rounded-2xl px-5 py-3 max-w-[70%] shadow-lg">
                <p>{msg.question}</p>
              </div>
            </div>

            {/* AI Message */}
            <div className="flex justify-start mt-4">
              <div className="bg-slate-800 border border-cyan-500 rounded-2xl px-5 py-4 max-w-[80%] shadow-lg">

                <p className="whitespace-pre-wrap">
                  {msg.answer}
                </p>

                {/* Source Information */}
                <div className="mt-4 border-t border-slate-700 pt-4 text-sm text-gray-300 space-y-2">

                  <p>
                    📄 <strong>Source:</strong> {msg.source}
                  </p>

                  <p>
                    📑 <strong>Page:</strong> {msg.page}
                  </p>

                  <p>
                    🧩 <strong>Chunk:</strong> {msg.chunk}
                  </p>

                  <p>
                    🟢 <strong>Confidence:</strong> {msg.confidence}
                  </p>

                </div>

                <p className="text-xs text-gray-400 mt-4">
                  {msg.time}
                </p>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(msg.answer);
                    alert("Answer copied!");
                  }}
                  className="mt-4 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg text-sm transition"
                >
                  📋 Copy Answer
                </button>

              </div>
            </div>

          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-cyan-500 rounded-2xl px-5 py-4 animate-pulse">
              🤖 AI is thinking...
            </div>
          </div>
        )}

      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-cyan-500">

        <textarea
          autoFocus
          rows="4"
          value={question}
          placeholder="Example: Explain stack organization or summarize chapter 2..."
          className="w-full p-4 rounded-xl bg-slate-800 outline-none resize-none"
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              askQuestion();
            }
          }}
        />

        <button
          onClick={askQuestion}
          disabled={loading}
          className="mt-5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl transition"
        >
          {loading ? "🤖 Thinking..." : "🚀 Ask AI"}
        </button>

      </div>

    </div>
  );
}

export default ChatBox;