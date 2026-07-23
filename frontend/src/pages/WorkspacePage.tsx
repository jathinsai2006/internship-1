import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UploadCloud,
  MessageSquare,
  ScrollText,
  Search,
  FileText,
  History,
  ArrowRight,
  Upload,
  Boxes,
  Scissors,
  Database,
  ScanSearch,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

const quickActions: { icon: LucideIcon; label: string; to: string; color: string }[] = [
  { icon: UploadCloud, label: 'Upload PDF', to: '/upload', color: 'from-primary-500 to-accent-500' },
  { icon: MessageSquare, label: 'Chat with Documents', to: '/chat', color: 'from-secondary-500 to-primary-500' },
  { icon: ScrollText, label: 'Generate Summary', to: '/summaries', color: 'from-accent-500 to-secondary-500' },
  { icon: Search, label: 'Semantic Search', to: '/search', color: 'from-primary-500 to-secondary-500' },
];

const pipeline: { icon: LucideIcon; label: string; sub: string }[] = [
  { icon: Upload, label: 'Upload PDF', sub: 'FastAPI endpoint' },
  { icon: FileText, label: 'Extract Text', sub: 'PyMuPDF' },
  { icon: Scissors, label: 'Chunk Text', sub: 'Sentence splitting' },
  { icon: Boxes, label: 'Generate Embeddings', sub: 'all-MiniLM-L6-v2' },
  { icon: Database, label: 'Vector Search', sub: 'ChromaDB' },
  { icon: Sparkles, label: 'AI Response', sub: 'Gemini 3.5 Flash' },
];

export default function WorkspacePage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Welcome to IntelliDocs AI
        </h1>
        <p className="text-sm text-surface-400">
          Upload a PDF and interact with it using AI — ask questions, generate summaries, and search your documents.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-surface-400">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {quickActions.map((qa, i) => (
            <motion.div
              key={qa.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={qa.to}
                className="glass group flex items-center gap-3 p-4 transition-all hover:bg-white/5"
              >
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br shadow-lg ${qa.color}`}>
                  <qa.icon className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{qa.label}</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-surface-600 transition-colors group-hover:text-primary-400" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RAG Pipeline */}
      <section>
        <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-surface-400">
          RAG Pipeline
        </h2>
        <div className="glass p-5">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {pipeline.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className="relative"
              >
                <div className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-surface-900/40 p-4 text-center transition-colors hover:border-primary-500/20">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 ring-1 ring-white/10">
                    <step.icon className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{step.label}</p>
                    <p className="text-[10px] text-surface-500">{step.sub}</p>
                  </div>
                </div>
                {/* Connector arrow */}
                {i < pipeline.length - 1 && (
                  <div className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-surface-600 lg:block">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Documents + Recent Chats + Recent Summaries */}
      <div className="grid gap-4 lg:grid-cols-3">
        <RecentPanel
          icon={FileText}
          title="Recent Documents"
          emptyTitle="No documents uploaded"
          emptyDesc="Upload a PDF to get started."
          actionLabel="Upload PDF"
          actionTo="/upload"
        />
        <RecentPanel
          icon={MessageSquare}
          title="Recent Chats"
          emptyTitle="No chat history"
          emptyDesc="Ask a question about your documents."
          actionLabel="Start Chat"
          actionTo="/chat"
        />
        <RecentPanel
          icon={ScrollText}
          title="Recent Summaries"
          emptyTitle="No summaries generated"
          emptyDesc="Generate an AI summary from a document."
          actionLabel="Generate Summary"
          actionTo="/summaries"
        />
      </div>
    </div>
  );
}

function RecentPanel({
  icon: Icon,
  title,
  emptyTitle,
  emptyDesc,
  actionLabel,
  actionTo,
}: {
  icon: LucideIcon;
  title: string;
  emptyTitle: string;
  emptyDesc: string;
  actionLabel: string;
  actionTo: string;
}) {
  return (
    <div className="glass flex flex-col p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary-400" />
        <h3 className="font-display text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-surface-800/60 ring-1 ring-white/5">
            <Icon className="h-6 w-6 text-surface-500" />
          </div>
          <p className="mt-3 text-sm font-medium text-surface-300">{emptyTitle}</p>
          <p className="mt-1 text-xs text-surface-500">{emptyDesc}</p>
        </div>
        <Link
          to={actionTo}
          className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-white/5 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
        >
          {actionLabel}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
