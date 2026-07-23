import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  Maximize2,
} from 'lucide-react';
import { cn } from '../utils/cn';

interface DocumentViewerProps {
  /** URL or object URL of the PDF to display */
  fileUrl?: string;
  /** Fallback filename to show in header when no file is loaded */
  filename?: string;
  /** Total pages (from backend metadata) */
  totalPages?: number;
  className?: string;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.25;

export default function DocumentViewer({
  fileUrl,
  filename,
  totalPages,
  className,
}: DocumentViewerProps) {
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const zoomIn = useCallback(() => setScale((s) => Math.min(MAX_SCALE, +(s + SCALE_STEP).toFixed(2))), []);
  const zoomOut = useCallback(() => setScale((s) => Math.max(MIN_SCALE, +(s - SCALE_STEP).toFixed(2))), []);
  const resetZoom = useCallback(() => setScale(1), []);

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
      if (e.key === '0') resetZoom();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [zoomIn, zoomOut, resetZoom]);

  // Reset scroll when file changes
  useEffect(() => {
    setCurrentPage(1);
    setScale(1);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [fileUrl]);

  function pageBack() {
    setCurrentPage((p) => Math.max(1, p - 1));
  }
  function pageForward() {
    const max = totalPages ?? 1;
    setCurrentPage((p) => Math.min(max, p + 1));
  }

  return (
    <div className={cn('glass flex flex-col overflow-hidden', className)}>
      {/* Sticky toolbar */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <FileText className="h-4 w-4 shrink-0 text-primary-400" />
          <span className="truncate text-sm font-medium text-white">
            {filename ?? 'No document loaded'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* Page navigation */}
          <button
            onClick={pageBack}
            disabled={!fileUrl || currentPage <= 1}
            className="grid h-8 w-8 place-items-center rounded-lg text-surface-300 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-1 text-xs font-medium text-surface-400">
            {fileUrl ? `Page ${currentPage}` : '—'} {totalPages ? `/ ${totalPages}` : ''}
          </span>
          <button
            onClick={pageForward}
            disabled={!fileUrl || (totalPages != null && currentPage >= totalPages)}
            className="grid h-8 w-8 place-items-center rounded-lg text-surface-300 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="mx-1 h-5 w-px bg-white/10" />

          {/* Zoom controls */}
          <button
            onClick={zoomOut}
            disabled={!fileUrl || scale <= MIN_SCALE}
            className="grid h-8 w-8 place-items-center rounded-lg text-surface-300 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={resetZoom}
            disabled={!fileUrl}
            className="px-2 text-xs font-medium text-surface-300 transition-colors hover:text-white disabled:opacity-30"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            onClick={zoomIn}
            disabled={!fileUrl || scale >= MAX_SCALE}
            className="grid h-8 w-8 place-items-center rounded-lg text-surface-300 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* PDF content area */}
      <div ref={scrollRef} className="flex-1 overflow-auto bg-surface-950/60">
        {fileUrl ? (
          <div className="flex min-h-full justify-center p-4">
            <object
              data={`${fileUrl}#page=${currentPage}&zoom=${Math.round(scale * 100)}&toolbar=0&navpanes=0`}
              type="application/pdf"
              className="h-full w-full max-w-3xl rounded-lg shadow-2xl"
              style={{ minHeight: '100%' }}
            >
              <div className="grid h-full place-items-center p-8 text-center">
                <div>
                  <FileText className="mx-auto h-10 w-10 text-surface-500" />
                  <p className="mt-3 text-sm text-surface-400">
                    Your browser does not support inline PDF viewing.
                  </p>
                  <a
                    href={fileUrl}
                    download={filename}
                    className="mt-3 inline-block rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            </object>
          </div>
        ) : (
          <div className="grid h-full place-items-center p-8 text-center">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-surface-800/60 ring-1 ring-white/5">
                <FileText className="h-8 w-8 text-surface-500" />
              </div>
              <p className="mt-4 text-sm font-medium text-surface-300">No document loaded</p>
              <p className="mt-1 max-w-xs text-xs text-surface-500">
                Upload a PDF to view it here, or select one from your recent documents.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
