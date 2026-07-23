import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export default function PageHeader({ icon: Icon, title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 ring-1 ring-white/10">
          <Icon className="h-6 w-6 text-primary-400" />
        </div>
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display text-2xl font-bold text-white sm:text-3xl"
          >
            {title}
          </motion.h1>
          <p className="mt-0.5 text-sm text-surface-400">{subtitle}</p>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
