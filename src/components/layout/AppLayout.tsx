import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import type { PageId } from '@/types';

interface AppLayoutProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AppLayout({ activePage, onNavigate, title, subtitle, children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-ink-950">
      <div className="hidden lg:flex">
        <Sidebar
          activePage={activePage}
          onNavigate={onNavigate}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title={title}
          subtitle={subtitle}
          onToggleSidebar={() => setCollapsed((c) => !c)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
