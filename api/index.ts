import 'dotenv/config';
import { createApp } from '../src/app';
import { initDb } from '../src/db';

const app = createApp();

initDb().catch(err => console.error('[api] initDb failed:', err));

export default app;
