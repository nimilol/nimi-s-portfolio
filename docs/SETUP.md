# Setup guide (beginner friendly)

Your new portfolio is built and live. It already shows your current content.
To unlock the **admin panel** (`/admin`), do these steps **once**, in order.
You only click things in websites. No code needed.

---

## What is what?

- **Next.js**: the framework your site is built with now (it replaced the old `index.html`).
- **Supabase**: your free online database. It stores your text, images and videos, and handles the admin login.
- **Vercel**: hosts your site. When code lands on the `main` branch on GitHub, Vercel updates the live site by itself.
- **Environment variables**: settings like your Supabase address, kept outside the code. You add them once in Vercel.

Until you finish these steps, the site shows the built-in copy of your content, and `/admin` explains what's missing.

---

## Step 1: Create the database tables (Supabase)

1. Open <https://supabase.com/dashboard> and click your project.
2. In the left sidebar, click **SQL Editor**, then **New query**.
3. Open [`supabase/schema.sql`](../supabase/schema.sql) on GitHub, copy **all** of it, paste it into the editor and click **Run**.
   You should see "Success. No rows returned".
4. Click **New query** again. Do the same with [`supabase/seed.sql`](../supabase/seed.sql). This adds your starting content.

Both files are safe to run again later. They never overwrite your edits.

## Step 2: Create your admin user (only you)

1. In Supabase, go to **Authentication → Users**.
2. Click **Add user → Create new user**.
3. Email: `victoradoji4@gmail.com`. Pick a strong password and save it in your password manager.
4. Tick **Auto Confirm User**, then click **Create user**.

## Step 3: Turn off public sign-ups

1. In Supabase, go to **Authentication → Sign In / Providers** (on some dashboards it's called **Auth settings**).
2. Turn **OFF** "Allow new users to sign up". Save.

Now nobody else can even create an account. The code also blocks every email except yours, and the database blocks them too.

## Step 4: Copy your 2 Supabase values

1. Click the **Connect** button at the top of your Supabase project page.
2. Pick the **App Frameworks** tab, then **Next.js**.
3. Copy the two values:
   - the URL, like `https://abcdefgh.supabase.co`
   - the **publishable** key (`sb_publishable_...`). Older projects show an **anon** key (`eyJ...`); either one works.

> The publishable / anon key is safe to be public.
> **Never** copy the **secret** or **service_role** key anywhere. This site doesn't need it.

## Step 5: Add the 3 environment variables in Vercel

1. Open <https://vercel.com> and click your portfolio project.
2. Go to **Settings → Environment Variables**.
3. Add these 3, one at a time. For each one, tick **Production**, **Preview** and **Development**:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | the URL from Step 4 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the publishable (or anon) key from Step 4 |
| `ADMIN_EMAIL` | `victoradoji4@gmail.com` |

> Use the name `NEXT_PUBLIC_SUPABASE_ANON_KEY` exactly as written, even when your key is a "publishable" key.

4. In **Settings → Build and Deployment**, check that **Framework Preset** says **Next.js**. If it says "Other", change it to Next.js and save.

## Step 6: Redeploy (so Vercel picks up the new settings)

1. In Vercel, open **Deployments**.
2. Click the **⋯** menu on the top (latest) deployment → **Redeploy** → **Redeploy**.
3. Wait about 1 minute until it says **Ready**.

---

## Step 7: Log in and test

Go to **https://nimi-portfolio.vercel.app/admin** and log in with your email and password from Step 2.

Final checklist:

- [ ] On the live site, empty sections (videos, graphics, viral work…) are not shown. In admin they show "0 items — hidden on site".
- [ ] Add one link in **best threads**, reload the live site: the section appears.
- [ ] Upload an image in **graphics & illustrations** from your phone and from your laptop. There are no URL fields.
- [ ] Upload a short MP4 in **best videos** (max 50 MB). A thumbnail is made by itself.
- [ ] Open the site in a private window and go to `/admin`: you're sent to the login page.
- [ ] Click **+ Add new section**, then add one item: it appears in admin and on the site.
- [ ] Add numbers in **highlights**: they count up once when you scroll to them.
- [ ] Graphics (image circle) and best videos (video circle) are two separate sections.
- [ ] The site looks good on your phone.

---

## How to use the admin panel

- **Dashboard:** every section, with item count and "visible" or "hidden". Drag ⋮⋮ to change the order of the page.
- **A section:** add, edit or delete items, and drag ⋮⋮ to reorder them. You can rename the section, hide it, or choose whether it shows in the top bar.
- **Site settings:** name, pitch, bio, profile photo, accent color, contact links, SEO and which sections appear in the top bar.
- **Hero, About and Contact** get their content from Site settings.
- **Built-in sections** can only be hidden. **Your custom sections** can also be deleted.
- After you save, **reload the live site** to see the change. No redeploy is needed.

## Video file size limit

- The Supabase free plan allows files up to **50 MB** each.
- To go bigger: upgrade to Supabase **Pro**, go to **Storage → Settings**, and raise the "Upload file size limit".
  Then run this in the SQL Editor (example for 200 MB):
  ```sql
  update storage.buckets set file_size_limit = 209715200 where id = 'media';
  ```
  Also change `MAX_VIDEO_MB` in `lib/upload.ts` to the same number (or ask Claude to do it).

## Changing the admin email later

Change it in **two** places: `ADMIN_EMAIL` in Vercel, and the email inside the `is_admin()` function at the top of
`supabase/schema.sql` (edit it, then run the file again in the SQL Editor).

## Optional: run the site on your own computer

You need Node.js 20+ installed. In a terminal, inside the project folder:

```bash
npm install                  # downloads the building blocks (only needed once)
cp .env.example .env.local   # makes your private settings file; open it and paste your values
npm run dev                  # starts the site at http://localhost:3000
```
