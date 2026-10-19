-- =====================================================================
-- nimi portfolio — starting content (your current site, moved into the database)
-- WHERE TO PASTE: Supabase -> SQL Editor -> New query -> paste all -> Run
-- Run it AFTER schema.sql. Safe to run more than once (it never overwrites your edits).
-- =====================================================================

-- Built-in sections (they can be hidden, never deleted)
insert into public.sections (slug, title, subtitle, layout_type, sort_order, is_builtin, show_in_nav) values
  ('hero',       'hero',                      null,                         'hero',         0,  true, false),
  ('about',      'about',                     null,                         'about',        1,  true, true),
  ('focus',      'focus',                     'what I cover',               'numbered',     2,  true, true),
  ('highlights', 'highlights',                null,                         'stats',        3,  true, false),
  ('featured',   'featured work',             null,                         'cards',        4,  true, true),
  ('viral',      'viral work',                'posts that travelled far',   'cards',        5,  true, false),
  ('threads',    'best threads',              null,                         'links',        6,  true, false),
  ('videos',     'best videos',               null,                         'circle-video', 7,  true, true),
  ('graphics',   'graphics & illustrations',  null,                         'circle-image', 8,  true, true),
  ('projects',   'projects I''ve worked with', null,                        'logos',        9,  true, true),
  ('experience', 'experience',                null,                         'timeline',     10, true, false),
  ('shipped',    'projects I''ve shipped',    null,                         'cards',        11, true, false),
  ('content',    'content',                   'posts that connect',         'links',        12, true, false),
  ('contact',    'let''s talk.',              'have a project? reach out.', 'contact',      13, true, true)
on conflict (slug) do nothing;

-- Site settings
insert into public.settings (key, value) values
  ('name',            to_jsonb('nimi'::text)),
  ('tagline',         to_jsonb('ai, tech & crypto'::text)),
  ('pitch',           to_jsonb('I write about and build with AI, tech and crypto. Clear takes for people who want to keep up, and working products for teams who want to ship.'::text)),
  ('bio',             to_jsonb(E'I''m nimi — a builder and writer living deep in AI, tech and crypto. I test the tools, write about what matters, and use AI-assisted development to ship real software at a speed traditional timelines can''t match.\n\nEvery business has something it needs built. My job: understand it, build it fast, and put a working live version in your hands — not mockups, not promises.\n\nLanding pages, booking systems, portfolios, product demos, threads that explain the hard stuff. You talk directly to the person doing the work — zero layers, zero fluff.'::text)),
  ('photo_path',      to_jsonb('/pfp.webp'::text)),
  ('accent',          to_jsonb('#F2B544'::text)),
  ('email',           to_jsonb('victoradoji4@gmail.com'::text)),
  ('x_url',           to_jsonb('https://x.com/nimi_101'::text)),
  ('telegram_url',    to_jsonb('https://t.me/nimi_101'::text)),
  ('seo_title',       to_jsonb('nimi — ai, tech & crypto'::text)),
  ('seo_description', to_jsonb('Nimi writes about and builds with AI, tech and crypto. Threads, videos, graphics and shipped work.'::text)),
  ('footer_note',     to_jsonb('AI-assisted. Shipped live.'::text))
on conflict (key) do nothing;

-- Focus: 01 AI, 02 Tech, 03 Crypto (only added if Focus is still empty)
insert into public.items (section_id, title, description, extra, sort_order)
select s.id, v.title, v.description, v.extra::jsonb, v.sort_order
from public.sections s
cross join (values
  ('Artificial Intelligence', 'AI tools, agents and AI-assisted building — tested hands-on and explained simply.', '{"tags":"Claude / Claude Code, AI-assisted development, Agents"}', 0),
  ('Tech', 'Websites, booking systems, product demos and the tools behind them.', '{"tags":"Business websites, Landing pages, Booking systems, Portfolios, Product demos, E-commerce pages, Supabase"}', 1),
  ('Crypto', 'Web3, onchain culture and the builders shipping it.', '{"tags":"Web3 UI, Hackathons, Builder communities"}', 2)
) as v(title, description, extra, sort_order)
where s.slug = 'focus'
  and not exists (select 1 from public.items i where i.section_id = s.id);

-- Experience (only added if Experience is still empty)
insert into public.items (section_id, title, description, extra, sort_order)
select s.id, v.title, v.description, v.extra::jsonb, v.sort_order
from public.sections s
cross join (values
  ('Independent Builder', 'Learning and shipping in public — websites, landing pages, and product demos built with AI-assisted workflows, each one deployed live with a public link.', '{"date":"2026 — Present","role":"AI-assisted development · building in public"}', 0),
  ('OKX Hackathon', 'Built and shipped under deadline pressure alongside a community of web3 builders and founders.', '{"date":"2025","role":"Participant · Web3 builder community"}', 1)
) as v(title, description, extra, sort_order)
where s.slug = 'experience'
  and not exists (select 1 from public.items i where i.section_id = s.id);
