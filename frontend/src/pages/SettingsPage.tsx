import { motion } from 'framer-motion';
import {
  Settings,
  Server,
  Sparkles,
  Database,
  Boxes,
  FileStack,
  Tag,
  Sun,
  Moon,
  Info,
  Github,
  Palette,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useTheme } from '../context/ThemeContext';

const appInfo = [
  { icon: Server, label: 'Backend', value: 'FastAPI' },
  { icon: Sparkles, label: 'AI Model', value: 'Gemini 3.5 Flash' },
  { icon: Boxes, label: 'Embedding Model', value: 'all-MiniLM-L6-v2' },
  { icon: Database, label: 'Vector Database', value: 'ChromaDB' },
  { icon: FileStack, label: 'PDF Processing', value: 'PyMuPDF' },
  { icon: Tag, label: 'Version', value: '1.0.0' },
];

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <PageHeader
        icon={Settings}
        title="Settings"
        subtitle="Application information and configuration for IntelliDocs AI."
      />

      {/* Application Information */}
      <section className="mb-6">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-white">
          <Info className="h-5 w-5 text-primary-400" />
          Application Information
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {appInfo.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass flex items-center gap-4 p-5 transition-colors hover:bg-white/5"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 ring-1 ring-white/10">
                <item.icon className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <p className="text-xs text-surface-400">{item.label}</p>
                <p className="mt-0.5 text-sm font-semibold text-white">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Theme Toggle */}
      <section className="mb-6">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-white">
          <Palette className="h-5 w-5 text-accent-400" />
          Appearance
        </h2>
        <div className="glass flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-500/10">
              {theme === 'dark' ? <Moon className="h-5 w-5 text-primary-400" /> : <Sun className="h-5 w-5 text-primary-400" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Theme</p>
              <p className="text-xs text-surface-400">
                Currently using {theme === 'dark' ? 'dark' : 'light'} mode
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            role="switch"
            aria-checked={theme === 'dark'}
            className={`relative h-7 w-14 rounded-full transition-colors ${
              theme === 'dark' ? 'bg-primary-500' : 'bg-surface-600'
            }`}
          >
            <motion.span
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`absolute top-1 grid h-5 w-5 place-items-center rounded-full bg-white shadow ${
                theme === 'dark' ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* About Project */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-white">
          <Info className="h-5 w-5 text-secondary-400" />
          About IntelliDocs AI
        </h2>
        <div className="glass p-6">
          <p className="text-sm leading-relaxed text-surface-300">
            IntelliDocs AI is an AI-powered document intelligence application built using Retrieval
            Augmented Generation (RAG). Upload PDF documents, chat with them using AI, generate
            summaries, perform semantic search, and retrieve grounded answers with citations. The
            backend is powered by FastAPI, Gemini 3.5 Flash, ChromaDB, Sentence Transformers
            (all-MiniLM-L6-v2), and PyMuPDF.
          </p>

          <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-5">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Github className="h-4 w-4" />
              GitHub Repository
            </a>
            <span className="text-xs text-surface-500">Placeholder link — update with your repo URL</span>
          </div>
        </div>
      </section>
    </div>
  );
}
