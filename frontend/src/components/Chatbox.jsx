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
      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);

      alert("Failed to get answer.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-slate-900 p-6 rounded-2xl border border-cyan-500">

      <h2 className="text-3xl font-bold text-cyan-400">
        🤖 Ask AI
      </h2>

     <textarea
     autoFocus
  className="w-full mt-6 p-4 rounded-xl bg-slate-800 outline-none"
  rows="4"
 placeholder="Example: Explain stack organization or summarize chapter 2..."
  value={question}
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
  {loading ? "🤖 Thinking..." : "Ask AI"}
</button>

      {loading && (
        <div className="mt-6 text-cyan-400 text-lg font-semibold">
          🤖 AI is thinking...
        </div>
      )}

      {messages.map((msg, index) => (
        <div
          key={index}
          className="mt-8 bg-slate-800 rounded-xl p-5"
        >
          <h3 className="text-cyan-400 text-xl font-bold">
            👤 You
          </h3>

          <p className="mt-3">
            {msg.question}
          </p>

          <h3 className="text-green-400 text-xl font-bold mt-6">
            🤖 AI
          </h3>

          <p className="mt-3 whitespace-pre-wrap">
            {msg.answer}
          </p>
        </div>
      ))}

    </div>
  );
}

export default ChatBox;