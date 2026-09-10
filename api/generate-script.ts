import { GoogleGenAI } from '@google/genai';

type Body = { productLink: string; style?: string; tone?: string; language?: string };

function json(res: any, status: number, data: unknown) {
  res.status(status).setHeader('Content-Type', 'application/json').json(data);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return json(res, 405, { error: 'METHOD_NOT_ALLOWED' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json(res, 500, { error: 'MISSING_GEMINI_API_KEY' });

  const body = (req.body || {}) as Body;
  const productLink = String(body.productLink || '').trim();
  if (!productLink) return json(res, 400, { error: 'PRODUCT_LINK_REQUIRED' });

  const style = body.style || 'viral-review';
  const tone = body.tone || 'energetic';
  const language = body.language || 'pt-BR';

  const prompt = `Você é um especialista em criativos de afiliados da Shopee no Brasil.
Crie um roteiro REALISTA para um vídeo vertical de aproximadamente 10 segundos.
Não invente especificações, preços, descontos, comissão ou características que não foram fornecidas.
Se o link não revelar o produto, use apenas o identificador/URL e deixe campos desconhecidos como "não informado".

Retorne SOMENTE JSON válido:
{
  "productName": "...",
  "hook": "...",
  "script": "...",
  "cta": "Compre pelo link",
  "captions": ["...", "...", "..."],
  "hashtags": ["#shopee", "#achadinhos", "..."],
  "videoPrompt": "..."
}

Idioma: ${language}
Estilo: ${style}
Tom: ${tone}
Link do produto: ${productLink}

O roteiro falado deve caber em cerca de 10 segundos. O CTA deve ser curto.
O videoPrompt deve descrever um anúncio vertical 9:16, realista, premium, com o produto como protagonista e sem texto na tela.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_TEXT_MODEL || 'gemini-3.7-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });
    const text = response.text || '';
    const clean = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    const data = JSON.parse(clean);
    return json(res, 200, { ...data, productLink });
  } catch (error) {
    console.error('generate-script error', error);
    return json(res, 500, { error: 'SCRIPT_GENERATION_FAILED', detail: error instanceof Error ? error.message : String(error) });
  }
}
