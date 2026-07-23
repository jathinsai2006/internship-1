import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Sparkles, FileStack, Database } from 'lucide-react';
import Logo from './Logo';
import { navItems } from '../routes/navigation';
import { cn } from '../utils/cn';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-72 shrink-0',
          'flex flex-col gap-4 p-4',
          'glass-strong border-r border-white/5',
          'transition-transform duration-300 ease-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-1 pt-2">
          <Logo size="md" />
          <button
            onClick={onCloseMobile}
            className="grid h-8 w-8 place-items-center rounded-lg text-surface-400 hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar px-1 py-2">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-surface-500">
            Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onCloseMobile}
              className={({ isActive }) => cn('nav-item group', isActive && 'nav-item-active')}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary-400"
                    />
                  )}
                  <item.icon
                    className={cn(
                      'h-[18px] w-[18px] shrink-0 transition-colors',
                      isActive ? 'text-primary-400' : 'text-surface-400 group-hover:text-white',
                    )}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Stack info card */}
        <div className="space-y-3 px-1">
          <div className="glass p-4">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary-500/15">
                <Database className="h-4 w-4 text-primary-400" />
              </div>
              <p className="text-sm font-semibold text-white">RAG Pipeline</p>
            </div>
            <div className="mt-3 space-y-1.5">
              <StackRow icon={Sparkles} label="Gemini 3.5 Flash" />
              <StackRow icon={Database} label="ChromaDB" />
              <StackRow icon={FileStack} label="all-MiniLM-L6-v2" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function StackRow({ icon: Icon, label }: { icon: typeof Database; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-surface-400">
      <Icon className="h-3 w-3 text-surface-500" />
      {label}
    </div>
  );
}
