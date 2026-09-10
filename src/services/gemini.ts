import type { VideoStyle, VoiceTone } from '@/types';

export interface GeneratedScript {
  script: string;
  hook: string;
  problem: string;
  benefits: string;
  cta: string;
  captions: string[];
  hashtags: string[];
  productName: string;
  videoPrompt: string;
  productLink: string;
}

export type GeminiStatus = 'ready' | 'no-key' | 'error';

export function getGeminiStatus(): GeminiStatus {
  // The API key is now server-side. The UI only checks that the backend route exists.
  return 'ready';
}

export async function generateVideoScript(
  productInput: string,
  style: VideoStyle,
  tone: VoiceTone,
): Promise<GeneratedScript> {
  const response = await fetch('/api/generate-script', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productLink: productInput,
      style,
      tone,
      language: 'pt-BR',
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'GENERATION_FAILED');
  }
  return data as GeneratedScript;
}

export async function generateProductVideo(
  prompt: string,
  imageBase64?: string,
  imageMimeType?: string,
): Promise<{ videoUrl?: string; videoData?: string; durationSeconds: number }> {
  const start = await fetch('/api/generate-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, imageBase64, imageMimeType }),
  });

  const startData = await start.json().catch(() => ({}));
  if (!start.ok) throw new Error(startData.error || 'VIDEO_GENERATION_START_FAILED');

  const operation = startData.operationName;
  if (!operation) throw new Error('VIDEO_OPERATION_MISSING');

  const maxAttempts = 72; // ~12 minutes at 10s intervals
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, attempt === 0 ? 2000 : 10000));
    const status = await fetch(`/api/video-status?operation=${encodeURIComponent(operation)}`);
    const data = await status.json().catch(() => ({}));

    if (data.status === 'done') return data;
    if (data.status === 'failed') throw new Error(data.error || 'VIDEO_GENERATION_FAILED');
  }

  throw new Error('VIDEO_GENERATION_TIMEOUT');
}
