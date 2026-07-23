import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  History,
  FileText,
  Calendar,
  FileDigit,
  Type,
  Layers,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { getHistory, type HistoryItem } from "../services/api";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        icon={History}
        title="Recent History"
        subtitle="Previously uploaded PDFs and document statistics."
      />

      {loading ? (
        <p className="text-surface-400">Loading...</p>
      ) : history.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No document uploaded"
          description="Upload a PDF to see it here."
        />
      ) : (
        <div className="grid gap-4">
          {history.map((doc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-primary-500/10 p-3">
                  <FileText className="h-7 w-7 text-primary-400" />
                </div>

                <div className="flex-1">

                  <h2 className="text-lg font-semibold text-white">
                    {doc.filename}
                  </h2>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-surface-300">

                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {doc.uploaded_at}
                    </div>

                    <div className="flex items-center gap-2">
                      <FileDigit size={16} />
                      {doc.pages} Pages
                    </div>

                    <div className="flex items-center gap-2">
                      <Type size={16} />
                      {doc.characters.toLocaleString()} Characters
                    </div>

                    <div className="flex items-center gap-2">
                      <Layers size={16} />
                      {doc.chunk_count} Chunks
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}