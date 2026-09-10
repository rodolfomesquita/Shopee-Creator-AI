import { useState, useRef } from 'react';
import {
  Link as LinkIcon,
  Flame,
  Lightbulb,
  ListOrdered,
  Package,
  GitCompare,
  Sparkles,
  Mic,
  Volume2,
  Check,
  Copy,
  Send,
  CalendarClock,
  Hash,
  Play,
  AlertCircle,
  AlertTriangle,
  X,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VideoMockup } from '@/components/ui/VideoMockup';
import {
  videoStyleOptions,
  voiceAccentOptions,
  voiceToneOptions,
  thumbnailGradients,
} from '@/data/mockData';
import { generateVideoScript, generateProductVideo, getGeminiStatus, type GeneratedScript } from '@/services/gemini';
import type { VideoStyle, VoiceAccent, VoiceTone, GeneratedVideo, GenerationStep, PageId } from '@/types';

interface VideoGeneratorPageProps {
  onNavigate: (page: PageId) => void;
}

const styleIcons: Record<string, typeof Flame> = {
  Flame,
  Lightbulb,
  ListOrdered,
  Package,
  GitCompare,
};

const generationSteps: { step: GenerationStep; label: string; description: string }[] = [
  { step: 'script', label: 'Generating Script', description: 'AI is crafting a viral script...' },
  { step: 'voice', label: 'Generating Voice', description: 'Synthesizing natural voiceover...' },
  { step: 'scenes', label: 'Assembling Scenes', description: 'Building video scenes and captions...' },
  { step: 'done', label: 'Complete', description: 'Your video is ready!' },
];

const errorMessages: Record<string, { title: string; desc: string }> = {
  MISSING_API_KEY: {
    title: 'Gemini API Key Missing',
    desc: 'The server-side GEMINI_API_KEY is not configured. Add it in Vercel Environment Variables to enable AI generation.',
  },
  INVALID_API_KEY: {
    title: 'Invalid API Key',
    desc: 'The Gemini API key appears to be invalid or expired. Please check the server-side GEMINI_API_KEY in your deployment environment.',
  },
  QUOTA_EXCEEDED: {
    title: 'Quota Exceeded',
    desc: 'Your Gemini API quota has been reached. Please try again later or upgrade your Google AI plan.',
  },
  NETWORK_ERROR: {
    title: 'Network Error',
    desc: 'Could not connect to the Gemini API. Check your internet connection and try again.',
  },
  EMPTY_RESPONSE: {
    title: 'Empty Response',
    desc: 'The AI returned an empty response. Please try again with a different product link.',
  },
  GENERATION_FAILED: {
    title: 'Generation Failed',
    desc: 'Something went wrong while generating the script. Please try again.',
  },
};

export function VideoGeneratorPage({ onNavigate }: VideoGeneratorPageProps) {
  const [productLink, setProductLink] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle>('viral-review');
  const [selectedAccent, setSelectedAccent] = useState<VoiceAccent>('us-female');
  const [selectedTone, setSelectedTone] = useState<VoiceTone>('energetic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const [showPublish, setShowPublish] = useState(false);
  const [copied, setCopied] = useState(false);
  const [publishMode, setPublishMode] = useState<'now' | 'schedule'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const stepTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const geminiStatus = getGeminiStatus();

  const handleGenerate = async () => {
    if (!productLink.trim()) return;

    setError(null);
    setIsGenerating(true);
    setShowPublish(false);
    setGeneratedVideo(null);
    setGeneratedScript(null);
    setCurrentStep(0);

    try {
      const result = await generateVideoScript(productLink, selectedStyle, selectedTone);
      setGeneratedScript(result);

      setCurrentStep(1);
      const video = await generateProductVideo(result.videoPrompt);

      setCurrentStep(2);
      await delay(300);
      setCurrentStep(3);

      const gradient = thumbnailGradients[Math.floor(Math.random() * thumbnailGradients.length)];
      const generatedVideoUrl = video.videoUrl || video.videoData || '';

      setGeneratedVideo({
        id: `v-${Date.now()}`,
        productLink,
        productName: result.productName,
        style: selectedStyle,
        accent: selectedAccent,
        tone: selectedTone,
        script: result.script,
        captions: result.captions,
        affiliateLink: productLink,
        hashtags: result.hashtags,
        thumbnailGradient: gradient,
        duration: video.durationSeconds || 8,
        createdAt: new Date().toISOString(),
        videoUrl: generatedVideoUrl,
      } as GeneratedVideo & { videoUrl: string });
      setShowPublish(true);
    } catch (err) {
      const errorCode = err instanceof Error ? err.message : 'GENERATION_FAILED';
      setError(errorCode);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (generatedVideo) {
      navigator.clipboard?.writeText(generatedVideo.affiliateLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePublish = () => {
    onNavigate('scheduled-posts');
  };

  const handleReset = () => {
    setGeneratedVideo(null);
    setGeneratedScript(null);
    setShowPublish(false);
    setProductLink('');
    setError(null);
  };

  const dismissError = () => setError(null);

  const currentStepData = generationSteps[currentStep] ?? generationSteps[0];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-6">
      {/* Left: Configuration */}
      <div className="space-y-5 min-w-0">
        {/* API key warning banner */}
        {geminiStatus === 'no-key' && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-warning-500/10 border border-warning-500/20 animate-slide-up">
            <AlertTriangle className="w-5 h-5 text-warning-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-ink-100">Gemini API Key Not Configured</p>
              <p className="text-xs text-ink-300 mt-0.5 leading-relaxed">
                Configure <code className="text-warning-300 bg-warning-500/10 px-1.5 py-0.5 rounded text-[11px]">GEMINI_API_KEY</code> on the server in Vercel Environment Variables. The key is intentionally not exposed in the browser.
              </p>
            </div>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-error-500/10 border border-error-500/20 animate-slide-up">
            <AlertCircle className="w-5 h-5 text-error-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-error-300">
                {errorMessages[error]?.title ?? 'Error'}
              </p>
              <p className="text-xs text-ink-300 mt-0.5 leading-relaxed">
                {errorMessages[error]?.desc ?? 'An unexpected error occurred.'}
              </p>
            </div>
            <button
              onClick={dismissError}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-400 hover:text-ink-100 hover:bg-ink-800/60 transition-smooth shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Product link input */}
        <Card>
          <CardHeader
            title="Product Link"
            subtitle="Paste a Shopee, AliExpress, or Amazon product URL"
            icon={<LinkIcon className="w-4 h-4 text-brand-400" />}
          />
          <div className="p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="url"
                  value={productLink}
                  onChange={(e) => setProductLink(e.target.value)}
                  placeholder="https://shopee.com.br/product/..."
                  className="w-full bg-ink-800/60 border border-ink-700/40 rounded-xl px-4 py-3 text-sm text-ink-100 placeholder:text-ink-400 outline-none focus:border-brand-500/50 transition-smooth"
                />
              </div>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setProductLink('https://shopee.com.br/mini-portable-blender-usb-rechargeable-i.123456.7890')}
              >
                Try Example
              </Button>
            </div>
            {!productLink.trim() && (
              <p className="flex items-center gap-1.5 mt-2 text-xs text-ink-400">
                <AlertCircle className="w-3.5 h-3.5" />
                Paste a product link to start generating your video
              </p>
            )}
          </div>
        </Card>

        {/* Video style selector */}
        <Card>
          <CardHeader
            title="Video Style"
            subtitle="Choose the format that fits your product"
            icon={<Sparkles className="w-4 h-4 text-accent-400" />}
          />
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {videoStyleOptions.map((style) => {
              const Icon = styleIcons[style.icon] ?? Flame;
              const isActive = selectedStyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-smooth ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-500/15 to-accent-500/10 border-brand-500/40'
                      : 'bg-ink-800/40 border-ink-700/40 hover:border-ink-600/50 hover:bg-ink-800/60'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-brand-500/20 text-brand-400'
                        : 'bg-ink-700/40 text-ink-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${isActive ? 'text-ink-50' : 'text-ink-100'}`}>
                      {style.label}
                    </p>
                    <p className="text-xs text-ink-400 mt-0.5 leading-snug">{style.description}</p>
                  </div>
                  {isActive && (
                    <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0 ml-auto">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Voice options */}
        <Card>
          <CardHeader
            title="Voiceover"
            subtitle="Pick an accent and tone for the AI narrator"
            icon={<Mic className="w-4 h-4 text-success-400" />}
          />
          <div className="p-5 space-y-4">
            <div>
              <p className="text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2.5">
                Accent
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {voiceAccentOptions.map((accent) => (
                  <button
                    key={accent.id}
                    onClick={() => setSelectedAccent(accent.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-smooth ${
                      selectedAccent === accent.id
                        ? 'bg-accent-500/15 border-accent-500/40 text-ink-50'
                        : 'bg-ink-800/40 border-ink-700/40 text-ink-200 hover:border-ink-600/50'
                    }`}
                  >
                    <span className="text-base">{accent.flag}</span>
                    <span className="truncate">{accent.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2.5">
                Tone
              </p>
              <div className="flex flex-wrap gap-2">
                {voiceToneOptions.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-smooth ${
                      selectedTone === tone.id
                        ? 'bg-brand-500/15 border-brand-500/40 text-ink-50'
                        : 'bg-ink-800/40 border-ink-700/40 text-ink-200 hover:border-ink-600/50'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Generate button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={!productLink.trim() || isGenerating}
            loading={isGenerating}
            icon={!isGenerating ? <Sparkles className="w-4 h-4" /> : undefined}
            className="flex-1"
          >
            {isGenerating ? 'Generating...' : 'Generate AI Video'}
          </Button>
          {generatedVideo && !isGenerating && (
            <Button size="lg" variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Right: Preview & Publishing */}
      <div className="space-y-5 xl:w-[300px] shrink-0">
        {/* Video preview */}
        <div className="flex flex-col items-center gap-4">
          <VideoMockup
            video={generatedVideo}
            isGenerating={isGenerating}
            generationStep={currentStepData.label}
          />

          {/* Generation steps */}
          {isGenerating && (
            <div className="w-full space-y-2">
              {generationSteps.slice(0, 3).map((step, i) => (
                <div
                  key={step.step}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-smooth ${
                    i < currentStep
                      ? 'bg-success-500/10 text-success-300'
                      : i === currentStep
                        ? 'bg-brand-500/10 text-brand-300'
                        : 'bg-ink-800/40 text-ink-400'
                  }`}
                >
                  {i < currentStep ? (
                    <div className="w-5 h-5 rounded-full bg-success-500 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  ) : i === currentStep ? (
                    <span className="w-5 h-5 border-2 border-brand-500/30 border-t-brand-400 rounded-full animate-spin shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-ink-600 shrink-0" />
                  )}
                  <span className="text-xs font-medium">{step.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Generated content */}
        {generatedVideo && !isGenerating && generatedScript && (
          <div className="space-y-4 animate-slide-up">
            {/* Script preview with sections */}
            <Card>
              <CardHeader
                title="Generated Script"
                subtitle={`AI-powered viral script — ${generatedVideo.duration}s`}
                icon={<Play className="w-4 h-4 text-brand-400" />}
                action={<Badge variant="success" dot>AI Generated</Badge>}
              />
              <div className="p-4 space-y-3">
                {generatedScript.hook && (
                  <ScriptSection label="Hook (0-3s)" content={generatedScript.hook} color="text-brand-400" />
                )}
                {generatedScript.problem && (
                  <ScriptSection label="Problem / Product" content={generatedScript.problem} color="text-accent-400" />
                )}
                {generatedScript.benefits && (
                  <ScriptSection label="Benefits" content={generatedScript.benefits} color="text-success-400" />
                )}
                {generatedScript.cta && (
                  <ScriptSection label="Call to Action" content={generatedScript.cta} color="text-warning-400" />
                )}
              </div>
            </Card>

            {/* Affiliate link */}
            <Card>
              <div className="p-4">
                <p className="text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2">
                  Affiliate Link
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-ink-200 bg-ink-800/60 px-3 py-2 rounded-lg border border-ink-700/40 truncate">
                    {generatedVideo.affiliateLink}
                  </code>
                  <button
                    onClick={handleCopyLink}
                    className="w-9 h-9 rounded-lg bg-ink-800/60 border border-ink-700/40 flex items-center justify-center text-ink-300 hover:text-brand-400 hover:border-brand-500/30 transition-smooth shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </Card>

            {/* Hashtags */}
            <Card>
              <div className="p-4">
                <p className="text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Hash className="w-3 h-3" />
                  Viral Hashtags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {generatedVideo.hashtags.map((tag) => (
                    <Badge key={tag} variant="brand">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Publishing options */}
        {showPublish && generatedVideo && (
          <Card className="animate-slide-up">
            <CardHeader
              title="Publish to TikTok"
              subtitle="Post now or schedule for later"
              icon={<Send className="w-4 h-4 text-brand-400" />}
            />
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPublishMode('now')}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-smooth ${
                    publishMode === 'now'
                      ? 'bg-brand-500/15 border-brand-500/40 text-ink-50'
                      : 'bg-ink-800/40 border-ink-700/40 text-ink-200 hover:border-ink-600/50'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span className="text-xs font-semibold">Post Now</span>
                </button>
                <button
                  onClick={() => setPublishMode('schedule')}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-smooth ${
                    publishMode === 'schedule'
                      ? 'bg-accent-500/15 border-accent-500/40 text-ink-50'
                      : 'bg-ink-800/40 border-ink-700/40 text-ink-200 hover:border-ink-600/50'
                  }`}
                >
                  <CalendarClock className="w-4 h-4" />
                  <span className="text-xs font-semibold">Schedule</span>
                </button>
              </div>

              {publishMode === 'schedule' && (
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-ink-800/60 border border-ink-700/40 rounded-xl px-3 py-2.5 text-sm text-ink-100 outline-none focus:border-accent-500/50 transition-smooth [color-scheme:dark]"
                />
              )}

              <div className="p-3 rounded-xl bg-ink-800/40 border border-ink-700/30">
                <p className="text-xs text-ink-300 leading-relaxed">
                  <span className="text-ink-100 font-semibold">Caption:</span>{' '}
                  {generatedVideo.productName} — Get yours now! Link in bio.{' '}
                  {generatedVideo.hashtags.slice(0, 4).join(' ')}
                </p>
              </div>

              <Button
                size="md"
                className="w-full"
                icon={publishMode === 'now' ? <Send className="w-4 h-4" /> : <CalendarClock className="w-4 h-4" />}
                onClick={handlePublish}
              >
                {publishMode === 'now' ? 'Post to TikTok' : 'Schedule Post'}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ScriptSection({ label, content, color }: { label: string; content: string; color: string }) {
  return (
    <div>
      <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${color}`}>{label}</p>
      <p className="text-xs text-ink-200 leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  );
}
