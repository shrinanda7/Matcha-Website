const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// static assets (serve public/assets from repo root)
app.use('/assets', express.static(path.join(__dirname, '..', 'public', 'assets')));

// helper: read JSON file
const dataDir = path.join(__dirname, 'data');
async function readJson(name) {
  try {
    const txt = await fs.readFile(path.join(dataDir, name), 'utf8');
    return JSON.parse(txt);
  } catch (e) {
    return [];
  }
}
async function writeJson(name, data) {
  await fs.writeFile(path.join(dataDir, name), JSON.stringify(data, null, 2));
}

// API endpoints
app.get('/api/menu', async (req, res) => {
  const menu = await readJson('menu.json');
  res.json(menu);
});

app.get('/api/blogs', async (req, res) => {
  const blogs = await readJson('blogs.json');
  res.json(blogs);
});

app.post('/api/subscribe', async (req, res) => {
  const { email, name } = req.body || {};
  if (!email) return res.status(400).json({ success: false, error: 'Email required' });

  const file = 'subscribers.json';
  const subs = await readJson(file);
  subs.push({ email, name: name || null, date: new Date().toISOString() });
  await writeJson(file, subs);

  // Optionally: send confirmation email here (nodemailer / SendGrid)
  res.json({ success: true });
});

// Serve frontend production build if present (optional)
const distPath = path.join(__dirname, '..', 'dist'); // adapt if your build output is `dist` or `src`
if (fs) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
