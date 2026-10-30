import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createBackend } from './backend/src/app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '20mb' }));
app.use(express.urlencoded({ extended: false, limit: '2mb' }));
app.use(cookieParser());
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false }));
app.use('/api', createBackend());

const dist = path.join(__dirname, 'dist');
app.use(express.static(dist, { index: false, maxAge: '1h' }));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API route not found.' });
  res.sendFile(path.join(dist, 'index.html'), err => err && next(err));
});
app.use((err, req, res, next) => {
  console.error('Request error:', err?.message || err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: err.status && err.status < 500 ? err.message : 'An unexpected server error occurred.' });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, '0.0.0.0', () => console.log(`Orange Capitals server listening on ${port}`));
