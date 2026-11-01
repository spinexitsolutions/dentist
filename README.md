# Ivory Dental Studio — website + Studio OS

A premium, animation-rich dental clinic website built with **Next.js 16**, **Tailwind CSS v4**, **Framer Motion** and **Lenis**, plus a complete **admin panel (CRM + CMS)** that controls the entire site.

## Quick start

```bash
npm install
npm run dev
```

- Website → http://localhost:3000
- Admin → http://localhost:3000/admin
  - email: `admin@ivory.studio`
  - password: `ivory2026`

## Website highlights

| Area | What it does |
| --- | --- |
| **Intro animation** | Tooth outline draws itself, letters rise, counter 000→100, panel lifts with a curved edge. 3 styles (smile / curtain / minimal), text, duration and once-per-visit are all set from the admin. |
| **Dynamic-island navbar** | Floating dark pill with a scroll-progress ring and a live **Open now / Closed** status from your opening hours. It shrinks while you scroll down and expands on scroll up. It morphs into a full menu with image previews. On mobile it sits at the **bottom** within thumb reach and expands upward as a sheet. |
| **Hero** | Masked word-by-word headline, arch-shaped image reveal, floating glass chips, rotating “Free 3D scan” badge, magnetic CTA. |
| **Scroll effects** | Apple-style text that lights up word-by-word, a clinic image that expands to full-bleed, pinned horizontal treatment carousel (desktop) with snap carousel on touch, stacking “Your visit” cards, parallax, counters, footer wordmark rise. |
| **Smile gallery** | Drag-to-compare before / after slider (mouse, touch & keyboard). |
| **Booking wizard** | Treatment → specialist → date & time (live slot availability) → details → animated confirmation with *Add to Google Calendar*. Creates the appointment **and** the patient in the CRM. |
| **Everything else** | Doctors, technology bento with tilt, testimonial marquees, membership plans, insurance partners, FAQ, journal/blog, contact form, map, opening hours, emergency line, WhatsApp button, newsletter, SEO metadata, page-transition curtain. |

Pages: `/`, `/services`, `/services/[slug]`, `/team`, `/gallery`, `/blog`, `/blog/[slug]`, `/book`, `/contact`.

## Admin panel (Studio OS)

**CRM**
- **Dashboard**: today’s appointments, pending confirmations, leads, patients, a volume chart, status donut, top treatments, upcoming list with one-click confirm.
- **Appointments**: list or drag-and-drop **Kanban board**, filters, search, create / edit / delete.
- **Patients**: cards with visits, last and next visit, tags, notes, a visit-history timeline, and call / WhatsApp / email shortcuts.
- **Leads & inbox**: website enquiries in a drag-and-drop pipeline (new → contacted → qualified → won / lost). You can convert a lead into a patient.
- **Subscribers**: newsletter list with CSV export.

**CMS**
- **Site settings**:
  - Brand & colour theme (6 presets or your own colours)
  - Intro animation, with a live preview
  - Hero, announcement banner and philosophy statement
  - About section and booking CTA
  - Contact details and opening hours
  - Booking slots and closed days
  - Insurance partners
  - SEO and social links
  - Reset demo data
- **Homepage layout**: drag to reorder sections, and switch any section on or off.
- **Content collections**: treatments, doctors, smile gallery, testimonials, journal posts, FAQ, plans, numbers, technology and visit steps. Each one supports add, edit, duplicate, delete and drag-to-reorder. Images can be a URL (Unsplash, Figma export…) or an upload.

## Data & deployment

Data lives in a JSON file at `data/db.json`, created and seeded automatically on first run. Uploads go to `data/uploads/`. Both are git-ignored. Set `DATA_DIR` to store them somewhere else.

For production, set these environment variables:

```
ADMIN_EMAIL=you@clinic.com
ADMIN_PASSWORD=a-strong-password
ADMIN_SECRET=a-long-random-string
```

Deploy to any host with a persistent disk, such as a VPS, Railway, Render or Fly. On read-only/serverless hosts like Vercel the app still runs, but changes are only kept in memory. For those hosts, replace `src/lib/db.ts` with a database such as Postgres, Supabase or MongoDB. The rest of the app only talks to that file.

## Structure

```
src/
  app/(site)/          public website pages
  app/admin/           login + admin panel
  app/api/             public (book, contact, newsletter) + admin APIs
  components/site/     intro, navbar, sections, booking wizard
  components/admin/    admin shell, UI kit, CRM screens, CMS editors
  lib/                 types, seed content, JSON store, auth
```
