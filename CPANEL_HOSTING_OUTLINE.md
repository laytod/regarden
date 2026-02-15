# ReGarden: cPanel Hosting Outline

This document outlines what needs to change to host the ReGarden site on **GoDaddy cPanel**, how the options differ, and **how to test locally** before deploying.

---

## 1. Current Architecture (Why It Doesn’t Fit Basic cPanel)

Your site is built as a **full Next.js app** with:

| Piece | What it does | cPanel limitation |
|-------|----------------|-------------------|
| **Next.js server** | Serves pages, runs API routes, middleware | Basic cPanel is **static only** (HTML/CSS/JS in `public_html`). No Node process. |
| **API routes** | `/api/events`, `/api/auth/*`, `/api/admin/content`, `/api/admin/images` | Need a **Node.js runtime**. Not available in static hosting. |
| **File-based data** | `data/content.json`, `data/users.json`, `data/events.json`, `public/images` (writable) | Read/write only works when a **Node server** is running. |
| **NextAuth + middleware** | Admin login, session, route protection | Requires a server. |
| **Server components** | Pages call `getContent()` (reads `data/content.json`) | Run at **build time** if we switch to static export; otherwise need Node. |

So:

- **Plain cPanel “website” (public_html only):** No Node, no APIs, no server-side auth. You must **simplify to a static site** and drop or replace anything that depends on a server.
- **cPanel “Node.js application” (if your GoDaddy plan has it):** You can keep the current app and run `npm run build && npm start`, with some path and env checks.

---

## 2. Two Directions

### Option A: Static site for cPanel (simplest, works on any plan)

**Goal:** A site that can be uploaded to `public_html` and served as plain HTML/CSS/JS. No Node on the server.

**Idea:**

- Use Next.js **static export** (`output: 'export'`). Build produces a folder (e.g. `out/`) you upload to cPanel.
- **Content:** Keep using `data/content.json` and `getContent()` in Server Components. During `next build`, those run once and content is baked into the HTML. No runtime server needed.
- **Events:** Today the events page fetches `/api/events`. For static hosting you must either:
  - **Bake events at build time** (read `data/events.json` during build and pass into the page), or
  - **Load from somewhere else** (e.g. public JSON URL, Google Calendar, CMS).
- **Admin panel:** No admin on the same static site. You either:
  - Edit `data/content.json` and `data/events.json` locally, then rebuild and re-upload, or
  - Run a small admin app elsewhere (e.g. another host with Node), or
  - Use an external CMS and point the static site at it.
- **Auth:** No NextAuth, no middleware. Admin is “off” the static site.
- **Forms (newsletter, donate, volunteer):** They don’t call your API today. For real use you’d point them to:
  - A form service (Formspree, Netlify Forms, etc.), or
  - A small PHP/script endpoint on cPanel if you add one.

**Summary of code/config changes (Option A):**

1. **next.config.js** – set `output: 'export'`.
2. **Remove or bypass API routes** – they are not included in a static export; ensure no page *depends* on them at runtime (events must come from build-time data or an external URL).
3. **Events page** – change to get events from build-time data (e.g. pass `events` as props from a parent that reads `data/events.json`) or from an external API/URL.
4. **Admin** – exclude from static build (e.g. don’t link from the static site, or move to a separate app).
5. **Middleware** – not used in static export; can remove or leave (no effect when serving static files).
6. **Environment** – no `AUTH_SECRET` etc. needed for the static site.

**How to test locally (Option A):**

```bash
# 1. Build static export (after the config/content/events changes above)
npm run build

# 2. Serve the exported folder like a real static host
npx serve out
# Or: python3 -m http.server 3000 --directory out

# 3. Open http://localhost:3000 and click through all public pages.
#    No /admin, no /api – just pages and assets.
```

Use the same `out/` folder (or its contents) as what you’d upload to cPanel’s `public_html`.

---

### Option B: Node.js on cPanel (if your plan supports it)

**Goal:** Keep the current Next.js app (APIs, admin, auth, file-based data) and run it on cPanel’s Node.js feature.

**Idea:**

- In cPanel, use **“Setup Node.js App”** (or equivalent). Point the app root to your project, set run command to `npm start` (after a one-time or CI `npm run build`).
- Ensure **environment variables** (e.g. `AUTH_SECRET`) are set in cPanel.
- Ensure **writable paths** for `data/` and `public/images` (or whatever paths you use). On cPanel, the app often runs from a specific directory; `process.cwd()` and relative paths should work if the app is started from the project root and the filesystem is writable.

**Summary of checks (Option B):**

1. Confirm GoDaddy/cPanel has **Node.js** and which version (e.g. Node 18+).
2. **Build:** Run `npm run build` (on your machine or via cPanel/CI) and deploy the built app (e.g. `.next` + `package.json` + `node_modules` or a deploy that runs `npm install --production` and `npm run build` on the server).
3. **Start command:** `npm start` (runs `next start`).
4. **Env:** Set `AUTH_SECRET` (and any other NextAuth/env vars) in the cPanel Node app settings.
5. **Paths:** Verify `data/` and `public/images` exist and are writable where the app runs (e.g. run a quick test that reads/writes a file).

**How to test locally (Option B):**

```bash
# Simulate production Node server
npm run build
npm start

# Open http://localhost:3000 – full site including /admin and /api.
# Same as what you’d get on cPanel Node.
```

---

## 3. Recommended path and next steps

- If you **must** use only static hosting (no Node) on cPanel → follow **Option A**: static export, events from build-time or external source, no admin on the same site, test with `npm run build` + `npx serve out`.
- If your plan has **Node.js** and you want to keep admin and live content/events → follow **Option B**: keep current app, add `output: 'export'` only if you later decide to ship a static version; otherwise leave config as-is and focus on deploy and path/env checks.

**Concrete next steps:**

1. **Confirm with GoDaddy** whether your plan has “Node.js” or “Application” support in cPanel. That decides A vs B.
2. **If Option A:** Implement the static-export and events changes above, then add a short “Build & test” section to the README (e.g. “Static build: `npm run build && npx serve out`”).
3. **If Option B:** Document the exact cPanel steps (where to set start command, env vars, and how you upload the built app), and test locally with `npm run build && npm start`.

If you tell me which option you want (A = static only, B = Node on cPanel), I can outline or implement the exact code edits (e.g. `next.config.js`, events page, and optional script to test the static export).

---

## 4. Static Path: Framework Choice (JSON/Markdown content, no admin)

We're going **static**, removing **/admin**, and editing content via **JSON or Markdown** only.

**Does it make sense to use a different framework?**

- **Stay with Next.js (recommended)**  
  - This is a **simplification**, not a rewrite: same React components, Tailwind, and page structure. We remove server/API/admin code and add static export + build-time data loading.  
  - Content can stay in **JSON** (current `data/content.json`) or we can add **Markdown** and read it at build time. Next.js handles both.  
  - Least work, same tooling, same deploy artifact (upload `out/` to cPanel).

- **Switch to Astro**  
  - Great for content-heavy static sites: Markdown/MDX are first-class, fast builds. You could keep some React components.  
  - Would mean a **real rewrite**: new routing, data loading, and project layout. Only worth it if you want to invest in that and prefer Astro’s content-centric model.

- **Switch to Eleventy or similar**  
  - Simpler, template-based static generators.  
  - **Full rewrite**, and you’d lose React (or bolt it on). Only worth it if you explicitly want to leave React.

**Conclusion:** For “static + edit JSON or Markdown, no admin,” **sticking with Next.js** is the most sensible choice. We keep the existing UI and only change how and where data is loaded (build time) and remove what can’t run on static hosting.
