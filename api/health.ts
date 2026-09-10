export default function handler(_req: any, res: any) {
  res.status(200).json({
    ok: true,
    app: 'Shopee Creator AI',
    version: '1.0.0',
    services: {
      gemini: Boolean(process.env.GEMINI_API_KEY),
      supabase: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      shopee: Boolean(process.env.SHOPEE_PARTNER_ID && process.env.SHOPEE_PARTNER_KEY),
    },
  });
}
