import { useState } from 'react';
import {
  Check,
  X,
  Link2,
  Unlink,
  RefreshCw,
  Users,
  Calendar,
  AlertCircle,
  Shield,
  Zap,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PlatformIcon, platformLabel, platformColor } from '@/components/ui/PlatformIcon';
import { mockConnectedAccounts } from '@/data/mockData';
import type { AccountStatus, ConnectedAccount, Platform } from '@/types';

const accountStatusConfig: Record<
  AccountStatus,
  { variant: 'success' | 'error' | 'warning'; label: string }
> = {
  connected: { variant: 'success', label: 'Connected' },
  disconnected: { variant: 'warning', label: 'Not Connected' },
  error: { variant: 'error', label: 'Error' },
};

const availablePlatforms: { platform: Platform; description: string }[] = [
  { platform: 'tiktok', description: 'Publish videos, track analytics, and manage your TikTok presence' },
  { platform: 'shopee', description: 'Access Shopee Affiliate Program and earn commission on sales' },
  { platform: 'amazon', description: 'Connect Amazon Associates for affiliate link generation' },
  { platform: 'aliexpress', description: 'Access AliExpress Affiliate Program and product catalog' },
];

export function ConnectedAccountsPage() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>(mockConnectedAccounts);
  const [connecting, setConnecting] = useState<Platform | null>(null);

  const handleConnect = (platform: Platform) => {
    setConnecting(platform);
    setTimeout(() => {
      setAccounts((prev) => {
        const existing = prev.find((a) => a.platform === platform);
        if (existing) {
          return prev.map((a) =>
            a.platform === platform
              ? {
                  ...a,
                  status: 'connected' as AccountStatus,
                  connectedAt: new Date().toISOString(),
                  username: a.username || `viralforge.${platform}`,
                  followers: a.followers || Math.floor(Math.random() * 50000) + 5000,
                }
              : a,
          );
        }
        return [
          ...prev,
          {
            id: `a-${Date.now()}`,
            platform,
            username: `viralforge.${platform}`,
            followers: Math.floor(Math.random() * 50000) + 5000,
            status: 'connected' as AccountStatus,
            connectedAt: new Date().toISOString(),
            avatar: '',
          },
        ];
      });
      setConnecting(null);
    }, 2000);
  };

  const handleDisconnect = (platform: Platform) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.platform === platform
          ? { ...a, status: 'disconnected' as AccountStatus, connectedAt: '', followers: 0 }
          : a,
      ),
    );
  };

  const getAccount = (platform: Platform) => accounts.find((a) => a.platform === platform);

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-accent-500/10 border border-accent-500/20">
        <Shield className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-ink-100">Secure OAuth Integration</p>
          <p className="text-xs text-ink-300 mt-0.5 leading-relaxed">
            Connect your accounts with industry-standard OAuth 2.0. We never store your passwords —
            connections use secure tokens that you can revoke at any time.
          </p>
        </div>
      </div>

      {/* Connected accounts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availablePlatforms.map(({ platform, description }) => {
          const account = getAccount(platform);
          const status = account?.status ?? 'disconnected';
          const statusConfig = accountStatusConfig[status];
          const isConnecting = connecting === platform;

          return (
            <Card key={platform} className="overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-ink-800/60 border border-ink-700/40 flex items-center justify-center">
                      <PlatformIcon platform={platform} className={`w-6 h-6 ${platformColor(platform)}`} />
                    </div>
                    <div>
                      <p className="text-sm font-display font-bold text-ink-50">
                        {platformLabel(platform)}
                      </p>
                      <Badge variant={statusConfig.variant} dot className="mt-1">
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </div>
                  {status === 'connected' && (
                    <div className="w-8 h-8 rounded-full bg-success-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-success-400" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-ink-300 leading-relaxed mb-4">{description}</p>

                {status === 'connected' && account ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-800/40 border border-ink-700/30">
                      {account.avatar ? (
                        <img
                          src={account.avatar}
                          alt={account.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                          {account.username.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink-100 truncate">
                          {account.username}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          {account.followers > 0 && (
                            <span className="flex items-center gap-1 text-xs text-ink-400">
                              <Users className="w-3 h-3" />
                              {account.followers > 1000
                                ? `${(account.followers / 1000).toFixed(1)}K`
                                : account.followers}{' '}
                              followers
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-ink-400">
                            <Calendar className="w-3 h-3" />
                            {new Date(account.connectedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        icon={<RefreshCw className="w-3.5 h-3.5" />}
                      >
                        Refresh
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="flex-1"
                        icon={<Unlink className="w-3.5 h-3.5" />}
                        onClick={() => handleDisconnect(platform)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    size="md"
                    loading={isConnecting}
                    icon={!isConnecting ? <Link2 className="w-4 h-4" /> : undefined}
                    onClick={() => handleConnect(platform)}
                  >
                    {isConnecting ? 'Connecting...' : `Connect ${platformLabel(platform)}`}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Permissions info */}
      <Card>
        <CardHeader
          title="Required Permissions"
          subtitle="What each connection allows ViralForge to do"
          icon={<Shield className="w-4 h-4 text-accent-400" />}
        />
        <div className="divide-y divide-ink-700/40">
          <PermissionRow
            icon={<Zap className="w-4 h-4 text-brand-400" />}
            title="Publish Content"
            desc="Post videos and schedule posts to your connected accounts"
          />
          <PermissionRow
            icon={<Users className="w-4 h-4 text-accent-400" />}
            title="Read Analytics"
            desc="Access view counts, engagement metrics, and performance data"
          />
          <PermissionRow
            icon={<Link2 className="w-4 h-4 text-success-400" />}
            title="Generate Affiliate Links"
            desc="Create tracked affiliate links for products you promote"
          />
        </div>
      </Card>
    </div>
  );
}

function PermissionRow({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4">
      <div className="w-9 h-9 rounded-lg bg-ink-800/60 border border-ink-700/40 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-ink-100">{title}</p>
        <p className="text-xs text-ink-400 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
