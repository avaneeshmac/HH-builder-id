# HH Builder ID 

> Generate your official **HackerHouse Goa 2026** Builder ID card — tropical theme, share-ready, built for devs.

### [hhg-id-generator.onrender.com](https://hhg-id-generator.onrender.com/)

---

## What is this?

A single-page web app that lets HackerHouse Goa 2026 attendees generate a personalized **Builder ID card** — think conference badge meets social card. Upload your photo, fill in your details, download or share on X.

**Live card features:**
Photo upload (JPG, PNG, WEBP, HEIC) or live webcam capture
- Zoom + drag to reposition your photo inside the frame
- Auto-generated builder title (randomised from a curated list)
- Double pink pill badges — your title + fun fact
- One-click PNG download
- Share to X with a proper OG image preview (via Cloudinary)

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Card rendering | HTML Canvas API (programmatic, 1080×1350px) |
| Fonts | Playfair Display, Space Mono, Outfit (Google Fonts) |
| Backend | Express.js (TypeScript) |
| Image hosting | Cloudinary (optional, for share links) |
| HEIC support | `heic2any` (dynamic import) |

---

## Getting Started

### 1. Clone

```bash
git clone https://github.com/avaneeshmac/HH-builder-id.git
cd HH-builder-id
npm install
```

### 2. Environment Variables

Copy the example env file and fill in your Cloudinary credentials (optional — only needed for X share link previews):

```bash
cp .env.example .env
```

```env
# .env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

> **Skip this if you just want local use.** Download still works without Cloudinary. Sharing on X will open a text-only tweet.

### 3. Run locally

Open **two terminals**:

```bash
# Terminal 1 — Vite frontend (http://localhost:5173)
npm run dev

# Terminal 2 — Express server for share links (http://localhost:3000)
npm run server:dev
```

---

## Share Flow

```
📱 Mobile  →  Web Share API  →  Native share sheet  →  image attached directly to X post
💻 Desktop →  Upload to Cloudinary  →  Open X with share URL  →  OG card preview shows your generated ID
```

The `/share/:id` route on the Express server serves proper Open Graph + Twitter Card meta tags so the link unfurls as a large image card on X, WhatsApp, Slack, etc.

---

## Project Structure

```
├── src/
│   ├── App.tsx                  # Root — state, share logic, step navigation
│   ├── components/
│   │   ├── LandingSection.tsx   # Photo upload + webcam capture
│   │   ├── DetailsForm.tsx      # Name, role, fun fact, builder title
│   │   └── BuilderIDCard.tsx    # Live canvas preview + zoom/pan controls
│   └── utils/
│       ├── canvasGenerator.ts   # Full 1080×1350 canvas drawing engine
│       ├── builderTitles.ts     # Randomised builder title list
│       └── imageHelpers.ts      # HEIC conversion + image loading
├── server/
│   └── index.ts                 # Express — OG share page + static serving
├── index.html
├── vite.config.ts
└── tailwind.config.js
```

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run server:dev` | Start Express dev server with hot reload (port 3000) |
| `npm run build` | Build client + server for production |
| `npm start` | Start production server |

---

## Cloudinary Setup (for share links)

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to **Settings → Upload → Upload presets**
3. Create an **unsigned** upload preset
4. Copy your **Cloud name** and **Preset name** into `.env`

---

## Contributing

This is a hackathon project for HackerHouse Goa 2026. PRs welcome — especially for:
- New builder title suggestions (`src/utils/builderTitles.ts`)
- Additional tropical vector art in the canvas
- More theme options

---

## License

MIT — hack freely.

---


