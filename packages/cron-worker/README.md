# Befday Cloudflare Cron Worker

A free Cloudflare Worker with a Cron Trigger that invokes the Befday birthday reminder endpoint daily.

## Schedule

Configured in `wrangler.jsonc` to run every day at `0 16 * * *` (16:00 UTC = 00:00 midnight GMT+8 Malaysia/Singapore time).

## Environment Variables

- `CRON_SECRET`: Secret token matching `CRON_SECRET` in `.env`.
- `NEXT_PUBLIC_SITE_URL`: Base application URL (e.g. `https://www.befday.com`).

## Setup & Deployment

### Option A: Deploy via Wrangler

```bash
cd packages/cron-worker
bunx wrangler secret put CRON_SECRET
# Enter secret matching CRON_SECRET in your .env
bunx wrangler secret put NEXT_PUBLIC_SITE_URL
# Enter https://www.befday.com
bunx wrangler deploy
```

### Option B: Cloudflare Dashboard (1-Click UI)

1. In the **Cloudflare Dashboard**, go to **Workers & Pages** > **Create application** > **Create Worker**.
2. Name it `befday-cron`.
3. In the code editor, paste the contents of `src/index.ts`.
4. Go to **Settings** > **Variables and Secrets** > Add Secrets:
   - `CRON_SECRET`
   - `NEXT_PUBLIC_SITE_URL`
5. Go to **Settings** > **Triggers** > **Cron Triggers** > Add Cron Trigger: `0 16 * * *`.
