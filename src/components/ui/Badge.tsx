import type { ReactNode } from 'react';

type BadgeVariant = 'brand' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  brand: 'bg-brand-500/10 text-brand-300 border-brand-500/20',
  accent: 'bg-accent-500/10 text-accent-300 border-accent-500/20',
  success: 'bg-success-500/10 text-success-300 border-success-500/20',
  warning: 'bg-warning-500/10 text-warning-300 border-warning-500/20',
  error: 'bg-error-500/10 text-error-300 border-error-500/20',
  neutral: 'bg-ink-700/40 text-ink-200 border-ink-600/40',
};

const dotColors: Record<BadgeVariant, string> = {
  brand: 'bg-brand-400',
  accent: 'bg-accent-400',
  success: 'bg-success-400',
  warning: 'bg-warning-400',
  error: 'bg-error-400',
  neutral: 'bg-ink-300',
};

export function Badge({ children, variant = 'neutral', dot = false, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
