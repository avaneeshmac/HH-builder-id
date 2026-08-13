import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';

// ─────────────────────────────────────────────────────────
// /share/:id — Serves a full OG-tagged HTML page so that
// Twitter/X, WhatsApp, Slack etc. crawl the generated image
// as the link preview card.
//
// Cloudinary public_id may include slashes (hh_goa_2026/abc)
// so we use :id(*) to capture the full path segment.
//
// Query params:
//   ?name=Avaneesh&title=Ship-It%20Architect
// ─────────────────────────────────────────────────────────
app.get('/share/:id(*)', (req, res) => {
  const id = req.params.id;
  const personName = (req.query.name as string) || 'A Builder';
  const personTitle = (req.query.title as string) || 'HH Goa 2026';

  const imageUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${id}`;
  const shareUrl = `${req.protocol}://${req.get('host')}/share/${id}?name=${encodeURIComponent(personName)}&title=${encodeURIComponent(personTitle)}`;

  const ogTitle = `${personName} — HH Goa 2026 Builder ID`;
  const ogDescription = `${personName} is heading to HH Goa 2026 as: ${personTitle} 🌴 #FrameInGoa`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${ogTitle}</title>
  <meta name="description" content="${ogDescription}">

  <!-- Open Graph (Facebook, WhatsApp, LinkedIn, Slack) -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${shareUrl}">
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${ogDescription}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:secure_url" content="${imageUrl}">
  <meta property="og:image:width" content="1080">
  <meta property="og:image:height" content="1350">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:alt" content="${ogTitle}">

  <!-- Twitter / X — summary_large_image renders the full card graphic -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@hackerhouseapp">
  <meta name="twitter:url" content="${shareUrl}">
  <meta name="twitter:title" content="${ogTitle}">
  <meta name="twitter:description" content="${ogDescription}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta name="twitter:image:alt" content="${ogTitle}">

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #014F33;
      color: #F8FAFC;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 24px;
    }
    .card-preview {
      width: 100%;
      max-width: 280px;
      border-radius: 16px;
      border: 6px solid #FCD34D;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      margin-bottom: 24px;
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      color: #FCD34D;
      margin-bottom: 6px;
    }
    p {
      font-size: 14px;
      color: rgba(255,255,255,0.65);
      margin-bottom: 24px;
    }
    .btn {
      background: #FCD34D;
      color: #014F33;
      text-decoration: none;
      padding: 14px 32px;
      font-weight: 800;
      border-radius: 9999px;
      font-size: 16px;
      display: inline-block;
    }
    .tag {
      margin-top: 16px;
      font-size: 12px;
      color: rgba(252,211,77,0.5);
      font-family: monospace;
    }
  </style>
  <script>
    // After bots have crawled the OG tags, redirect real users into the React app
    setTimeout(function() {
      window.location.href = "/?shared=" + encodeURIComponent("${id}");
    }, 1500);
  </script>
</head>
<body>
  <img src="${imageUrl}" alt="${ogTitle}" class="card-preview" />
  <h1>${personName}</h1>
  <p>${personTitle}</p>
  <a href="/?shared=${encodeURIComponent(id)}" class="btn">Make your Builder ID</a>
  <div class="tag">#FrameInGoa &nbsp;·&nbsp; Redirecting…</div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Serve frontend assets in production
const clientBuildPath = path.resolve(__dirname, '../client');
app.use(express.static(clientBuildPath));

// Fallback to React app router
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
