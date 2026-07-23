import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = {
    sm: { box: 'h-9 w-9', icon: 'h-5 w-5', title: 'text-sm', sub: 'text-[10px]' },
    md: { box: 'h-11 w-11', icon: 'h-6 w-6', title: 'text-base', sub: 'text-[11px]' },
    lg: { box: 'h-14 w-14', icon: 'h-8 w-8', title: 'text-xl', sub: 'text-xs' },
  }[size];

  return (
    <div className="flex items-center gap-3">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`relative grid ${dims.box} place-items-center rounded-2xl bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 shadow-glow`}
      >
        <BrainCircuit className={`${dims.icon} text-white`} />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent-400 ring-2 ring-surface-950 animate-pulse-glow" />
      </motion.div>
      <div>
        <h1 className={`font-display ${dims.title} font-bold leading-tight text-white`}>
          IntelliDocs <span className="text-gradient">AI</span>
        </h1>
        <p className={`${dims.sub} font-medium text-surface-400`}>
          AI Powered Document Intelligence
        </p>
      </div>
    </div>
  );
}
