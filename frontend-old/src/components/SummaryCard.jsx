import { useState } from "react";
import api from "../api/api";

function SummaryCard() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const getSummary = async () => {
    try {
      setLoading(true);

      const response = await api.get("/summary");

      setSummary(response.data.summary);

      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Failed to generate summary.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-slate-900 border border-cyan-500 rounded-2xl p-6">

      <h2 className="text-3xl font-bold text-cyan-400">
        📑 AI Summary
      </h2>

      <button
        onClick={getSummary}
        className="mt-6 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl"
      >
        {loading ? "Generating..." : "Generate Summary"}
      </button>

      {summary && (
        <div className="mt-6 bg-slate-800 p-5 rounded-xl whitespace-pre-wrap">
          {summary}
        </div>
      )}

    </div>
  );
}

export default SummaryCard;