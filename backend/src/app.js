import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './config/environment.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import messageRoutes from './routes/messages.js';
import attendanceRoutes from './routes/attendance.js';
import pollRoutes from './routes/polls.js';
import quizRoutes from './routes/quizzes.js';
import aiRoutes from './routes/ai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: true, // Reflect request origin, effectively allowing any origin that sends credentials
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Server Diagnostic
app.get('/test-server', (req, res) => {
  res.status(200).send('Backend is Alive and Reaching app.js!');
});

// Serve Frontend (Universal Catch-all)
const rootPath = path.resolve(__dirname, '../../../');
console.log(`[INFO] Root Path discovered as: ${rootPath}`);
try {
  const rootFiles = fs.readdirSync(rootPath);
  console.log(`[INFO] Root directory contents: ${rootFiles.join(', ')}`);
  if (rootFiles.includes('frontend')) {
    const frontendFiles = fs.readdirSync(path.join(rootPath, 'frontend'));
    console.log(`[INFO] Frontend directory contents: ${frontendFiles.join(', ')}`);
    if (frontendFiles.includes('dist')) {
      const distFiles = fs.readdirSync(path.join(rootPath, 'frontend/dist'));
      console.log(`[INFO] Dist directory contents: ${distFiles.join(', ')}`);
    }
  }
} catch (e) {
  console.log('[ERROR] Failed to list directories:', e.message);
}

const possibleDistPaths = [
  path.join(rootPath, 'frontend/dist'),
  path.join(__dirname, '../../frontend/dist'),
  path.join(process.cwd(), '../frontend/dist'),
  path.resolve('frontend/dist')
];

let distPath = possibleDistPaths[0];
for (const p of possibleDistPaths) {
  try {
    if (fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html'))) {
      distPath = p;
      console.log(`[INFO] FOUND frontend at: ${distPath}`);
      break;
    }
  } catch (err) {}
}

console.log(`[INFO] Final choice for frontend serving: ${distPath}`);

// Serve static files
app.use(express.static(distPath));

// Handle React routing
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }

  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.log('[ERROR] Failed to send index.html from:', indexPath);
      res.status(404).send(`Frontend not found at ${indexPath}. Please verify build.`);
    }
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
