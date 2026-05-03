/**
 * Redis Connection Module
 * ========================
 * Initializes and exports a Redis client used as the high-speed
 * cache layer between Express and PostgreSQL.
 *
 * Behaviour:
 *  - Connects automatically on import; exports the live client instance.
 *  - Logs connection status to the console.
 *  - Handles connection errors gracefully — errors NEVER crash the server.
 *  - If REDIS_URL is not set, defaults to redis://localhost:6379.
 *
 * Usage:
 *   import redisClient from './config/redis.js';
 */

import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Create the Redis client
const redisClient = createClient({
    url: REDIS_URL,
    socket: {
        // Reconnect strategy: exponential back-off up to 5 s, max 10 retries
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.error('[REDIS] Max reconnection attempts reached. Giving up.');
                return false; // Stop retrying
            }
            const delay = Math.min(retries * 200, 5000);
            return delay;
        },
        connectTimeout: 5000, // 5 s initial connect timeout
    },
});

// ── Event Listeners ──────────────────────────────────────────────────────────

redisClient.on('connect', () => {
    console.log('[REDIS] Connecting to', REDIS_URL);
});

redisClient.on('ready', () => {
    console.log('[REDIS] Connected successfully');
});

redisClient.on('error', (err) => {
    // Log the full error object for better debugging (empty message was seen earlier)
    console.error('[REDIS] Connection failed:', err);
});

redisClient.on('reconnecting', () => {
    console.log('[REDIS] Attempting to reconnect...');
});

redisClient.on('end', () => {
    console.log('[REDIS] Connection closed');
});

// ── Connect (non-blocking for the rest of the app) ──────────────────────────

// We do NOT await this — if Redis is unavailable the server still starts.
redisClient.connect().catch((err) => {
    console.error('[REDIS] Initial connection failed (server will still run without cache):', err.message);
});

export default redisClient;
