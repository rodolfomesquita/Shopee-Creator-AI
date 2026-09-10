export type PageId =
  | 'dashboard'
  | 'video-generator'
  | 'product-finder'
  | 'connected-accounts'
  | 'scheduled-posts';

export type VideoStyle = 'viral-review' | 'problem-solution' | 'top3-reasons' | 'unboxing' | 'comparison';

export type VoiceAccent = 'us-female' | 'us-male' | 'uk-female' | 'uk-male' | 'au-female' | 'ph-female';

export type VoiceTone = 'energetic' | 'casual' | 'professional' | 'dramatic' | 'friendly';

export type VideoStatus = 'idle' | 'generating' | 'completed' | 'error';

export type GenerationStep = 'script' | 'voice' | 'scenes' | 'done';

export type Platform = 'tiktok' | 'shopee' | 'amazon' | 'aliexpress';

export type PostStatus = 'scheduled' | 'posted' | 'draft' | 'failed';

export type AccountStatus = 'connected' | 'disconnected' | 'error';

export type ProductSource = 'shopee' | 'amazon' | 'aliexpress' | 'tiktok-shop';

export interface VideoStyleOption {
  id: VideoStyle;
  label: string;
  description: string;
  icon: string;
}

export interface VoiceAccentOption {
  id: VoiceAccent;
  label: string;
  flag: string;
}

export interface VoiceToneOption {
  id: VoiceTone;
  label: string;
}

export interface GenerationProgress {
  step: GenerationStep;
  label: string;
  progress: number;
}

export interface GeneratedVideo {
  id: string;
  productLink: string;
  productName: string;
  style: VideoStyle;
  accent: VoiceAccent;
  tone: VoiceTone;
  script: string;
  captions: string[];
  affiliateLink: string;
  hashtags: string[];
  thumbnailGradient: string;
  duration: number;
  createdAt: string;
  videoUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  source: ProductSource;
  commission: number;
  rating: number;
  reviews: number;
  trendScore: number;
  unitsSold: number;
  category: string;
  viralScore: number;
}

export interface ScheduledPost {
  id: string;
  videoId: string;
  productName: string;
  thumbnailGradient: string;
  caption: string;
  hashtags: string[];
  platform: Platform;
  scheduledFor: string;
  status: PostStatus;
}

export interface ConnectedAccount {
  id: string;
  platform: Platform;
  username: string;
  followers: number;
  status: AccountStatus;
  connectedAt: string;
  avatar: string;
}

export interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface AnalyticsData {
  totalViews: number;
  totalEngagement: number;
  totalSales: number;
  totalVideos: number;
  viewsChange: number;
  engagementChange: number;
  salesChange: number;
  videosChange: number;
  viewsByDay: { day: string; views: number }[];
  topVideos: { id: string; name: string; views: number; engagement: number; sales: number }[];
  platformBreakdown: { platform: Platform; percentage: number; color: string }[];
}
