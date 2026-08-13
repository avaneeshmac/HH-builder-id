import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';

// Serve Open Graph page for shared IDs
app.get('/share/:id', (req, res) => {
  const id = req.params.id;
  // Reconstruct Cloudinary image URL from public ID
  const imageUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${id}`;
  const shareUrl = `${req.protocol}://${req.get('host')}/share/${id}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO & Open Graph Tags for Social Previews -->
  <title>HH Goa 2026 Builder ID</title>
  <meta name="description" content="HH Goa 2026 Builder ID.">
  
  <!-- Facebook / Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${shareUrl}">
  <meta property="og:title" content="HH Goa 2026 Builder ID">
  <meta property="og:description" content="HH Goa 2026 Builder ID.">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1080">
  <meta property="og:image:height" content="1350">
  
  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${shareUrl}">
  <meta name="twitter:title" content="HH Goa 2026 Builder ID">
  <meta name="twitter:description" content="HH Goa 2026 Builder ID.">
  <meta name="twitter:image" content="${imageUrl}">

  <style>
    body {
      background-color: #0B0F17;
      color: #F8FAFC;
      font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      box-sizing: border-box;
    }
    .container {
      max-width: 500px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .card-preview {
      width: 100%;
      max-width: 320px;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(16, 185, 129, 0.2);
      margin-bottom: 24px;
      transition: transform 0.3s ease;
    }
    .card-preview:hover {
      transform: scale(1.02);
    }
    h1 {
      font-size: 28px;
      margin: 0 0 12px 0;
      font-weight: 700;
      background: linear-gradient(135deg, #10B981 0%, #3B82F6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      font-size: 16px;
      color: #94A3B8;
      margin: 0 0 24px 0;
      line-height: 1.5;
    }
    .btn {
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      color: white;
      text-decoration: none;
      padding: 14px 28px;
      font-weight: 600;
      border-radius: 9999px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      transition: all 0.2s ease;
      font-size: 16px;
      display: inline-block;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }
    .redirect-msg {
      margin-top: 16px;
      font-size: 12px;
      color: #64748B;
    }
  </style>
  <script>
    // Client-side redirection to frontend app with share parameter
    setTimeout(function() {
      window.location.href = "/?shared=" + encodeURIComponent("${id}");
    }, 1200);
  </script>
</head>
<body>
  <div class="container">
    <img src="${imageUrl}" alt="HH Goa 2026 Builder ID" class="card-preview" />
    <h1>HH Goa 2026 Builder ID</h1>
    <p>HH Goa 2026 Builder ID.</p>
    <a href="/?shared=${encodeURIComponent(id)}" class="btn">Make your ID</a>
    <div class="redirect-msg">Redirecting...</div>
  </div>
</body>
</html>`;

  res.send(html);
});

// Serve frontend assets in production
const clientBuildPath = path.resolve(__dirname, '../client');
app.use(express.static(clientBuildPath));

// Fallback to React app router
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
