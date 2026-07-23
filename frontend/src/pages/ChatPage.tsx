import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Sparkles,
  Copy,
  Download,
  Trash2,
  FileText,
  Hash,
  Layers,
  Clock,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import DocumentViewer from '../components/DocumentViewer';
import EmptyState from '../components/EmptyState';
import TypingIndicator from '../components/TypingIndicator';
import { useToast } from '../context/ToastContext';
import { askQuestion, type ChatSource } from "../services/api";
import { cn } from "../utils/cn";
interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  sources?: ChatSource[];
  timestamp?: string;
}

let msgId = 0;

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined);
  const [pdfName, setPdfName] = useState<string | undefined>(undefined);
  const [pdfPages, setPdfPages] = useState<number | undefined>(undefined);
  const [mobilePanel, setMobilePanel] = useState<'viewer' | 'chat'>('chat');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { notify } = useToast();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handlePdfSelect = useCallback(
    (file: File) => {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        notify('Please select a PDF file', 'error');
        return;
      }
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setPdfName(file.name);
      setPdfPages(undefined);
      notify('Document loaded', 'success');
    },
    [pdfUrl, notify],
  );

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  async function send() {
    const question = input.trim();
    if (!question || loading) return;

    const userMsg: Message = { id: ++msgId, role: 'user', text: question };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await askQuestion(question);
      setMessages((m) => [
        ...m,
        {
          id: ++msgId,
          role: 'ai',
          text: res.answer,
          sources: res.sources,
          timestamp: res.timestamp,
        },
      ]);
      notify('Answer Generated', 'success');
    } catch {
      notify('Error fetching answer', 'error');
    } finally {
      setLoading(false);
    }
  }

  function copyAnswer(text: string) {
    navigator.clipboard.writeText(text);
    notify('Copied Successfully', 'success');
  }

  function clearChat() {
    setMessages([]);
    notify('Conversation cleared', 'info');
  }

  function downloadChat() {
    const lines = messages.map((m) =>
      m.role === 'user' ? `User: ${m.text}` : `AI: ${m.text}`,
    );
    const blob = new Blob([lines.join('\n\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'intellidocs-chat.txt';
    a.click();
    URL.revokeObjectURL(url);
    notify('Chat Downloaded', 'success');
  }

  return (
    <div className="flex flex-col gap-3" style={{ height: 'calc(100vh - 7rem)' }}>
      {/* Hidden file input for PDF selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handlePdfSelect(file);
        }}
      />

      {/* Mobile panel toggle */}
      <div className="flex items-center gap-1 rounded-xl border border-white/5 bg-surface-900/40 p-1 lg:hidden">
        <button
          onClick={() => setMobilePanel('viewer')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors',
            mobilePanel === 'viewer' ? 'bg-primary-500/15 text-primary-300' : 'text-surface-400 hover:text-white',
          )}
        >
          <FileText className="h-3.5 w-3.5" />
          Document
        </button>
        <button
          onClick={() => setMobilePanel('chat')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors',
            mobilePanel === 'chat' ? 'bg-primary-500/15 text-primary-300' : 'text-surface-400 hover:text-white',
          )}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Chat
        </button>
      </div>

      {/* Split layout */}
      <div className="grid flex-1 gap-3 overflow-hidden lg:grid-cols-2">
        {/* LEFT: PDF Viewer */}
        <div className={cn('min-h-0', mobilePanel !== 'viewer' && 'hidden lg:block')}>
          <DocumentViewer
            fileUrl={pdfUrl}
            filename={pdfName}
            totalPages={pdfPages}
            className="h-full"
          />
          {!pdfUrl && (
            <div className="absolute inset-0 grid place-items-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] active:scale-95"
              >
                <UploadCloud className="h-4 w-4" />
                Load PDF
              </button>
            </div>
          )}
          {pdfUrl && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-4 top-[3.5rem] z-10 flex items-center gap-1.5 rounded-lg border border-white/10 bg-surface-900/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-surface-800"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              Change
            </button>
          )}
        </div>

        {/* RIGHT: Chat Interface */}
        <div className={cn('glass flex min-h-0 flex-col overflow-hidden', mobilePanel !== 'chat' && 'hidden lg:flex')}>
          {/* Chat header */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 shadow-glow">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI Chat</p>
                <p className="text-[10px] text-surface-400">Grounded in your documents</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={downloadChat}
                disabled={messages.length === 0}
                className="grid h-8 w-8 place-items-center rounded-lg text-surface-300 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
                aria-label="Download chat"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={clearChat}
                disabled={messages.length === 0}
                className="grid h-8 w-8 place-items-center rounded-lg text-error-400 transition-colors hover:bg-error-500/10 disabled:opacity-30"
                aria-label="Clear conversation"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 && !loading && (
              <div className="grid h-full place-items-center">
                <EmptyState
                  icon={MessageSquare}
                  title="No chat history"
                  description="Ask a question about your document. Answers include source citations, page numbers, and confidence scores."
                />
              </div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex gap-3', m.role === 'user' && 'justify-end')}
                >
                  {m.role === 'ai' && (
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 shadow-glow">
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                  <div className={cn('max-w-[85%]', m.role === 'user' && 'flex flex-col items-end')}>
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-3 text-sm leading-relaxed',
                        m.role === 'user'
                          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                          : 'bg-surface-800/60 text-surface-200 ring-1 ring-white/5',
                      )}
                    >
                      {m.text}
                    </div>

                    {/* Citation cards */}
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {m.sources.map((s, i) => (
                          <CitationCard key={i} source={s} timestamp={m.timestamp} />
                        ))}
                        <button
                          onClick={() => copyAnswer(m.text)}
                          className="flex items-center gap-1.5 text-[11px] font-medium text-surface-400 transition-colors hover:text-primary-400"
                        >
                          <Copy className="h-3 w-3" />
                          Copy Answer
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 shadow-glow">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="rounded-2xl bg-surface-800/60 px-4 py-3 ring-1 ring-white/5">
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-white/5 p-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-surface-900/40 px-3 py-2 transition-all focus-within:border-primary-500/40 focus-within:ring-2 focus-within:ring-primary-500/20">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask about your document…"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-surface-500 outline-none"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: floating panel switch */}
      {mobilePanel === 'viewer' && (
        <button
          onClick={() => setMobilePanel('chat')}
          className="fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow lg:hidden"
        >
          <MessageSquare className="h-4 w-4" />
          Go to Chat
        </button>
      )}
    </div>
  );
}

function CitationCard({ source, timestamp }: { source: ChatSource; timestamp?: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-surface-900/40 p-3">
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="flex items-center gap-1 font-medium text-surface-200">
          <FileText className="h-3 w-3 text-primary-400" />
          {source.document}
        </span>
        <span className="flex items-center gap-1 text-surface-400">
          <Hash className="h-3 w-3" /> Page {source.page}
        </span>
        <span className="flex items-center gap-1 text-surface-400">
          <Layers className="h-3 w-3" /> Chunk {source.chunk}
        </span>
        <span className="flex items-center gap-1 rounded-md bg-primary-500/10 px-1.5 py-0.5 font-medium text-primary-300">
        {source.confidence} Confidence
        </span>
        {timestamp && (
          <span className="flex items-center gap-1 text-surface-500">
            <Clock className="h-3 w-3" />
            {new Date(timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
}
