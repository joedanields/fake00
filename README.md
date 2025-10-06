# Will-It-Rain-On-My-Parade — Frontend

A Next.js App Router frontend for the Flask backend at:
- Default backend URL: https://will-it-rain-on-my-parade-e1yj.onrender.com

Key features:
- Location search
- Current weather
- Forecast with AI summary
- Recommendations
- Weather-driven theming (sunny, cloudy, rainy, stormy, snow, fog, windy, night)
- Smooth, motion-safe animations and responsive cards/tabs
- Server-side proxy to avoid CORS: `/api/proxy/*` → BACKEND_URL

## 1) Local Setup
Option A — Vercel (recommended)
1. Click “Download ZIP” from v0 to get the project.
2. Import the project into Vercel or run “Publish” from v0.
3. In Project Settings → Environment Variables, add:
   - BACKEND_URL = https://will-it-rain-on-my-parade-e1yj.onrender.com
4. Redeploy.

Option B — Run locally with Next.js
1. Download the ZIP from v0 and extract.
2. Ensure Node 18+ is installed.
3. Add an environment variable (shell or `.env.local` if you’re using a full Next.js setup):
   - BACKEND_URL=https://will-it-rain-on-my-parade-e1yj.onrender.com
4. Install and run:
   - npm install
   - npm run dev
5. Visit http://localhost:3000

Notes:
- The app uses `/api/proxy/...` to reach the Flask backend. If BACKEND_URL is not set, it defaults to the Render URL above.
- All API calls are server-routed to avoid CORS issues.

## 2) Usage
- Enter a city, zip, or “lat,lon” in the search (e.g., “London” or “51.52,-0.11”).
- Tabs: Current | Forecast | Recommendations.
- The theme updates dynamically based on weather conditions (e.g., cloudy → darker, sunny → bright).

## 3) Accessibility & Design
- 3–5 color tokens per theme, solid fills, no gradients.
- Motion-safe animations; subtle transitions for color and section entrance.
- Semantic HTML and shadcn/ui components for consistent UX.
