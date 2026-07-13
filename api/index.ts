import 'dotenv/config';
import { createApp } from '../src/app.js';
import { initDb } from '../src/db.js';

const app = createApp();

initDb().catch(err => console.error('[api] initDb failed:', err));

export default app;
