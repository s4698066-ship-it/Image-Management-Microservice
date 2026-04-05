import { Pool } from 'pg';
import { env } from './env';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const initDb = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        hash VARCHAR(64) UNIQUE NOT NULL,
        cloudinary_url TEXT,
        imgbb_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('â Database initialized');
  } catch (error) {
    console.error('â Database initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
};
