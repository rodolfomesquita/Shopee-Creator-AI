import { useState, useMemo } from 'react';
import {
  Search,
  TrendingUp,
  Star,
  DollarSign,
  Flame,
  Filter,
  ArrowUpRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PlatformIcon, platformLabel, platformColor } from '@/components/ui/PlatformIcon';
import { mockProducts } from '@/data/mockData';
import type { ProductSource, PageId } from '@/types';

interface ProductFinderPageProps {
  onNavigate: (page: PageId) => void;
}

const sources: { id: ProductSource | 'all'; label: string }[] = [
  { id: 'all', label: 'All Sources' },
  { id: 'shopee', label: 'Shopee' },
  { id: 'amazon', label: 'Amazon' },
  { id: 'aliexpress', label: 'AliExpress' },
];

const sortOptions = [
  { id: 'viral', label: 'Viral Score' },
  { id: 'trend', label: 'Trending' },
  { id: 'commission', label: 'Commission' },
  { id: 'price', label: 'Price: Low to High' },
] as const;

type SortId = (typeof sortOptions)[number]['id'];

export function ProductFinderPage({ onNavigate }: ProductFinderPageProps) {
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<ProductSource | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortId>('viral');

  const filteredProducts = useMemo(() => {
    let result = mockProducts.filter((p) => {
      const matchesSearch =
        !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
      const matchesSource = sourceFilter === 'all' || p.source === sourceFilter;
      return matchesSearch && matchesSource;
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'viral':
          return b.viralScore - a.viralScore;
        case 'trend':
          return b.trendScore - a.trendScore;
        case 'commission':
          return b.commission - a.commission;
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });

    return result;
  }, [search, sourceFilter, sortBy]);

  return (
    <div className="space-y-5">
      {/* Search & filters */}
      <Card>
        <div className="p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name or category..."
                className="w-full bg-ink-800/60 border border-ink-700/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink-100 placeholder:text-ink-400 outline-none focus:border-brand-500/50 transition-smooth"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-ink-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortId)}
                className="bg-ink-800/60 border border-ink-700/40 rounded-xl px-3 py-2.5 text-sm text-ink-100 outline-none focus:border-brand-500/50 transition-smooth cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-ink-800">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Source filters */}
          <div className="flex flex-wrap gap-2">
            {sources.map((src) => (
              <button
                key={src.id}
                onClick={() => setSourceFilter(src.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-smooth ${
                  sourceFilter === src.id
                    ? 'bg-brand-500/15 border-brand-500/40 text-ink-50'
                    : 'bg-ink-800/40 border-ink-700/40 text-ink-300 hover:border-ink-600/50'
                }`}
              >
                {src.id !== 'all' && <PlatformIcon platform={src.id} className="w-3.5 h-3.5" />}
                {src.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Trending summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryStat icon={<Flame className="w-4 h-4" />} label="Trending Now" value="247" color="text-brand-400" />
        <SummaryStat icon={<TrendingUp className="w-4 h-4" />} label="Avg Viral Score" value="84" color="text-accent-400" />
        <SummaryStat icon={<DollarSign className="w-4 h-4" />} label="Avg Commission" value="12.6%" color="text-success-400" />
        <SummaryStat icon={<ShoppingBag className="w-4 h-4" />} label="Total Products" value="1,840" color="text-warning-400" />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden group hover:border-ink-600/60 transition-smooth">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-2 left-2">
                <Badge variant="neutral" className="bg-black/50 backdrop-blur-sm border-white/10">
                  <PlatformIcon platform={product.source} className={`w-3 h-3 ${platformColor(product.source)}`} />
                  {platformLabel(product.source)}
                </Badge>
              </div>
              <div className="absolute top-2 right-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10">
                  <Flame className="w-3 h-3 text-brand-400" />
                  <span className="text-xs font-bold text-white">{product.viralScore}</span>
                </div>
              </div>
              {product.originalPrice && (
                <div className="absolute bottom-2 left-2">
                  <Badge variant="error" className="bg-error-500/80 backdrop-blur-sm">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </Badge>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs text-ink-400 mb-0.5">{product.category}</p>
                <p className="text-sm font-semibold text-ink-100 leading-snug line-clamp-2">
                  {product.name}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-display font-bold text-ink-50">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-ink-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-warning-400" fill="currentColor" />
                  <span className="text-xs font-semibold text-ink-200">{product.rating}</span>
                  <span className="text-xs text-ink-400">({(product.reviews / 1000).toFixed(1)}K)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-success-400 font-semibold">
                  <DollarSign className="w-3 h-3" />
                  {product.commission}% commission
                </span>
                <span className="text-ink-400">{(product.unitsSold / 1000).toFixed(1)}K sold</span>
              </div>

              {/* Trend score bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-ink-400 font-medium">Trend Score</span>
                  <span className="text-[10px] text-ink-200 font-bold">{product.trendScore}/100</span>
                </div>
                <div className="h-1.5 bg-ink-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-smooth"
                    style={{ width: `${product.trendScore}%` }}
                  />
                </div>
              </div>

              <Button
                size="sm"
                className="w-full"
                icon={<Sparkles className="w-3.5 h-3.5" />}
                onClick={() => onNavigate('video-generator')}
              >
                Create Video
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-ink-800/60 border border-ink-700/40 flex items-center justify-center mb-4">
            <Search className="w-7 h-7 text-ink-400" />
          </div>
          <p className="text-sm font-semibold text-ink-200">No products found</p>
          <p className="text-xs text-ink-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

function SummaryStat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2.5">
        <div className={`w-9 h-9 rounded-lg bg-ink-800/60 border border-ink-700/40 flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-lg font-display font-bold text-ink-50 leading-tight">{value}</p>
          <p className="text-[11px] text-ink-400">{label}</p>
        </div>
      </div>
    </Card>
  );
}
