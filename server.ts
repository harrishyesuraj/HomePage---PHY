import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

const DATA_DIR = path.join(__dirname, 'data');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_NOTES = [
  {
    id: 'note-1',
    title: 'Daily Objectives',
    content: '- Review quarterly roadmap\n- Finish cloud deployment\n- Sync with team at 2 PM',
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 1800000,
    isPinned: true
  },
  {
    id: 'note-2',
    title: 'Code Snippets',
    content: '// Quick curl snippet\ncurl -X GET "https://api.github.com/zen"',
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 3600000,
    isPinned: false
  }
];

// If notes file doesn't exist, initialize with default notes
if (!fs.existsSync(NOTES_FILE)) {
  try {
    fs.writeFileSync(NOTES_FILE, JSON.stringify(DEFAULT_NOTES, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to initialize notes file:', err);
  }
}

// ==========================================
// BACKEND API ENDPOINTS
// ==========================================

// GET /api/notes - Load persistent notepad data from backend disk
app.get('/api/notes', (req, res) => {
  try {
    if (fs.existsSync(NOTES_FILE)) {
      const data = fs.readFileSync(NOTES_FILE, 'utf-8');
      const notes = JSON.parse(data);
      return res.json({ success: true, notes });
    }
    return res.json({ success: true, notes: DEFAULT_NOTES });
  } catch (err: any) {
    console.error('Error reading notes on backend:', err);
    return res.status(500).json({ success: false, error: 'Failed to read notes from backend' });
  }
});

// POST /api/notes - Save notepad data to backend disk
app.post('/api/notes', (req, res) => {
  try {
    const { notes } = req.body;
    if (!Array.isArray(notes)) {
      return res.status(400).json({ success: false, error: 'Expected an array of notes' });
    }
    fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2), 'utf-8');
    return res.json({ success: true, count: notes.length });
  } catch (err: any) {
    console.error('Error saving notes to backend:', err);
    return res.status(500).json({ success: false, error: 'Failed to save notes to backend' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// ==========================================
// VITE DEV MIDDLEWARE / STATIC ASSETS
// ==========================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.use('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
});
