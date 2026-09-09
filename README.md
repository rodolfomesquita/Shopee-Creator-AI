# Shopee Creator AI

Base rebuilt from the original ViralForge prototype. This version moves AI secrets to server-side Vercel Functions and replaces the fake "video generated" flow with a real long-running Veo 3.1 job + polling architecture.

## What is implemented

- React/Vite frontend (existing UI preserved as the starting point)
- Server-side Gemini/Veo integration under `/api`
- Script generation in Brazilian Portuguese
- Real Veo 3.1 video job creation
- Polling until the video is finished
- 9:16 / 720p / 8-second base generation
- Optional Supabase Storage upload for persistent public video URLs
- Development fallback that returns the generated MP4 as a data URL when Supabase is not configured
- No `VITE_GEMINI_API_KEY`: the Gemini key stays on the server
- Architecture prepared for real Shopee affiliate/product APIs without inventing product or commission data

## Important about "10 seconds"

The current Gemini Veo 3.1 API generates 4, 6 or 8-second clips. The scaffold therefore uses a stable 8-second vertical generation. Do not fake a 10-second duration in metadata. A later finishing adapter can extend/pad the clip to exactly 10 seconds.

## Install

```bash
npm install
cp .env.example .env.local
npm run dev
```

For Windows PowerShell:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

## Environment variables

Required:

- `GEMINI_API_KEY`

Recommended for production:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_VIDEO_BUCKET=generated-videos`

Optional:

- `GEMINI_TEXT_MODEL=gemini-3.7-flash`
- `GEMINI_VIDEO_MODEL=veo-3.1-generate-preview`

Never expose these as `VITE_*`.

## Supabase

Create a Storage bucket named `generated-videos` and make it public if you want the returned URLs to play directly in the browser. Run `supabase/schema.sql` in the Supabase SQL editor for the database foundation.

## Vercel

Import the repository/project into Vercel. Add the environment variables in Project Settings -> Environment Variables. Redeploy after adding or changing secrets.

The included `vercel.json` sets a 300-second function duration. Video generation is long-running, so the frontend does not keep one request open: it starts the job and polls `/api/video-status`.

## Product/Shopee integration

The UI still contains the original mock product finder. It is intentionally NOT presented as real Shopee data. To connect real affiliate data, implement an official Shopee/affiliate adapter using the credentials and API access available to your account. Do not scrape or invent commission data.

Recommended future endpoint:

`POST /api/shopee/products/search`

Input:
- category
- minimum/maximum price
- minimum commission
- sorting
- page

Output:
- product id
- name
- image
- price
- original price
- commission
- commission rate
- rating
- sales
- affiliate URL

## Production roadmap

1. Connect official Shopee affiliate/product API.
2. Store products and affiliate links in Supabase.
3. Add user authentication.
4. Add product image upload/reference-image generation.
5. Add exact 10-second finishing pipeline.
6. Add voice selection and optional external TTS if native Veo audio is not desired.
7. Add content variations (5 hooks per product).
8. Add TikTok/Instagram/Shopee publishing only through supported official APIs or approved integrations.
9. Add real analytics instead of mock dashboard values.

## Security

Never commit `.env.local`.
Never put service-role keys or Gemini keys in frontend code.
Never trust affiliate URLs or product metadata from the browser without validation.
Rate-limit generation endpoints before opening the app publicly.

## Current limitation

The app is a real integration scaffold, not a fully connected Shopee affiliate network. Video generation is real when a valid Gemini API key with Veo access is configured. Shopee discovery/commission data still needs your official affiliate/API credentials and the exact API products available to your account.
