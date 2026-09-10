import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { VideoGeneratorPage } from '@/pages/VideoGeneratorPage';
import { ProductFinderPage } from '@/pages/ProductFinderPage';
import { ConnectedAccountsPage } from '@/pages/ConnectedAccountsPage';
import { ScheduledPostsPage } from '@/pages/ScheduledPostsPage';
import type { PageId } from '@/types';

const pageMeta: Record<PageId, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview & analytics of your affiliate performance' },
  'video-generator': { title: 'AI Video Generator', subtitle: 'Create viral TikTok videos from any product link' },
  'product-finder': { title: 'Viral Product Finder', subtitle: 'Discover trending products with high commission rates' },
  'connected-accounts': { title: 'Connected Accounts', subtitle: 'Manage your TikTok and affiliate platform connections' },
  'scheduled-posts': { title: 'Scheduled Posts', subtitle: 'Plan and manage your content calendar' },
};

function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setActivePage} />;
      case 'video-generator':
        return <VideoGeneratorPage onNavigate={setActivePage} />;
      case 'product-finder':
        return <ProductFinderPage onNavigate={setActivePage} />;
      case 'connected-accounts':
        return <ConnectedAccountsPage />;
      case 'scheduled-posts':
        return <ScheduledPostsPage />;
      default:
        return <DashboardPage onNavigate={setActivePage} />;
    }
  };

  const meta = pageMeta[activePage];

  return (
    <AppLayout
      activePage={activePage}
      onNavigate={setActivePage}
      title={meta.title}
      subtitle={meta.subtitle}
    >
      {renderPage()}
    </AppLayout>
  );
}

export default App;
