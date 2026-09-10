import { ArrowUpRight, ArrowDownRight, Minus, Eye, Heart, DollarSign, Video } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { StatCard as StatCardType } from '@/types';

interface StatCardProps {
  stat: StatCardType;
}

const iconMap: Record<string, LucideIcon> = {
  Eye,
  Heart,
  DollarSign,
  Video,
};

export function StatCard({ stat }: StatCardProps) {
  const Icon = iconMap[stat.icon] ?? Eye;
  const TrendIcon =
    stat.trend === 'up' ? ArrowUpRight : stat.trend === 'down' ? ArrowDownRight : Minus;
  const trendColor =
    stat.trend === 'up'
      ? 'text-success-400 bg-success-500/10'
      : stat.trend === 'down'
        ? 'text-error-400 bg-error-500/10'
        : 'text-ink-400 bg-ink-700/40';

  return (
    <div className="glass-card rounded-2xl p-5 hover:border-ink-600/60 transition-smooth group relative overflow-hidden">
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br from-brand-500/5 to-accent-500/5 blur-2xl group-hover:from-brand-500/10 group-hover:to-accent-500/10 transition-smooth" />
      <div className="relative flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-ink-700/80 to-ink-800/80 border border-ink-600/40 flex items-center justify-center">
          <Icon className="w-5 h-5 text-brand-400" />
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${trendColor}`}
        >
          <TrendIcon className="w-3 h-3" />
          {stat.change}
        </span>
      </div>
      <div className="relative">
        <p className="text-2xl font-display font-bold text-ink-50 tracking-tight">{stat.value}</p>
        <p className="text-sm text-ink-300 mt-1">{stat.label}</p>
      </div>
    </div>
  );
}
