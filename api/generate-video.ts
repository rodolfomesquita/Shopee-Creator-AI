import { GoogleGenAI } from '@google/genai';

function json(res: any, status: number, data: unknown) {
  res.status(status).setHeader('Content-Type', 'application/json').json(data);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return json(res, 405, { error: 'METHOD_NOT_ALLOWED' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json(res, 500, { error: 'MISSING_GEMINI_API_KEY' });

  const { prompt, imageBase64, imageMimeType } = (req.body || {}) as {
    prompt?: string; imageBase64?: string; imageMimeType?: string;
  };
  if (!prompt) return json(res, 400, { error: 'PROMPT_REQUIRED' });

  try {
    const ai = new GoogleGenAI({ apiKey });
    const config: Record<string, unknown> = {
      aspectRatio: '9:16',
      resolution: '720p',
      durationSeconds: 8,
      numberOfVideos: 1,
    };

    let operation;
    if (imageBase64 && imageMimeType) {
      operation = await ai.models.generateVideos({
        model: process.env.GEMINI_VIDEO_MODEL || 'veo-3.1-generate-preview',
        prompt,
        image: { imageBytes: imageBase64, mimeType: imageMimeType },
        config,
      });
    } else {
      operation = await ai.models.generateVideos({
        model: process.env.GEMINI_VIDEO_MODEL || 'veo-3.1-generate-preview',
        prompt,
        config,
      });
    }

    return json(res, 200, {
      operationName: operation.name,
      status: operation.done ? 'done' : 'processing',
      durationSeconds: 8,
      note: 'Veo 3.1 currently generates 4/6/8-second clips in this API. The app uses 8 seconds as the stable vertical base; a 10-second finishing adapter can be added later.',
    });
  } catch (error) {
    console.error('generate-video error', error);
    return json(res, 500, { error: 'VIDEO_GENERATION_START_FAILED', detail: error instanceof Error ? error.message : String(error) });
  }
}
