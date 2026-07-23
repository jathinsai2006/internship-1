import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="glass grid place-items-center px-6 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-surface-800/60 ring-1 ring-white/5">
        <Icon className="h-8 w-8 text-surface-500" />
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-surface-400">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] active:scale-95"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
