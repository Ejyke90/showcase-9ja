import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const sql = neon(process.env.DATABASE_URL);

export async function initDb(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS leaderboard (
      id         SERIAL PRIMARY KEY,
      username   VARCHAR(20)  NOT NULL,
      score      INTEGER      NOT NULL,
      category   VARCHAR(50)  NOT NULL,
      timestamp  BIGINT       NOT NULL
    )
  `;
}
