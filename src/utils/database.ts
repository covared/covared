// lib/initDb.ts
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DATABASE_USERNAME,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
});

const initDb = async () => {
  const client = await pool.connect();
  try {
    // Create the breezed_users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS breezed_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        email_verification_code VARCHAR(255),
        logins INTEGER DEFAULT 0,
        api_calls INTEGER DEFAULT 0,
        subscribed_monthly BOOLEAN DEFAULT FALSE,
        subscribed_lifetime BOOLEAN DEFAULT FALSE,
        time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        time_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } finally {
    client.release();
  }
};

export { pool, initDb };
