import { TrendingUp, Eye, Heart, DollarSign, Video, ArrowUpRight, Sparkles, CalendarClock, Play } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PlatformIcon, platformLabel } from '@/components/ui/PlatformIcon';
import { mockStatCards, mockAnalytics } from '@/data/mockData';
import type { PageId } from '@/types';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const maxViews = Math.max(...mockAnalytics.viewsByDay.map((d) => d.views));
  const totalPlatform = mockAnalytics.platformBreakdown.reduce((sum, p) => sum + p.percentage, 0);

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600/20 via-ink-850 to-accent-600/20 border border-ink-700/40 p-6 md:p-8">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <Badge variant="brand" dot>
              Pro Plan
            </Badge>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-ink-50 mt-3">
              Welcome back, Alex!
            </h2>
            <p className="text-ink-300 text-sm mt-1 max-w-md">
              Your videos generated <span className="text-success-400 font-semibold">$42,100</span> in
              affiliate sales this month. Keep the momentum going.
            </p>
          </div>
          <Button
            size="lg"
            icon={<Sparkles className="w-4 h-4" />}
            onClick={() => onNavigate('video-generator')}
          >
            Create New Video
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStatCards.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Views chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Views This Week"
              subtitle="Daily video views across all platforms"
              icon={<TrendingUp className="w-4 h-4 text-brand-400" />}
              action={
                <Badge variant="success" dot>
                  +23.5%
                </Badge>
              }
            />
            <div className="p-5">
              <div className="flex items-end justify-between gap-2 h-48">
                {mockAnalytics.viewsByDay.map((day, i) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex-1 flex items-end">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-brand-500/80 to-accent-500/80 group-hover:from-brand-400 group-hover:to-accent-400 transition-smooth relative"
                        style={{ height: `${(day.views / maxViews) * 100}%` }}
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-smooth whitespace-nowrap text-[10px] font-semibold text-ink-100 bg-ink-800 px-2 py-1 rounded-md border border-ink-700/40">
                          {(day.views / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-ink-400 font-medium">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Platform breakdown */}
        <Card>
          <CardHeader
            title="Platform Split"
            subtitle="Revenue by source"
            icon={<DollarSign className="w-4 h-4 text-accent-400" />}
          />
          <div className="p-5 space-y-4">
            {/* Donut chart mock */}
            <div className="relative w-32 h-32 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {mockAnalytics.platformBreakdown.map((p, i) => {
                  const offset = mockAnalytics.platformBreakdown
                    .slice(0, i)
                    .reduce((sum, x) => sum + x.percentage, 0);
                  const circumference = 2 * Math.PI * 40;
                  const dash = (p.percentage / totalPlatform) * circumference;
                  return (
                    <circle
                      key={p.platform}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={p.color}
                      strokeWidth="10"
                      strokeDasharray={`${dash} ${circumference - dash}`}
                      strokeDashoffset={-offset * (circumference / totalPlatform)}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xl font-display font-bold text-ink-50">$42K</p>
                  <p className="text-[10px] text-ink-400">Total</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {mockAnalytics.platformBreakdown.map((p) => (
                <div key={p.platform} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-sm text-ink-200">{platformLabel(p.platform)}</span>
                  </div>
                  <span className="text-sm font-semibold text-ink-100">{p.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Top videos + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top performing videos */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Top Performing Videos"
              subtitle="Your best content this month"
              icon={<Video className="w-4 h-4 text-brand-400" />}
              action={
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              }
            />
            <div className="divide-y divide-ink-700/40">
              {mockAnalytics.topVideos.map((v, i) => (
                <div
                  key={v.id}
                  className="flex items-center gap-4 p-4 hover:bg-ink-800/40 transition-smooth"
                >
                  <span className="text-ink-400 font-display font-bold text-lg w-6 text-center">
                    {i + 1}
                  </span>
                  <div className="w-10 h-14 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 text-white" fill="white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-100 truncate">{v.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-ink-400">
                        <Eye className="w-3 h-3" />
                        {(v.views / 1000).toFixed(0)}K
                      </span>
                      <span className="flex items-center gap-1 text-xs text-ink-400">
                        <Heart className="w-3 h-3" />
                        {(v.engagement / 1000).toFixed(1)}K
                      </span>
                      <span className="flex items-center gap-1 text-xs text-success-400">
                        <DollarSign className="w-3 h-3" />
                        {(v.sales / 1000).toFixed(1)}K
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-success-400 shrink-0" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick actions */}
        <Card>
          <CardHeader title="Quick Actions" subtitle="Jump to a task" icon={<Sparkles className="w-4 h-4 text-accent-400" />} />
          <div className="p-4 space-y-2">
            <QuickAction
              icon={<Sparkles className="w-4 h-4" />}
              label="Generate AI Video"
              desc="Create from product link"
              onClick={() => onNavigate('video-generator')}
              gradient="from-brand-500/20 to-brand-600/5"
              iconColor="text-brand-400"
            />
            <QuickAction
              icon={<TrendingUp className="w-4 h-4" />}
              label="Find Viral Products"
              desc="Discover trending items"
              onClick={() => onNavigate('product-finder')}
              gradient="from-accent-500/20 to-accent-600/5"
              iconColor="text-accent-400"
            />
            <QuickAction
              icon={<CalendarClock className="w-4 h-4" />}
              label="Schedule Posts"
              desc="Plan your content"
              onClick={() => onNavigate('scheduled-posts')}
              gradient="from-success-500/20 to-success-600/5"
              iconColor="text-success-400"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  desc,
  onClick,
  gradient,
  iconColor,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  onClick: () => void;
  gradient: string;
  iconColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${gradient} border border-ink-700/30 hover:border-ink-600/50 transition-smooth text-left`}
    >
      <div className={`w-9 h-9 rounded-lg bg-ink-800/60 border border-ink-700/40 flex items-center justify-center ${iconColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-ink-100">{label}</p>
        <p className="text-xs text-ink-400">{desc}</p>
      </div>
    </button>
  );
}
