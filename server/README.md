Server-side post-upload image compressor

What it does
- Polls a Supabase storage folder (default `product-images/products`) and compresses JPG/PNG images using `sharp`.
- Overwrites the original file with a compressed JPEG (resized to max width, quality tuned).

Why use this
- Keeps original upload flow simple for clients (fast response), and produces optimized images for web display.
- Useful when you don't need to keep the original as-is.

Setup
1. Install dependencies (on your server/container):

```bash
cd server
npm install
```

2. Set environment variables (recommended via systemd/PM2 or container env):

- `SUPABASE_URL` — your Supabase URL
- `SUPABASE_SERVICE_ROLE_KEY` — a service role key (required for server-side storage access)
- Optional: `BUCKET` (default: `product-images`), `FOLDER` (default: `products`), `POLL_INTERVAL_MS` (default: 300000), `MAX_WIDTH` (default: 1920), `JPEG_QUALITY` (default: 75)

Run

```bash
# from project root
cd server
npm start
```

Deployment suggestions
- Run as a background service (systemd / PM2 / Docker). Set `POLL_INTERVAL_MS` shorter if you want near-real-time processing.
- Alternatively implement a Supabase Function / webhook to trigger this worker for real-time processing instead of polling.

Notes
- This worker overwrites original files. If you want to preserve originals, change the upload path or store a copy before overwriting.
- Sharp requires native builds; in Docker use an image that includes libvips (official sharp images) or build on Linux.
