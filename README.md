# Mela Winter Arc

Premium, mobile-first wellness challenge built with Next.js, Tailwind CSS, and Supabase.

## What is included

- A 45-day challenge flow for June 1, 2026 through July 15, 2026
- Dual-mode logic for `The Great Lock In` and `Soft Lock In`
- Strict weekday reset behavior
- Weekly class or club tracking
- Streak and progress tracking
- A shareable branded progress card
- Supabase-ready schema for auth and persistence
- Local demo persistence so the UI works before Supabase is connected

## Project structure

```text
.
├── app
│   ├── auth/callback/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── auth-panel.tsx
│   ├── challenge-dashboard.tsx
│   └── share-card.tsx
├── lib
│   ├── challenge.ts
│   ├── constants.ts
│   ├── types.ts
│   ├── utils.ts
│   └── supabase
│       ├── client.ts
│       ├── server.ts
│       └── state.ts
├── supabase
│   └── schema.sql
├── .env.example
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Core behavior

- `Mon-Fri`: `The Great Lock In`
- `Sat-Sun`: `Soft Lock In`
- Any weekday rule break resets challenge progress to Day 1 and resets the streak
- Weekend misses reset the streak and keep the challenge feeling softer
- The weekly class or club task is surfaced during weekdays and expected by Friday check-in

## Setup

1. Install dependencies.

```bash
npm install
```

2. Copy the environment file.

```bash
cp .env.example .env.local
```

3. Add your Supabase values to `.env.local`.

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

4. Create a new Supabase project.

5. In the Supabase SQL editor, run [`supabase/schema.sql`](./supabase/schema.sql).

6. In Supabase Auth, enable Email OTP or Magic Link.

7. Set your site URL and redirect URL to include:

```text
http://localhost:3000/auth/callback
https://your-production-domain.com/auth/callback
```

8. Start the app.

```bash
npm run dev
```

## Deployment

### Vercel

1. Push this project to GitHub.
2. Import the repository into Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel environment variables.
4. Deploy.
5. Add the Vercel production URL to Supabase Auth redirect URLs.

### Supabase

1. Keep row-level security enabled.
2. Run the schema in production.
3. Confirm the auth redirect URLs match your deployed domain.

## Implementation notes

- The app stores aggregate challenge state in `challenge_states`.
- Individual day submissions are stored in `daily_checkins`.
- The UI uses local persistence as a fallback when Supabase is not configured.
- The current build assumes the 2026 winter arc window. If you want to make the year dynamic, update [`lib/constants.ts`](./lib/constants.ts).

## Suggested next improvements

- Move the reset logic into a Supabase RPC if you want the database to become the final source of truth
- Add push notifications or recurring reminders
- Add a signed-in history screen with previous check-ins and reset moments
