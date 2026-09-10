import {
  LayoutDashboard,
  Sparkles,
  Search,
  Link2,
  CalendarClock,
  Zap,
  Settings,
  ChevronLeft,
} from 'lucide-react';
import type { PageId } from '@/types';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'video-generator', label: 'AI Video Generator', icon: Sparkles },
  { id: 'product-finder', label: 'Viral Product Finder', icon: Search },
  { id: 'connected-accounts', label: 'Connected Accounts', icon: Link2 },
  { id: 'scheduled-posts', label: 'Scheduled Posts', icon: CalendarClock },
];

export function Sidebar({ activePage, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside
      className={`${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      } shrink-0 border-r border-ink-700/60 bg-ink-900/80 backdrop-blur-xl transition-all duration-300 flex flex-col h-full`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-ink-700/40 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shrink-0 glow-brand">
          <Zap className="w-5 h-5 text-white" fill="white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-display font-bold text-base text-ink-50 leading-tight whitespace-nowrap">
              ViralForge
            </h1>
            <p className="text-[10px] text-ink-300 font-medium tracking-wide uppercase whitespace-nowrap">
              AI Studio
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-1">
        {!collapsed && (
          <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-wider px-3 mb-2">
            Menu
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth group relative ${
                isActive
                  ? 'bg-gradient-to-r from-brand-500/15 to-accent-500/10 text-ink-50'
                  : 'text-ink-300 hover:text-ink-100 hover:bg-ink-800/60'
              }`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-gradient-to-b from-brand-500 to-accent-500" />
              )}
              <Icon
                className={`w-[18px] h-[18px] shrink-0 transition-smooth ${
                  isActive ? 'text-brand-400' : 'text-ink-400 group-hover:text-ink-200'
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-ink-700/40 space-y-1">
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-300 hover:text-ink-100 hover:bg-ink-800/60 transition-smooth"
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="w-[18px] h-[18px] shrink-0 text-ink-400" />
          {!collapsed && <span>Settings</span>}
        </button>
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-300 hover:text-ink-100 hover:bg-ink-800/60 transition-smooth"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <ChevronLeft
            className={`w-[18px] h-[18px] shrink-0 text-ink-400 transition-transform duration-300 ${
              collapsed ? 'rotate-180' : ''
            }`}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
