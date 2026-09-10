import { GoogleGenAI } from '@google/genai';
import { readFile } from 'node:fs/promises';

function json(res: any, status: number, data: unknown) {
  res.status(status).setHeader('Content-Type', 'application/json').json(data);
}

async function uploadToSupabase(bytes: Buffer, contentType: string) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const bucket = process.env.SUPABASE_VIDEO_BUCKET || 'generated-videos';
  const fileName = `videos/${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`;
  const upload = await fetch(`${url}/storage/v1/object/${bucket}/${fileName}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      'Content-Type': contentType,
      'x-upsert': 'true',
    },
    body: bytes,
  });
  if (!upload.ok) throw new Error(`SUPABASE_UPLOAD_FAILED:${upload.status}`);
  return `${url}/storage/v1/object/public/${bucket}/${fileName}`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return json(res, 405, { error: 'METHOD_NOT_ALLOWED' });
  const operationName = String(req.query.operation || '').trim();
  if (!operationName) return json(res, 400, { error: 'OPERATION_REQUIRED' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json(res, 500, { error: 'MISSING_GEMINI_API_KEY' });

  try {
    const ai = new GoogleGenAI({ apiKey });
    const operation = await ai.operations.getVideosOperation({ operation: { name: operationName } as any });

    if (!operation.done) return json(res, 200, { status: 'processing' });

    const generated = operation.response?.generatedVideos?.[0]?.video;
    if (!generated) return json(res, 500, { status: 'failed', error: 'VIDEO_RESULT_MISSING' });

    const tempPath = `/tmp/${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`;
    await ai.files.download({ file: generated, downloadPath: tempPath });
    const bytes = await readFile(tempPath);
    const publicUrl = await uploadToSupabase(bytes, 'video/mp4');

    if (publicUrl) return json(res, 200, { status: 'done', videoUrl: publicUrl, durationSeconds: 8 });

    // Development fallback. For production, configure Supabase Storage.
    return json(res, 200, {
      status: 'done',
      videoData: `data:video/mp4;base64,${bytes.toString('base64')}`,
      durationSeconds: 8,
      warning: 'SUPABASE_NOT_CONFIGURED',
    });
  } catch (error) {
    console.error('video-status error', error);
    return json(res, 500, { status: 'failed', error: 'VIDEO_STATUS_FAILED', detail: error instanceof Error ? error.message : String(error) });
  }
}
