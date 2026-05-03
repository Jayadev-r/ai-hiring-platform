import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();

// Required for Node.js environments to use WebSockets
neonConfig.webSocketConstructor = ws;

/**
 * PostgreSQL Connection Pool
 * Connects to Neon/Supabase PostgreSQL with cold-start retry logic.
 *
 * Neon free-tier databases auto-suspend after inactivity (~5 min).
 * we use @neondatabase/serverless to connect via WebSockets (Port 443)
 * to bypass port 5432 blocks on restricted networks.
 */

const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error(
        'Database connection string is not defined. ' +
        'Please set NEON_DATABASE_URL or DATABASE_URL in your .env file.'
    );
}

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, // 10s per attempt (Neon wakes in ~5-10s)
    keepAlive: true,
});

pool.on('connect', () => console.log('✅ PostgreSQL pool connected (via WebSockets)'));
pool.on('error', (err) => console.error('❌ PostgreSQL pool error:', err.message));

/**
 * Test DB connectivity with retry-backoff.
 * Call this once at server startup to wait for Neon to wake up.
 * @param {number} retries  – max attempts (default 5)
 * @param {number} delayMs  – ms between attempts (default 3000)
 */
export const testConnection = async (retries = 5, delayMs = 3000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const client = await pool.connect();
            await client.query('SELECT 1');
            client.release();
            console.log(`✅ Database ready (attempt ${attempt})`);
            return true;
        } catch (err) {
            console.warn(`⚠️  DB connection attempt ${attempt}/${retries} failed: ${err.message}`);
            if (attempt === retries) {
                console.error('❌ Could not connect to database after all retries. Is Neon awake?');
                return false;
            }
            await new Promise(res => setTimeout(res, delayMs));
        }
    }
};

/**
 * Execute a parameterized query.
 */
export const query = async (text, params = []) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        console.log(`📊 Query executed in ${Date.now() - start}ms`);
        return result;
    } catch (error) {
        console.error('❌ Database query error:', error.message);
        throw error;
    }
};

/**
 * Get a client from the pool for transactions.
 */
export const getClient = async () => pool.connect();

/**
 * Close the pool (graceful shutdown).
 */
export const closePool = async () => {
    await pool.end();
    console.log('✅ PostgreSQL pool closed');
};

export default pool;
