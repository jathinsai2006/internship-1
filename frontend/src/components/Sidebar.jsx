import { useState } from "react";
import api from "../api/api";

function ChatBox() {
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
          question: question,
          answer: response.data.answer,
        },
      ]);

      setQuestion("");
    } catch (error) {
      console.log(error);
      alert("Failed to get answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-slate-900 rounded-2xl border border-cyan-500 overflow-hidden shadow-xl">

      {/* Header */}

      <div className="flex justify-between items-center p-6 border-b border-cyan-500">

        <h2 className="text-3xl font-bold text-cyan-400">
          🤖 Ask AI
        </h2>

        <button
          onClick={() => setMessages([])}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
        >
          🗑 Clear Chat
        </button>

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