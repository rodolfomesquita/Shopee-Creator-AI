export default function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });

  const configured = Boolean(process.env.SHOPEE_PARTNER_ID && process.env.SHOPEE_PARTNER_KEY);
  if (!configured) {
    return res.status(501).json({
      error: 'SHOPEE_INTEGRATION_NOT_CONFIGURED',
      message: 'Configure the official affiliate/API credentials for your Shopee account before enabling live product discovery.',
    });
  }

  // Intentionally not implemented until the exact official API products/scopes
  // available to the user's Shopee account are confirmed.
  return res.status(501).json({
    error: 'SHOPEE_ADAPTER_PENDING',
    message: 'The Shopee adapter interface is reserved for the official API integration. No scraping or fabricated commission data is used.',
  });
}
