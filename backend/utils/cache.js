/**
 * Cache Utility Module
 * =====================
 * Reusable helper functions for interacting with Redis.
 *
 * All functions:
 *  - Are async / await
 *  - Auto JSON-stringify on write, JSON-parse on read
 *  - Handle Redis errors gracefully (return null / silent fail)
 *  - Log cache hits, misses, sets, and invalidations
 *
 * TTL Constants (seconds):
 *  - USER_TTL              1800  (30 min) — user profile
 *  - COMPANY_TTL           1800  (30 min) — company profile
 *  - DASHBOARD_TTL          300  (5 min)  — aggregated dashboard
 *  - RECRUITER_JOBS_TTL     300  (5 min)  — recruiter job list
 *  - APPLICATIONS_TTL       300  (5 min)  — applications list
 */

import redisClient from '../config/redis.js';

// ── TTL Constants ─────────────────────────────────────────────────────────────

export const TTL = {
    USER: 1800,           // 30 min — user profile data
    COMPANY: 1800,        // 30 min — company profile
    DASHBOARD: 300,       // 5 min  — provider dashboard aggregate
    RECRUITER_JOBS: 300,  // 5 min  — recruiter job listings
    APPLICATIONS: 300,    // 5 min  — applications list
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Check whether the Redis client is currently connected and ready.
 * Used as a guard before every Redis operation so we fail silently
 * when Redis is unavailable (falling back to PostgreSQL).
 */
const isReady = () => redisClient.isReady;

// ── Core Functions ────────────────────────────────────────────────────────────

/**
 * Retrieve a cached value by key.
 * @param {string} key - Redis key
 * @returns {any|null} Parsed JSON value, or null on miss / error
 */
export const getCache = async (key) => {
    if (!isReady()) return null;

    try {
        const raw = await redisClient.get(key);

        if (raw === null) {
            console.log(`[REDIS] Cache miss  → ${key}`);
            return null;
        }

        console.log(`[REDIS] Cache hit   → ${key}`);
        return JSON.parse(raw);
    } catch (err) {
        console.error(`[REDIS] getCache error for key "${key}":`, err.message);
        return null;
    }
};

/**
 * Store a value in Redis with an expiry TTL.
 * @param {string} key   - Redis key
 * @param {any}    data  - Data to cache (will be JSON-stringified)
 * @param {number} ttl   - Time-to-live in seconds (default: 300)
 */
export const setCache = async (key, data, ttl = 300) => {
    if (!isReady()) return;

    try {
        await redisClient.set(key, JSON.stringify(data), { EX: ttl });
        console.log(`[REDIS] Cache set   → ${key} (TTL ${ttl}s)`);
    } catch (err) {
        console.error(`[REDIS] setCache error for key "${key}":`, err.message);
    }
};

/**
 * Delete one or more cache keys.
 * @param {...string} keys - One or more Redis keys to delete
 */
export const deleteCache = async (...keys) => {
    if (!isReady()) return;

    try {
        for (const key of keys) {
            await redisClient.del(key);
            console.log(`[REDIS] Cache invalidated → ${key}`);
        }
    } catch (err) {
        console.error(`[REDIS] deleteCache error:`, err.message);
    }
};

// ── Cache Key Builders ────────────────────────────────────────────────────────
// Centralised key naming ensures no collisions and easier debugging.

export const cacheKeys = {
    user: (userId) => `user:${userId}`,
    company: (userId) => `company:${userId}`,
    recruiterJobs: (userId) => `recruiter:jobs:${userId}`,
    recruiterApplications: (userId) => `recruiter:applications:${userId}`,
    providerDashboard: (userId) => `dashboard:provider:${userId}`,
};
