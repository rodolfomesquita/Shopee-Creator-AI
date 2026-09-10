import type { Platform, ProductSource } from '@/types';

type PlatformLike = Platform | ProductSource;

interface PlatformIconProps {
  platform: PlatformLike;
  className?: string;
}

export function PlatformIcon({ platform, className = 'w-4 h-4' }: PlatformIconProps) {
  switch (platform) {
    case 'tiktok':
    case 'tiktok-shop':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.61c.3 0 .6.04.88.13V9.4a6.33 6.33 0 0 0-1-.05A6.34 6.34 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52V6.69h-1.04z" />
        </svg>
      );
    case 'shopee':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 2C9.243 2 7 4.243 7 7v2H6a1 1 0 0 0-.998.883L4.08 18.883A1 1 0 0 0 5.07 20h13.86a1 1 0 0 0 .99-1.117L18.998 9.883A1 1 0 0 0 18 9h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v2H9V7c0-1.654 1.346-3 3-3zm-1.5 8.5a1.5 1.5 0 0 1 1.5 1.5v.5h-1v-.5a.5.5 0 0 0-1 0v3a.5.5 0 0 0 1 0V16h1v1a1.5 1.5 0 0 1-3 0v-3a1.5 1.5 0 0 1 1.5-1.5zm4 0a1.5 1.5 0 0 1 1.5 1.5v.5h-1v-.5a.5.5 0 0 0-1 0v3a.5.5 0 0 0 1 0V16h1v1a1.5 1.5 0 0 1-3 0v-3a1.5 1.5 0 0 1 1.5-1.5z" />
        </svg>
      );
    case 'amazon':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M3.5 20.5c5.5 3 13 2 16.5-1.5.3-.3.1-.6-.2-.4-4-2.5-9.5-2.5-16.3 2.4-.2.1-.2.4 0 .5zm14.5-3c1.5-1.5 2-3.5 1.5-5-.5-1.5-2-2-3.5-1.5-.5.2-1 .5-1.5 1-1 1-1.5 2.5-1 4 .5 1 1.5 1.5 2.5 1.5.7 0 1.3-.2 2-.5zM12 2c2.8 0 5 1.5 5 4 0 2-1 3-2.5 3.5-1 .3-1.5.5-1.5 1 0 .5.5.7 1.5.7 2 0 3.5 1.5 3.5 3.5 0 2.8-3 4.8-6 4.8-2.5 0-5-1-5-3 0-1.5 1-2.5 2.5-3 1-.3 2-.5 2-1 0-.5-.5-.7-1.5-.7-2 0-3.5-1.5-3.5-3.5C6.5 3.5 9 2 12 2z" />
        </svg>
      );
    case 'aliexpress':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zm-10.5 4h-2v-7h2v7zm5-7h-4v2h4v5h-2v-3h-2v5h4v-7z" />
        </svg>
      );
    default:
      return null;
  }
}

export function platformLabel(platform: PlatformLike): string {
  const labels: Record<string, string> = {
    tiktok: 'TikTok',
    shopee: 'Shopee',
    amazon: 'Amazon',
    aliexpress: 'AliExpress',
    'tiktok-shop': 'TikTok Shop',
  };
  return labels[platform] ?? platform;
}

export function platformColor(platform: PlatformLike): string {
  const colors: Record<string, string> = {
    tiktok: 'text-brand-400',
    shopee: 'text-warning-400',
    amazon: 'text-accent-400',
    aliexpress: 'text-error-400',
    'tiktok-shop': 'text-brand-400',
  };
  return colors[platform] ?? 'text-ink-300';
}
