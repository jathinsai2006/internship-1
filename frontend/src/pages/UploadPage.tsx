import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2,
  X,
  FileStack,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import { uploadPdf, type UploadResult } from "../services/api";import { cn } from '../utils/cn';

type QueueStatus = 'uploading' | 'processing' | 'done' | 'error';

interface QueueItem {
  id: number;
  file: File;
  progress: number;
  status: QueueStatus;
  result?: UploadResult;
}

let queueId = 0;

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { notify } = useToast();

  const processFile = useCallback(
    async (item: QueueItem) => {
      setQueue((q) => q.map((i) => (i.id === item.id ? { ...i, status: 'uploading', progress: 0 } : i)));

      try {
        const res = await uploadPdf(item.file, (pct) => {
          setQueue((q) => q.map((i) => (i.id === item.id ? { ...i, progress: pct } : i)));
        });

        setQueue((q) => q.map((i) => (i.id === item.id ? { ...i, status: 'processing' } : i)));
        setTimeout(() => {
          setQueue((q) => q.map((i) => (i.id === item.id ? { ...i, status: 'done', result: res } : i)));
          notify('Upload Successful', 'success');
        }, 1000);
      } catch {
        setQueue((q) => q.map((i) => (i.id === item.id ? { ...i, status: 'error' } : i)));
        notify('Upload Failed', 'error');
      }
    },
    [notify],
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const pdfs = Array.from(files).filter(
        (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'),
      );
      if (pdfs.length === 0) {
        notify('Please upload PDF files only', 'error');
        return;
      }

      const newItems: QueueItem[] = pdfs.map((file) => ({
        id: ++queueId,
        file,
        progress: 0,
        status: 'uploading',
      }));

      setQueue((q) => [...newItems, ...q]);
      newItems.forEach((item) => processFile(item));
    },
    [processFile, notify],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  function removeItem(id: number) {
    setQueue((q) => q.filter((i) => i.id !== id));
  }

  const hasQueue = queue.length > 0;

  return (
    <div>
      <PageHeader
        icon={UploadCloud}
        title="Upload Documents"
        subtitle="Upload PDFs for RAG processing — text extraction, embedding, and indexing."
      />

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          if (inputRef.current) inputRef.current.value = '';
        }}
      />

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'glass grid cursor-pointer place-items-center border-2 border-dashed p-10 text-center transition-all sm:p-14',
          isDragging ? 'border-primary-400 bg-primary-500/10 scale-[1.01]' : 'border-white/10 hover:border-primary-500/40',
        )}
      >
        <motion.div
          animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
          className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 ring-1 ring-white/10"
        >
          <UploadCloud className="h-8 w-8 text-primary-400" />
        </motion.div>
        <p className="mt-5 text-sm font-semibold text-white">
          {isDragging ? 'Drop your PDFs here' : 'Drag & drop PDFs here'}
        </p>
        <p className="mt-1 text-xs text-surface-400">
          or <span className="text-primary-400">browse</span> from your computer
        </p>
        <p className="mt-2 text-[11px] text-surface-500">PDF files only — up to 50MB per file</p>
      </div>

      {/* Upload Queue */}
      {hasQueue && (
        <div className="mt-6">
          <h2 className="mb-3 font-display text-sm font-semibold text-white">
            Upload Queue <span className="text-surface-500">({queue.length})</span>
          </h2>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {queue.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass p-4"
                >
                  <div className="flex items-center gap-3">
                    {/* Status icon */}
                    <StatusIcon status={item.status} />

                    {/* File info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{item.file.name}</p>
                      {item.status === 'uploading' && (
                        <p className="text-xs text-surface-400">Uploading… {item.progress}%</p>
                      )}
                      {item.status === 'processing' && (
                        <p className="text-xs text-primary-400">Processing…</p>
                      )}
                      {item.status === 'done' && item.result && (
                        <p className="text-xs text-accent-400">Processed Successfully</p>
                      )}
                      {item.status === 'error' && (
                        <p className="text-xs text-error-400">Upload Failed</p>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-surface-400 transition-colors hover:bg-white/5 hover:text-white"
                      aria-label="Remove from queue"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Progress bar */}
                  {item.status === 'uploading' && (
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-700/50">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                        animate={{ width: `${item.progress}%` }}
                        transition={{ ease: 'easeOut' }}
                      />
                    </div>
                  )}

                  {/* Processing animation */}
                  {item.status === 'processing' && (
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-surface-500">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Extracting text · Embedding · Indexing in ChromaDB</span>
                    </div>
                  )}

                  {/* Success details */}
                  {item.status === 'done' && item.result && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <DetailChip icon={FileStack} label="Pages" value={String(item.result.pages)} />
                      <DetailChip icon={FileText} label="Characters" value={item.result.characters.toLocaleString()} />
                      <DetailChip icon={Calendar} label="Upload Date" value={new Date(item.result.uploadTime).toLocaleDateString()} />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!hasQueue && (
        <div className="mt-6">
          <EmptyState
            icon={FileText}
            title="No documents uploaded"
            description="Upload a PDF to extract text, generate embeddings, and index it in ChromaDB for AI-powered question answering."
          />
        </div>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: QueueStatus }) {
  if (status === 'uploading' || status === 'processing')
    return <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary-400" />;
  if (status === 'done')
    return <CheckCircle2 className="h-5 w-5 shrink-0 text-accent-400" />;
  return <AlertCircle className="h-5 w-5 shrink-0 text-error-400" />;
}

function DetailChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-surface-900/40 px-3 py-2">
      <div className="flex items-center gap-1 text-[10px] text-surface-400">
        <Icon className="h-2.5 w-2.5" />
        {label}
      </div>
      <p className="mt-0.5 text-xs font-semibold text-white">{value}</p>
    </div>
  );
}
