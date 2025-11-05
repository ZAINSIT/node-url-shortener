const express = require('express');
const app = express();
const port = 3000;

// In-memory store for URLs (replace with DB in future)
const urlDatabase = {};

// Helper to generate a short random id
function generateShortId() {
  return Math.random().toString(36).substr(2, 6);
}

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to shorten URLs
app.post('/shorten', (req, res) => {
  const originalUrl = req.body.url;
  if (!originalUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }
  const shortId = generateShortId();
  urlDatabase[shortId] = originalUrl;
  res.json({ shortUrl: `http://localhost:${port}/${shortId}` });
});

// Redirect short URL to original URL
app.get('/:shortId', (req, res) => {
  const shortId = req.params.shortId;
  const originalUrl = urlDatabase[shortId];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

app.listen(port, () => {
  console.log(`URL shortener listening at http://localhost:${port}`);
});
