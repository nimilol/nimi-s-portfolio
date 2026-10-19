# Setup guide (beginner friendly)

This is the one-time setup for your new portfolio. Do the steps in order.
You only click things in websites. No code needed.

---

## What is what?

- **Next.js**: the framework your site is built with now (it replaces the old `index.html`).
- **Supabase**: your free online database. It stores your text, images and videos, and handles the admin login.
- **Vercel**: hosts your site. When code lands on the `main` branch on GitHub, Vercel updates the live site by itself.
- **Environment variables**: settings like your Supabase address, kept outside the code. You add them once in Vercel.

---

## Step 1: Copy your 2 Supabase values

1. Open <https://supabase.com/dashboard> and click your project.
2. Click the **Connect** button at the top of the page.
3. Pick the **App Frameworks** tab, then **Next.js**.
4. You'll see 2 lines. Copy both somewhere safe for a minute:
   - `NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...` (older projects show `ANON_KEY=eyJ...`; either one works)

> The **publishable / anon** key is safe to show in a browser.
> **Never** copy the **secret** or **service_role** key anywhere. This site doesn't need it.

---

## Step 2: Add the 3 environment variables in Vercel

1. Open <https://vercel.com>, click your portfolio project.
2. Go to **Settings → Environment Variables**.
3. Add these 3, one at a time. For each one, tick **Production**, **Preview** and **Development**:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | the URL from Step 1 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the publishable (or anon) key from Step 1 |
| `ADMIN_EMAIL` | `victoradoji4@gmail.com` |

> Note: use the name `NEXT_PUBLIC_SUPABASE_ANON_KEY` exactly as written, even when your key is a "publishable" key.

4. While you're in Settings, open **Build and Deployment** and check that **Framework Preset** says **Next.js**.
   If it says "Other", change it to Next.js and save. (The `vercel.json` file in the code also asks for this.)

---

## Step 3: Create your admin user (only you)

1. In Supabase, go to **Authentication → Users**.
2. Click **Add user → Create new user**.
3. Email: `victoradoji4@gmail.com`. Pick a strong password and save it in your password manager.
4. Tick **Auto Confirm User**, then click **Create user**.

## Step 4: Turn off public sign-ups

1. In Supabase, go to **Authentication → Sign In / Providers** (on some dashboards it's called **Auth settings**).
2. Turn **OFF** "Allow new users to sign up". Save.

Now nobody else can even create an account. The code also blocks every email except `ADMIN_EMAIL`, and the database blocks them too.

---

## Step 5: Set up the database (Phase 2)

You'll do this in Phase 2. I'll tell you when:

1. In Supabase, open **SQL Editor** (left sidebar) → **New query**.
2. Open `supabase/schema.sql` from this project, copy **all** of it, paste, and click **Run**.
3. Do the same with `supabase/seed.sql` (this adds your starting content).

---

## Optional: run the site on your own computer

You need Node.js 20+ installed. In a terminal, inside the project folder:

```bash
npm install         # downloads the building blocks (only needed once)
cp .env.example .env.local   # makes your private settings file; open it and paste your values
npm run dev         # starts the site at http://localhost:3000
```

---

## Video file size limit

- The Supabase free plan allows files up to **50 MB** each.
- To go bigger: upgrade to Supabase **Pro**, go to **Storage → Settings**, and raise the "Upload file size limit".
  Then run this in the SQL Editor (example for 200 MB):
  ```sql
  update storage.buckets set file_size_limit = 209715200 where id = 'media';
  ```
