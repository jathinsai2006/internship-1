import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FileText,
  Hash,
  Layers,
  Loader2,
  X,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import { searchDocuments, type SearchResult } from '../services/api';
export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await searchDocuments(q);
      setResults(res);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-search if navigated with ?q=
  useEffect(() => {
    const q = params.get('q');
    if (q) {
      setQuery(q);
      doSearch(q);
    }
  }, [params, doSearch]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setParams({ q: query });
      doSearch(query);
    }
  }

  return (
    <div>
      <PageHeader
        icon={Search}
        title="Semantic Search"
        subtitle="Vector search across your documents using all-MiniLM-L6-v2 embeddings and ChromaDB."
      />

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="glass mb-6 flex items-center gap-3 p-2">
        <Search className="ml-3 h-5 w-5 text-surface-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          placeholder="Search for anything across your documents…"
          className="flex-1 bg-transparent py-2.5 text-base text-white placeholder:text-surface-500 outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setHasSearched(false);
              setParams({});
            }}
            className="grid h-8 w-8 place-items-center rounded-lg text-surface-400 hover:bg-white/5 hover:text-white"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="mr-1 flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass p-5">
              <div className="flex items-center gap-3">
                <div className="skeleton h-11 w-11 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-1/3" />
                  <div className="skeleton h-3 w-1/4" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && hasSearched && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-surface-400">{results.length} results for "{query}"</p>
          <AnimatePresence mode="popLayout">
            {results.map((r, i) => (
              <motion.div
                key={`${r.document}-${r.chunk}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: i * 0.04 }}
                className="glass group p-5 transition-colors hover:bg-white/5"
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-500/10">
                    <FileText className="h-5 w-5 text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-white group-hover:text-primary-300">{r.document}</p>
                      <span className="flex items-center gap-1 rounded-md bg-surface-700/40 px-1.5 py-0.5 text-[10px] font-medium text-surface-400">
                        <Hash className="h-2.5 w-2.5" /> Page {r.page}
                      </span>
                      <span className="flex items-center gap-1 rounded-md bg-surface-700/40 px-1.5 py-0.5 text-[10px] font-medium text-surface-400">
                        <Layers className="h-2.5 w-2.5" /> Chunk {r.chunk}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-surface-300">
                      {highlightKeywords(r.matchedText, query)}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-700/50">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                            style={{ width: `${Math.min(r.similarity, 100)}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-primary-300">
                          {r.similarity.toFixed(2)}% similarity
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty state — no results */}
      {!loading && hasSearched && results.length === 0 && (
        <EmptyState
          icon={Search}
          title="No search results"
          description={`No documents matched "${query}". Make sure you've uploaded PDFs and try a different search query.`}
        />
      )}

      {/* Empty state — initial */}
      {!loading && !hasSearched && (
        <EmptyState
          icon={Search}
          title="No search results"
          description="Enter a query above to perform semantic vector search across your uploaded documents."
        />
      )}
    </div>
  );
}
function highlightKeywords(text: string | undefined, query: string) {
  if (!text) return "No preview available.";

  if (!query.trim()) return text;

  const words = query
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (words.length === 0) return text;

  const regex = new RegExp(
    `(${words.map(escapeRegex).join("|")})`,
    "gi"
  );

  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        className="rounded bg-primary-500/20 px-0.5 text-primary-300"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
