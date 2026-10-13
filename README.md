# Pihu Malhotra — Portfolio

Next.js site, ready for Vercel. All content lives in `app/data.js`. Edit that file to update text, stats, roles or skills.

## Deploy to Vercel (about 5 minutes)

**Option A — GitHub (recommended, auto-updates on every change)**
1. Create a new empty repository on github.com (e.g. `pihu-portfolio`).
2. Upload this folder's contents. Drag-and-drop on GitHub works.
3. Go to vercel.com → sign in with GitHub → **Add New → Project** → import the repo → **Deploy**.
   Vercel detects Next.js automatically, so no settings are needed.

**Option B — Vercel CLI**
```bash
npm install
npx vercel        # first time: log in, accept defaults
npx vercel --prod
```

## Run locally
```bash
npm install
npm run dev       # http://localhost:3000
```

## Custom domain
Vercel project → Settings → Domains → add your domain, then follow the DNS instructions.
