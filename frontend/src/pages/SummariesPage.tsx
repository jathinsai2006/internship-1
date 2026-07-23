import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScrollText,
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  FileText,
  Clock,
  ListChecks,
  Loader2,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import { getSummary, type DocumentSummary } from "../services/api";
export default function SummariesPage() {
  const [docName, setDocName] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<DocumentSummary | null>(null);
  const { notify } = useToast();

  async function generate() {
    const name = docName.trim() || 'uploaded-document.pdf';
    setLoading(true);
    setSummary(null);
    try {
      const res = await getSummary();
      setSummary(res);
      notify('Summary Generated', 'success');
    } catch {
      notify('Error generating summary', 'error');
    } finally {
      setLoading(false);
    }
  }

  function copySummary() {
    if (!summary) return;
    const text = `${summary.executiveSummary}\n\nKey Points:\n${summary.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    notify('Summary Copied', 'success');
  }

  function downloadSummary() {
    if (!summary) return;
    const text = `IntelliDocs AI — Document Summary\n\nDocument: ${summary.documentName}\nReading Time: ${summary.readingTime}\n\nExecutive Summary:\n${summary.executiveSummary}\n\nKey Points:\n${summary.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-${summary.documentName.replace('.pdf', '')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Summary PDF Downloaded', 'success');
  }

  return (
    <div>
      <PageHeader
        icon={ScrollText}
        title="AI Summaries"
        subtitle="Generate executive summaries and key points from your documents using Gemini 3.5 Flash."
      />

      {/* Generate bar */}
      <div className="glass mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/5 bg-surface-900/40 px-4 py-2.5 transition-all focus-within:border-primary-500/40">
          <FileText className="h-4 w-4 text-surface-400" />
          <input
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            placeholder="Enter document name (e.g. research-paper.pdf)"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-surface-500 outline-none"
          />
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? 'Generating…' : 'Generate Summary'}
        </button>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="glass p-6">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary-400" />
            <p className="text-sm font-medium text-white">Generating summary…</p>
          </div>
          <div className="mt-5 space-y-3">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-4 w-4/5" />
          </div>
        </div>
      )}

      {/* Summary card */}
      <AnimatePresence mode="wait">
        {!loading && summary && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 ring-1 ring-white/10">
                  <ScrollText className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">{summary.documentName}</h3>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-surface-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {summary.readingTime}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={generate}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/5 text-surface-300 transition-colors hover:bg-white/5 hover:text-white"
                  aria-label="Regenerate summary"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="mt-6">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Sparkles className="h-4 w-4 text-primary-400" />
                Executive Summary
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-surface-300">{summary.executiveSummary}</p>
            </div>

            {/* Key Points */}
            <div className="mt-6">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
                <ListChecks className="h-4 w-4 text-accent-400" />
                Key Points
              </h4>
              <ul className="mt-3 space-y-2">
                {summary.keyPoints.map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-2.5"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-primary-400 to-accent-400" />
                    <span className="text-sm leading-relaxed text-surface-300">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-2 border-t border-white/5 pt-5">
              <button
                onClick={copySummary}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Copy className="h-4 w-4" />
                Copy Summary
              </button>
              <button
                onClick={downloadSummary}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Download className="h-4 w-4" />
                Download Summary PDF
              </button>
              <button
                onClick={generate}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate Summary
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!loading && !summary && (
        <EmptyState
          icon={ScrollText}
          title="No summaries generated"
          description="Enter a document name above and click Generate Summary to create an AI-powered executive summary with key points."
        />
      )}
    </div>
  );
}
