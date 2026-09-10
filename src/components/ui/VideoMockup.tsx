import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Heart, MessageCircle, Share, Bookmark, Music2 } from 'lucide-react';
import type { GeneratedVideo } from '@/types';

interface VideoMockupProps {
  video: GeneratedVideo | null;
  isGenerating?: boolean;
  generationStep?: string;
}

export function VideoMockup({ video, isGenerating = false, generationStep }: VideoMockupProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [captionIndex, setCaptionIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing && video && !isGenerating) {
      timerRef.current = setInterval(() => {
        setProgress((p) => {
          const next = p + 100 / (video.duration * 10);
          if (next >= 100) {
            setPlaying(false);
            return 0;
          }
          return next;
        });
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, video, isGenerating]);

  useEffect(() => {
    if (video && video.captions.length > 0) {
      const idx = Math.min(
        Math.floor((progress / 100) * video.captions.length),
        video.captions.length - 1,
      );
      setCaptionIndex(idx);
    }
  }, [progress, video]);

  useEffect(() => {
    if (!isGenerating) {
      setProgress(0);
      setPlaying(false);
    }
  }, [isGenerating]);

  if (isGenerating) {
    return (
      <div className="relative w-[260px] h-[520px] rounded-[2.5rem] bg-ink-900 border-[3px] border-ink-700/60 overflow-hidden shadow-2xl mx-auto">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-ink-950 rounded-b-2xl z-20" />
        {/* Shimmer background */}
        <div className="absolute inset-0 shimmer-bg" />
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-ink-700/40" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Music2 className="w-7 h-7 text-brand-400 animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm font-display font-bold text-ink-100">{generationStep}</p>
            <p className="text-xs text-ink-400">AI is working its magic...</p>
          </div>
          {/* Waveform */}
          <div className="flex items-center gap-1 h-8">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-brand-500 to-accent-500 rounded-full wave-bar"
                style={{
                  height: '100%',
                  animationDelay: `${i * 0.08}s`,
                  transformOrigin: 'center',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="relative w-[260px] h-[520px] rounded-[2.5rem] bg-ink-900 border-[3px] border-ink-700/60 overflow-hidden shadow-2xl mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-ink-950 rounded-b-2xl z-20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-ink-800/60 border border-ink-700/40 flex items-center justify-center">
            <Play className="w-7 h-7 text-ink-400" />
          </div>
          <p className="text-sm text-ink-300 font-medium">No video yet</p>
          <p className="text-xs text-ink-400 leading-relaxed">
            Paste a product link and generate your first AI video to see a preview here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-[260px] h-[520px] rounded-[2.5rem] bg-ink-950 border-[3px] border-ink-700/60 overflow-hidden shadow-2xl mx-auto group">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-ink-950 rounded-b-2xl z-30" />

      {/* Real generated video */}
      {video.videoUrl ? (
        <video
          src={video.videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          controls
          playsInline
          preload="metadata"
        />
      ) : null}

      {/* Video background fallback */}
      <div className={`absolute inset-0 bg-gradient-to-br ${video.thumbnailGradient} transition-all duration-500 ${video.videoUrl ? 'hidden' : ''}`}>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        {/* Subtle moving pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Top bar */}
      <div className="absolute top-8 left-0 right-0 flex items-center justify-between px-4 z-20">
        <p className="text-white/90 text-[11px] font-semibold">For You</p>
        <div className="flex items-center gap-1 text-white/80 text-[11px]">
          <span className="font-semibold">Following</span>
        </div>
      </div>

      {/* Center play button */}
      {!playing && (
        <button
          onClick={() => setPlaying(true)}
          className="absolute inset-0 flex items-center justify-center z-20"
        >
          <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20 animate-pulse-glow">
            <Play className="w-7 h-7 text-white ml-1" fill="white" />
          </div>
        </button>
      )}

      {/* Captions overlay */}
      {playing && video.captions[captionIndex] && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[85%] text-center">
          <p
            key={captionIndex}
            className="caption-pop inline-block text-white font-display font-bold text-base leading-snug px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
          >
            {video.captions[captionIndex]}
          </p>
        </div>
      )}

      {/* Right action bar */}
      <div className="absolute right-2 bottom-24 flex flex-col items-center gap-4 z-20">
        <div className="flex flex-col items-center gap-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 border-2 border-white/80 flex items-center justify-center">
            <span className="text-white text-xs font-bold">VF</span>
          </div>
          <div className="w-3.5 h-3.5 rounded-full bg-brand-500 border-2 border-ink-950 -mt-3 flex items-center justify-center">
            <span className="text-white text-[8px] font-bold leading-none">+</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <Heart className="w-7 h-7 text-white drop-shadow-lg" fill="white" />
          <span className="text-white text-[10px] font-semibold drop-shadow-lg">12.4K</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <MessageCircle className="w-7 h-7 text-white drop-shadow-lg" fill="white" />
          <span className="text-white text-[10px] font-semibold drop-shadow-lg">842</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <Bookmark className="w-7 h-7 text-white drop-shadow-lg" fill="white" />
          <span className="text-white text-[10px] font-semibold drop-shadow-lg">5.2K</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <Share className="w-7 h-7 text-white drop-shadow-lg" fill="white" />
          <span className="text-white text-[10px] font-semibold drop-shadow-lg">1.1K</span>
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 pb-6 z-20">
        <p className="text-white text-xs font-semibold mb-1.5 drop-shadow-lg">@viralforge.studio</p>
        <p className="text-white/90 text-[11px] leading-snug mb-2 drop-shadow-lg line-clamp-2">
          {video.productName} — Get yours now! Link in bio.
        </p>
        <div className="flex flex-wrap gap-1 mb-2">
          {video.hashtags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-white/80 text-[10px] font-medium drop-shadow-lg">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-white/70 text-[10px]">
          <Music2 className="w-3 h-3" />
          <span className="truncate">Original sound — ViralForge AI</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-1 left-3 right-3 h-0.5 bg-white/20 rounded-full z-20">
        <div
          className="h-full bg-white rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Pause indicator */}
      {playing && (
        <button
          onClick={() => setPlaying(false)}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <div className="opacity-0 group-hover:opacity-100 transition-smooth w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <Pause className="w-6 h-6 text-white" fill="white" />
          </div>
        </button>
      )}
    </div>
  );
}
