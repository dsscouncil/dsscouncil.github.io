# Dubai Scholars Secondary Student Council

The Council platform — public site + **Governor's Console** admin dashboard, backed by Supabase so every device sees the same live data.

## What's inside

- **Public site** — Home, About (with interactive circles diagram), Our Council, Initiatives, Events, Student Voice, Clubs, News, Documents, Contact
- **Admin console** (`/#/admin`) — manage every section: members, initiatives, events, clubs, news, documents, circle quotes, leadership messages, voice submissions (with analytics), settings
- **Real backend** — Supabase (Postgres) with row-level security. Public visitors can read content and submit the voice form; only token-authenticated admins can write. Admin login is rate-limited (8 attempts / 10 min).

## Stack

- Vite + React 19 + Tailwind CSS v4
- react-router-dom (HashRouter — works on any static host)
- @supabase/supabase-js
- Supabase project: `dsscouncil` (ap-south-1) — `https://tguvcfpqjiedvpfkrinr.supabase.co`

## Run locally

```bash
bun install        # or npm install
bun run dev        # dev server at http://localhost:5173
bun run build      # production build to dist/
bun run build:preview  # single-file bundle (used by the Freebuff preview tab)
```

## Deploy (make it work on other devices)

The site is a static SPA — deploy `dist/` to any static host:

**Netlify (easiest)**
1. `bun run build`
2. Drag the `dist` folder into https://app.netlify.com/drop
3. Done — you get a public URL immediately. Add a custom domain in Site settings.

**Vercel**
1. `npm i -g vercel && vercel` in this folder (framework: Vite, build: `bun run build`, output: `dist`)

**GitHub Pages / school server**
- Upload the contents of `dist/` anywhere that serves static files. HashRouter means no server config is needed.

Note: the Supabase URL and publishable key are already embedded in `src/admin/supabase.js` — this is safe and standard (the publishable key is public by design; all protection is server-side via RLS + token-gated RPCs).

## Admin accounts

Visit `/#/admin`. Accounts are stored server-side (hashed) in the `admin_accounts` table:

| Username     | Password       |
| -----------  | -------------- |
| exampleuser  | example        |
| exampleuser2 | example2       |

To add/remove admins or change passwords: edit the `admin_accounts` table in the Supabase dashboard (Table Editor), or ask for a one-line SQL statement. Passwords are stored as `admin_hash_password(password, username)` — to set a new one run:

```sql
update admin_accounts set password_hash = admin_hash_password('NEW_PASSWORD', 'USERNAME') where username = 'USERNAME';
```

## Data model (Supabase)

Content tables (public read): `site_settings`, `stats`, `pillars`, `circle_quotes`, `members`, `initiatives`, `events`, `clubs`, `news`, `documents`, `leadership_messages`, `ideas_board`
Private: `submissions` (public insert only — no public read), `admin_accounts`, `admin_sessions`, `admin_login_failures` (no client access at all)

All admin writes go through `admin_write` / `admin_reset_content` RPCs which validate a session token server-side. Sessions last 12 hours.

## Year rollover

1. **Settings → Export JSON** — archive the year
2. Edit content (members, etc.) for the new council — or prepare a JSON file and use **Restore from Backup**
3. Update the academic year in Settings

Restores replace all content tables but never touch submissions or accounts.
