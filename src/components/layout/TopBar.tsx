import { Bell, Search, Menu } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle: string;
  onToggleSidebar: () => void;
}

export function TopBar({ title, subtitle, onToggleSidebar }: TopBarProps) {
  return (
    <header className="h-16 border-b border-ink-700/40 bg-ink-900/60 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-ink-300 hover:bg-ink-800 transition-smooth shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h2 className="font-display font-bold text-lg text-ink-50 leading-tight truncate">
            {title}
          </h2>
          <p className="text-xs text-ink-400 truncate hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-ink-800/60 border border-ink-700/40 text-ink-300 w-56 lg:w-64">
          <Search className="w-4 h-4 text-ink-400 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-ink-100 placeholder:text-ink-400 outline-none w-full"
          />
          <kbd className="text-[10px] text-ink-400 bg-ink-700/60 px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-ink-300 hover:bg-ink-800 transition-smooth">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-ink-900" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-3 pl-2 md:pl-3 md:border-l md:border-ink-700/40">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
            VF
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-ink-100 leading-tight">Alex Rivera</p>
            <p className="text-[11px] text-ink-400 leading-tight">Pro Plan</p>
          </div>
        </div>
      </div>
    </header>
  );
}
