-- =====================================================================
-- nimi portfolio — starting content (your current site, moved into the database)
-- WHERE TO PASTE: Supabase -> SQL Editor -> New query -> paste all -> Run
-- Run it AFTER schema.sql. Safe to run more than once (it never overwrites your edits).
-- =====================================================================

-- Built-in sections (they can be hidden, never deleted)
insert into public.sections (slug, label, title, layout_type, variant, sort_order, is_builtin, show_in_nav) values
  ('hero',       'hero',           '',                           'hero',         null,     0,  true, false),
  ('about',      'about',          'hi, i''m nimi.',             'about',        null,     1,  true, true),
  ('focus',      'areas of focus', 'what i do.',                 'numbered',     null,     2,  true, true),
  ('highlights', 'highlights',     '',                           'stats',        null,     3,  true, false),
  ('featured',   'featured work',  'work i''m proud of.',        'cards',        null,     4,  true, true),
  ('ai',         'ai',             'making ai make sense.',      'cards',        null,     5,  true, true),
  ('tech',       'tech',           'tech, explained and built.', 'cards',        null,     6,  true, true),
  ('crypto',     'crypto',         'crypto without the noise.',  'cards',        null,     7,  true, true),
  ('viral',      'viral',          'posts that travelled far.',  'cards',        null,     8,  true, false),
  ('threads',    'threads',        'best threads.',              'links',        null,     9,  true, false),
  ('videos',     'videos',         'best videos.',               'circle-video', 'circle', 10, true, true),
  ('graphics',   'graphics',       'illustrations i''ve made.',  'circle-image', 'circle', 11, true, true),
  ('projects',   'clients',        'projects i''ve worked with.', 'logos',       null,     12, true, true),
  ('experience', 'experience',     'where i''ve been building.', 'timeline',     null,     13, true, false),
  ('shipped',    'shipped',        'projects i''ve shipped.',    'cards',        null,     14, true, false),
  ('content',    'content',        'posts that connect.',        'links',        null,     15, true, false),
  ('currently',  'currently',      '',                           'bullets',      null,     16, true, false),
  ('contact',    'connect',        'let''s talk.',               'contact',      null,     17, true, true)
on conflict (slug) do update
  -- only fills in a missing label / style; never overwrites your own edits
  set label   = coalesce(public.sections.label, excluded.label),
      variant = coalesce(public.sections.variant, excluded.variant);

-- Site settings
insert into public.settings (key, value) values
  ('name',            to_jsonb('nimi'::text)),
  ('hero_title',      to_jsonb('nimi'::text)),
  ('tagline',         to_jsonb('ai, tech & crypto'::text)),
  ('pitch',           to_jsonb('I write about and build with **AI**, **tech** and **crypto**. Clear takes for people who want to keep up, and working products for teams who want to ship.'::text)),
  ('hero_primary_label',   to_jsonb('work with me'::text)),
  ('hero_secondary_label', to_jsonb('see work'::text)),
  ('hero_image_path', to_jsonb(''::text)),
  ('floating_avatar', to_jsonb('on'::text)),
  ('bio',             to_jsonb(E'I''m nimi — a **builder and writer** living deep in **AI, tech and crypto**. I test the tools, write about what matters, and use AI-assisted development to ship real software at a speed traditional timelines can''t match.\n\nEvery business has something it needs built. My job: understand it, build it fast, and put a working live version in your hands — not mockups, not promises.\n\nLanding pages, booking systems, portfolios, product demos, threads that explain the hard stuff. You talk directly to the person doing the work — zero layers, zero fluff.'::text)),
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

-- Currently (only added if it is still empty)
insert into public.items (section_id, title, extra, sort_order)
select s.id, v.title, v.extra::jsonb, v.sort_order
from public.sections s
cross join (values
  ('writing about ai, tech & crypto', '{}', 0),
  ('building websites & product demos with ai', '{}', 1),
  ('exploring web3 and onchain culture', '{}', 2),
  ('open to collaborations', '{"highlight":"on"}', 3)
) as v(title, extra, sort_order)
where s.slug = 'currently'
  and not exists (select 1 from public.items i where i.section_id = s.id);
