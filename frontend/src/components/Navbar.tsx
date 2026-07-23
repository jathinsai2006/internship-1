import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  User,
  Settings,
  FileText,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenSidebar: () => void;
}

export default function Navbar({ onOpenSidebar }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
      setSearchValue('');
      setSearchOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-20 px-4 pt-4">
      <div className="glass flex h-16 items-center gap-3 px-3 sm:px-4">
        {/* Mobile menu button */}
        <button
          onClick={onOpenSidebar}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-surface-300 hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search — desktop */}
        <form onSubmit={handleSearch} className="group relative hidden flex-1 sm:block max-w-xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400 transition-colors group-focus-within:text-primary-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search documents…"
            className="h-10 w-full rounded-xl border border-white/5 bg-surface-900/40 pl-10 pr-16 text-sm text-white placeholder:text-surface-500 outline-none transition-all focus:border-primary-500/40 focus:bg-surface-900/60 focus:ring-2 focus:ring-primary-500/20"
          />
          <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/10 bg-surface-700/40 px-1.5 py-0.5 text-[10px] font-medium text-surface-400 sm:block">
            ⌘K
          </kbd>
        </form>

        {/* Search — mobile icon */}
        <button
          onClick={() => setSearchOpen((p) => !p)}
          className="grid h-10 w-10 place-items-center rounded-xl text-surface-300 hover:bg-white/5 hover:text-white sm:hidden"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        <div className="flex flex-1 items-center justify-end gap-1.5 sm:flex-none">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-xl text-surface-300 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.span
                  key="moon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="sun"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((p) => !p)}
              className="relative grid h-10 w-10 place-items-center rounded-xl text-surface-300 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="glass-strong absolute right-0 mt-2 w-72 overflow-hidden p-4"
                >
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-surface-400" />
                    <p className="text-sm font-semibold text-white">Notifications</p>
                  </div>
                  <div className="mt-3 flex flex-col items-center gap-2 py-6 text-center">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-surface-800/60">
                      <Bell className="h-6 w-6 text-surface-500" />
                    </div>
                    <p className="text-sm text-surface-400">No notifications yet</p>
                    <p className="text-xs text-surface-500">
                      Activity from uploads, chats, and summaries will appear here.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile dropdown — Guest user */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2 transition-colors hover:bg-white/5"
            >
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-surface-700/60 ring-1 ring-white/10">
                <User className="h-4 w-4 text-surface-400" />
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold leading-tight text-white">Guest User</p>
                <p className="text-[10px] text-surface-400">Not signed in</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-surface-400 sm:block" />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="glass-strong absolute right-0 mt-2 w-60 overflow-hidden p-1.5"
                >
                  <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-surface-700/60 ring-1 ring-white/10">
                      <User className="h-5 w-5 text-surface-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Guest User</p>
                      <p className="text-xs text-surface-400">Local session</p>
                    </div>
                  </div>
                  <div className="my-1 h-px bg-white/5" />
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/settings');
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-surface-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/upload');
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-surface-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <FileText className="h-4 w-4" />
                    Upload Documents
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass mt-2 flex items-center gap-3 px-4 py-3 sm:hidden"
          >
            <Search className="h-4 w-4 text-surface-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              autoFocus
              placeholder="Search documents…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-surface-500 outline-none"
            />
          </motion.form>
        )}
      </AnimatePresence>
    </header>
  );
}
