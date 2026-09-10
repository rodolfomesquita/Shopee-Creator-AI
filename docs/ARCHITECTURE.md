# Architecture

```text
Browser
  |
  | POST /api/generate-script
  v
Vercel Function
  |
  +--> Gemini text model
  |
  +--> JSON script + video prompt
  |
  | POST /api/generate-video
  v
Vercel Function
  |
  +--> Veo 3.1 long-running operation
  |
  | GET /api/video-status?operation=...
  v
Vercel Function
  |
  +--> Gemini operation polling
  |
  +--> download MP4
  |
  +--> Supabase Storage (recommended)
  |
  v
Browser <--- public video URL
```

## Why this is different from the original prototype

The original client directly called Gemini and then simulated voice/scenes with timers. The new architecture keeps secrets server-side and treats video generation as an asynchronous job.

## 10-second strategy

Veo 3.1's Gemini API supports 4/6/8-second generation. The current adapter uses 8 seconds. Exact 10 seconds should be implemented as a separate post-processing/extension stage instead of lying about the duration.

## Provider abstraction

When the project grows, create:

- `src/server/providers/gemini-text.ts`
- `src/server/providers/veo.ts`
- `src/server/providers/tts.ts`
- `src/server/providers/shopee.ts`
- `src/server/storage/supabase.ts`

Then the UI does not need to know which vendor is used.
