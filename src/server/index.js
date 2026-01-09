import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Serve static files from the dist directory (Vite build output)
const distPath = join(__dirname, '../../dist');
app.use(express.static(distPath));

// Serve the main HTML file for all routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📦 Serving files from: ${distPath}`);
  console.log(`🌍 Environment: ${isProduction ? 'Production' : 'Development'}`);
  console.log(`\n💡 For development, use: npm run dev`);
  console.log(`💡 For production, use: npm start\n`);
});
