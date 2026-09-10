import { useState } from 'react';
import {
  CalendarClock,
  Play,
  Check,
  Clock,
  FileEdit,
  X,
  Hash,
  Send,
  Trash2,
  Plus,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PlatformIcon } from '@/components/ui/PlatformIcon';
import { mockScheduledPosts } from '@/data/mockData';
import type { PostStatus, ScheduledPost } from '@/types';

const statusConfig: Record<
  PostStatus,
  { variant: 'accent' | 'success' | 'warning' | 'error'; label: string; icon: typeof Clock }
> = {
  scheduled: { variant: 'accent', label: 'Scheduled', icon: Clock },
  posted: { variant: 'success', label: 'Posted', icon: Check },
  draft: { variant: 'warning', label: 'Draft', icon: FileEdit },
  failed: { variant: 'error', label: 'Failed', icon: X },
};

type FilterId = 'all' | PostStatus;

const filters: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All Posts' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'posted', label: 'Posted' },
  { id: 'draft', label: 'Drafts' },
];

export function ScheduledPostsPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>(mockScheduledPosts);
  const [filter, setFilter] = useState<FilterId>('all');

  const filteredPosts = filter === 'all' ? posts : posts.filter((p) => p.status === filter);

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.round(diff / (1000 * 60 * 60));

    if (date < now) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    if (hours < 24) {
      return `In ${hours}h`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="space-y-5">
      {/* Header stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="Total Posts" value={String(posts.length)} icon={<CalendarClock className="w-4 h-4" />} color="text-accent-400" />
        <StatBox label="Scheduled" value={String(posts.filter((p) => p.status === 'scheduled').length)} icon={<Clock className="w-4 h-4" />} color="text-brand-400" />
        <StatBox label="Posted" value={String(posts.filter((p) => p.status === 'posted').length)} icon={<Check className="w-4 h-4" />} color="text-success-400" />
        <StatBox label="Drafts" value={String(posts.filter((p) => p.status === 'draft').length)} icon={<FileEdit className="w-4 h-4" />} color="text-warning-400" />
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-smooth ${
                filter === f.id
                  ? 'bg-brand-500/15 border-brand-500/40 text-ink-50'
                  : 'bg-ink-800/40 border-ink-700/40 text-ink-300 hover:border-ink-600/50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
          New Post
        </Button>
      </div>

      {/* Posts list */}
      <div className="space-y-3">
        {filteredPosts.map((post) => {
          const config = statusConfig[post.status];
          const StatusIcon = config.icon;

          return (
            <Card key={post.id} className="overflow-hidden hover:border-ink-600/60 transition-smooth group">
              <div className="flex flex-col sm:flex-row gap-4 p-4">
                {/* Thumbnail */}
                <div className={`relative w-full sm:w-20 h-32 sm:h-20 rounded-xl bg-gradient-to-br ${post.thumbnailGradient} shrink-0 overflow-hidden flex items-center justify-center`}>
                  <Play className="w-6 h-6 text-white/80" fill="white" />
                  <div className="absolute top-1.5 left-1.5">
                    <div className="w-5 h-5 rounded-md bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <PlatformIcon platform={post.platform} className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-100 truncate">{post.productName}</p>
                      <p className="text-xs text-ink-400 mt-0.5 line-clamp-1">{post.caption}</p>
                    </div>
                    <Badge variant={config.variant} dot className="shrink-0">
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {post.hashtags.map((tag) => (
                      <span key={tag} className="flex items-center gap-0.5 text-[11px] text-accent-300 font-medium">
                        <Hash className="w-2.5 h-2.5" />
                        {tag.replace('#', '')}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="flex items-center gap-1.5 text-xs text-ink-400">
                      <CalendarClock className="w-3.5 h-3.5" />
                      {formatDate(post.scheduledFor)}
                    </span>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-smooth">
                      {post.status === 'draft' && (
                        <Button size="sm" variant="secondary" icon={<Send className="w-3 h-3" />}>
                          Publish
                        </Button>
                      )}
                      {post.status === 'scheduled' && (
                        <Button size="sm" variant="secondary" icon={<FileEdit className="w-3 h-3" />}>
                          Edit
                        </Button>
                      )}
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-400 hover:text-error-400 hover:bg-error-500/10 transition-smooth"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-ink-800/60 border border-ink-700/40 flex items-center justify-center mb-4">
            <CalendarClock className="w-7 h-7 text-ink-400" />
          </div>
          <p className="text-sm font-semibold text-ink-200">No posts found</p>
          <p className="text-xs text-ink-400 mt-1">
            {filter === 'all' ? 'Create your first scheduled post' : `No ${filter} posts yet`}
          </p>
        </div>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2.5">
        <div className={`w-9 h-9 rounded-lg bg-ink-800/60 border border-ink-700/40 flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-xl font-display font-bold text-ink-50 leading-tight">{value}</p>
          <p className="text-[11px] text-ink-400">{label}</p>
        </div>
      </div>
    </Card>
  );
}
