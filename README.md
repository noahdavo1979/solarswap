# SolarSwap Cloud Starter (backend + frontend + admin)

## What this package contains
- backend/  -> Node.js + Express API (in-memory stores for quick cloud demo)
- frontend/ -> Next.js public customer UI (pages: index, dashboard, login)
- admin/    -> Next.js admin UI (pages: index, offers, trades)

## Goal
Deploy everything **fully cloud-based** (no local development required):
- Backend -> Render (free plan)
- Frontend -> Vercel (free plan)
- Admin -> Vercel (free plan)
- (Optional) Database & Auth -> Supabase (free tier)

## Quick Deploy Instructions (browser-only)

### 1) Upload to GitHub (web UI)
1. Create a new repo on GitHub (https://github.com/new). Name it `solarswap`.
2. On the repo page, click **Add file → Upload files**.
3. Drag the three items **backend**, **frontend**, **admin**, and `README.md` from this package into the upload area (do not drag the top-level folder itself; drop the folder contents).
4. Commit changes.

### 2) Deploy Backend on Render
1. Go to https://render.com and sign in with GitHub.
2. Click **New + → Web Service**.
3. Select the `solarswap` repository and branch `main`.
4. Set **Root Directory** to `backend` (VERY IMPORTANT).
5. Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Advanced → Add Environment Variable: `PORT=4000`
7. Plan: Free → Create Web Service.
8. After deploy, note the Render URL (e.g. https://solarswap-backend.onrender.com).

### 3) Deploy Frontend on Vercel
1. Go to https://vercel.com and sign in with GitHub.
2. Click **New Project → Import Git Repository** and pick `solarswap`.
3. In the project setup set **Root Directory** to `frontend`.
4. Add Environment Variable:
   - `NEXT_PUBLIC_BACKEND_URL` = `https://<your-render-url>`
5. Build & Output: leave defaults for Next.js (Vercel will detect)
6. Deploy. Visit the Vercel URL and open `/dashboard`.

### 4) Deploy Admin on Vercel
1. Repeat Vercel import but set **Root Directory** to `admin`.
2. Set `NEXT_PUBLIC_BACKEND_URL` to the same Render backend URL.
3. Deploy.

### 5) Optional: Add Supabase for real DB & Auth
- Create a Supabase project (free tier). Copy the `DATABASE_URL` and API keys.
- Update your Render service environment variables with the DB URL and keys.
- Replace the in-memory arrays in backend code with real DB queries (we can help next).

## Notes & Next Steps
- This starter uses in-memory storage (resets every deploy). For pilot with real users, connect Supabase/Postgres.
- For payments, integrate Stripe (server + webhooks).
- For secure user auth, use Supabase Auth or implement JWT + KYC for payouts.

## Support
If anything fails during deploy, paste the exact Render/Vercel log here and I'll fix it step-by-step.
