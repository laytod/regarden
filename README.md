# ReGarden - Community Gardens Nonprofit Website

A static website for ReGarden, a nonprofit dedicated to community gardens. Built with Next.js (static export), TypeScript, and Tailwind CSS. Designed to be hosted on cPanel or any static hosting (e.g. upload the `out/` folder to `public_html`).

## Features

- **About Page** - Organization information, mission, vision, and values
- **Team Page** - Team member profiles (from `data/team.json`)
- **Event Calendar** - View-only calendar; events loaded from `data/events.json` at build time
- **Volunteer Page** - Volunteering info and application form
- **Donate Page** - Donation info and donation form
- **Newsletter Signup** - Newsletter form (demo; hook up to your service as needed)

## Editing Content

Content is driven by JSON and data files. Edit the files, then rebuild and re-upload.

- **`data/content.json`** - Homepage, About, Donate, Volunteer copy and images (hero, feature cards, mission, etc.)
- **`data/events.json`** - Event calendar entries (array of events with `id`, `title`, `date`, `startTime`, `endTime`, `location`, `description`, `type`, `contactPerson`, `contactEmail`)
- **`data/team.json`** - Team members (id, name, role, email, phone, bio, socialLinks)
- **`public/images/`** - Add or replace images; reference in content as `/images/...`

After editing, run `npm run build` and deploy the generated `out/` folder.

## Tech Stack

- **Next.js 14** - Static export (`output: 'export'`)
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Styling
- **FullCalendar** - Calendar (view-only)
- **React Hook Form** - Form validation

## Getting Started

### Prerequisites

- **Node.js 20.x** (required; see `engines` in package.json). Install with nvm (below) or from [nodejs.org](https://nodejs.org/).
- npm (included with Node)

#### Install Node with nvm

[nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) lets you install and switch Node versions per project.

1. **Install nvm** (if you don’t have it):

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   ```

   Then restart your terminal (or run `source ~/.bashrc` or `source ~/.zshrc`).

2. **Install Node 20** and use it in this project:

   ```bash
   cd /path/to/regarden
   nvm install    # installs the version in .nvmrc (20)
   nvm use        # switches to that version
   ```

   After that, `node -v` should show v20.x.x. Run `nvm use` whenever you open a new terminal in this project (or use a shell integration that auto-runs it).

### Install and develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build static site (for cPanel / static hosting)

```bash
npm run build
```

This produces the **`out/`** folder. Upload the contents of `out/` to your host’s web root (e.g. cPanel `public_html`).

### Test the static build locally

**Option 1: Node (quick)**  
After building, serve the export with a simple static server:

```bash
npm run serve
```

Then open [http://localhost:3000](http://localhost:3000).

**Option 2: nginx (test deployment locally)**  
Use nginx to serve the static export before uploading to GoDaddy. Same files, same behavior.

1. Build: `npm run build`
2. Run nginx (Docker, no install): `npm run serve:nginx`  
   Or: `docker run --rm -v "$(pwd)/out:/usr/share/nginx/html:ro" -p 8080:80 nginx:alpine`
3. Open [http://localhost:8080](http://localhost:8080). Stop with Ctrl+C.

With nginx installed locally: `nginx -p "$(pwd)" -c "$(pwd)/nginx.conf"` (then `nginx -s stop` to stop).

## Project Structure

```
regarden/
├── app/                    # Next.js App Router (static export)
│   ├── about/              # About page
│   ├── team/               # Team page
│   ├── events/             # Events page (events from data/events.json at build time)
│   ├── volunteer/          # Volunteer page
│   ├── donate/             # Donate page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/             # React components
├── data/                   # Content and data (edit these, then rebuild)
│   ├── content.json        # Site content (home, about, donate, volunteer)
│   ├── events.json         # Calendar events
│   └── team.json           # Team members
├── public/                 # Static assets (images, etc.)
└── out/                    # Generated static site (after npm run build)
```

## Forms

Newsletter, volunteer, and donation forms use client-side validation. In production, wire them to your chosen services (e.g. Formspree, email backend, payment processor).

## License

This project is a demo website for ReGarden nonprofit organization.
