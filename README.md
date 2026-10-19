# nimi — portfolio

One-page portfolio about AI, tech & crypto, with an admin panel at `/admin`.

- **Stack:** Next.js 16 + Tailwind + Framer Motion, Supabase (login, database, file storage), hosted on Vercel.
- **First-time setup:** [`docs/SETUP.md`](docs/SETUP.md)
- **Run locally:** `npm install`, then `npm run dev`, then open http://localhost:3000

## Where things live

| Path | What it is |
| --- | --- |
| `app/page.tsx` | The public one-page site |
| `components/site/` | Public sections, top bar, dot nav, counters, circle showcases |
| `app/admin/` | Admin pages + `actions.ts` (every save, all checked on the server) |
| `components/admin/` | Admin forms, uploads, drag-to-reorder |
| `lib/visibility.ts` | The "empty sections are hidden" rule |
| `lib/layouts.ts` | Which fields each section layout has |
| `lib/seed.ts` | Built-in copy of the content (used until Supabase is connected) |
| `supabase/*.sql` | Database tables, security rules, storage bucket, starting content |
| `proxy.ts` | Sends anyone who isn't the admin away from `/admin` |
