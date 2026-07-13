import { neon, NeonQueryFunction } from '@neondatabase/serverless';

let sql: NeonQueryFunction<false, false> | null = null;

if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL);
} else {
  console.warn('[db] DATABASE_URL not set — leaderboard persistence disabled');
}

export { sql };

export async function initDb(): Promise<void> {
  if (!sql) return;
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
