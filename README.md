# Pumpky

AI-powered meme coin flipping assistant built as a real full-stack MVP.

Pumpky helps users discover, rank, and analyze meme coins for short-term opportunities with a terminal-grade UI: opportunity scoring, risk intelligence, momentum signals, watchlist workflows, and token deep dives.

---

## Product Snapshot

**Brand vibe:** Bloomberg terminal × crypto operator dashboard (green phosphor aesthetic, dark surfaces, scanline accents).

### Core capabilities

- Trending meme coin discovery
- Weighted ranking engine (Opportunity / Risk / Momentum / Sentiment / Liquidity)
- Red-flag and contract risk visibility
- Token detail view with AI summary, catalysts, and warnings
- Leaderboard with sorting + filtering
- Watchlist with notes, tags, and simulated alerts
- Market pulse page for narrative + risk flow
- API health/status surfaces
- Demo data mode with provider abstraction ready for live integrations

---

## Implemented Pages

- `/` — Landing page
- `/dashboard` — Main operator dashboard
- `/tokens/[id]` — Token detail page
- `/leaderboard` — Sortable rankings board
- `/watchlist` — Saved tokens + notes/tags/alerts UX
- `/pulse` — Market pulse / signal feed
- `/status` — Integration and runtime status
- `/settings` — Local preference controls

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom terminal design system
- **Animation:** Framer Motion
- **Charts:** Recharts
- **Database:** PostgreSQL + Prisma
- **State (client):** Zustand (watchlist + preferences)
- **Deployment target:** Vercel (app) + Supabase/Railway/Render Postgres

---

## Repository Structure

```text
.
├── app
│   ├── (app)
│   │   ├── dashboard/page.tsx
│   │   ├── leaderboard/page.tsx
│   │   ├── pulse/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── status/page.tsx
│   │   ├── tokens/[id]/page.tsx
│   │   ├── watchlist/page.tsx
│   │   ├── layout.tsx
│   │   └── loading.tsx
│   ├── api
│   │   ├── health/route.ts
│   │   └── tokens/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components
│   ├── charts/*
│   ├── layout/*
│   ├── settings/settings-panel.tsx
│   ├── terminal/*
│   ├── tokens/*
│   └── watchlist/*
├── lib
│   ├── data
│   │   ├── demo-tokens.ts
│   │   ├── mock-provider.ts
│   │   ├── live-provider.ts
│   │   └── provider.ts
│   ├── scoring/engine.ts
│   ├── types/index.ts
│   ├── db.ts
│   └── utils.ts
├── prisma
│   ├── schema.prisma
│   └── seed.ts
├── store
│   ├── filters.ts
│   ├── preferences.ts
│   └── watchlist.ts
├── .github/workflows/ci.yml
├── Dockerfile
├── docker-compose.yml
├── vercel.json
├── package.json
└── .env.example
```

---

## Quick Start

### 1) Install

```bash
npm install
```

### 2) Configure env

```bash
cp .env.example .env.local
```

Set `DATABASE_URL` to your local or hosted Postgres.

### 3) Prepare database

```bash
npm run db:push
npm run db:seed
```

### 4) Run

```bash
npm run dev
```

Open http://localhost:3000

---

## NPM Scripts

- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run type-check` — TypeScript checks
- `npm run db:push` — push Prisma schema
- `npm run db:migrate` — create migration
- `npm run db:seed` — seed demo tokens
- `npm run db:reset` — reset DB + reseed
- `npm run db:studio` — Prisma Studio

---

## Scoring Model (Implemented)

All core scores are `0–100`.

### Opportunity Score
Weighted by:
- Momentum `30%`
- Liquidity score `20%`
- Social traction `20%`
- Volume acceleration `15%`
- Narrative heat `15%`

### Risk Score
Weighted by:
- Holder concentration `25%`
- Contract flags `20%`
- Liquidity risk `20%`
- Rug indicators `15%`
- Volatility `10%`
- Age risk `10%`

### Momentum Score
Weighted by:
- Price acceleration `40%`
- Volume surge `30%`
- Buy/sell ratio `20%`
- TX acceleration `10%`

### Sentiment Score
Weighted by:
- Twitter traction `30%`
- Telegram activity `25%`
- Influencer mentions `20%`
- Narrative alignment `15%`
- Reddit mentions `10%`

### Liquidity Score
Weighted by:
- Absolute liquidity `35%`
- Liquidity/MC ratio `30%`
- Locked liquidity `20%`
- DEX depth proxy `15%`

Source: `lib/scoring/engine.ts`

---

## Data Layer Architecture

Pumpky uses a provider abstraction:

- `lib/data/mock-provider.ts` → current production-safe demo source
- `lib/data/live-provider.ts` → live adapter scaffold (same contract)
- `lib/data/provider.ts` → runtime switch (`USE_LIVE_DATA=true|false`)

This keeps UI pages unchanged when moving from demo to live APIs.

---

## API Endpoints

- `GET /api/health` — service health + config status
- `GET /api/tokens` — token list API (query-based filtering/sorting)

---

## Deployment

### Recommended stack

- **Frontend/App:** Vercel
- **Database:** Supabase Postgres (or Railway/Render)

### Vercel setup

1. Import repo to Vercel
2. Set environment variables from `.env.example`
3. Set `DATABASE_URL` to hosted Postgres
4. Deploy
5. Run seed once (locally or CI):

```bash
npm run db:push && npm run db:seed
```

### Docker (optional)

Run app + Postgres locally:

```bash
docker compose up --build
```

---

## CI

GitHub Actions workflow at `.github/workflows/ci.yml` runs:

1. `npm ci`
2. `prisma generate`
3. `npm run type-check`
4. `npm run build`

---

## Notes

- UI includes scanline/grid terminal effects with responsive behavior.
- Watchlist and preferences persist in browser local storage via Zustand.
- This project is analytics tooling only and intentionally avoids guaranteed-return language.

---

## Disclaimer

Pumpky is an analytics product for informational use only and **not financial advice**.
Meme coins are highly volatile and can lose all value.
