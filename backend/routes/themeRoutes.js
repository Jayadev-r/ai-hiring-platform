import express from 'express';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/themes
 * Returns all preset themes
 */
router.get('/', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM themes
             WHERE type = 'preset'
             ORDER BY created_at ASC`
        );

        return res.json({
            success: true,
            themes: result.rows,
        });
    } catch (error) {
        console.error('GET /themes error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch themes.' });
    }
});

/**
 * GET /api/themes/current
 * Returns the authenticated user's currently applied theme
 */
router.get('/current', auth, async (req, res) => {
    try {
        const { userId } = req.user;

        const result = await pool.query(
            `SELECT t.*, utp.applied_at
             FROM user_theme_preferences utp
             JOIN themes t ON t.id = utp.theme_id
             WHERE utp.user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.json({ success: true, theme: null });
        }

        return res.json({ success: true, theme: result.rows[0] });
    } catch (error) {
        console.error('GET /themes/current error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch current theme.' });
    }
});

/**
 * POST /api/themes/apply
 * Set the user's active theme (by theme_id)
 */
router.post('/apply', auth, async (req, res) => {
    try {
        const { userId } = req.user;
        const { theme_id } = req.body;

        if (!theme_id) {
            return res.status(400).json({ success: false, message: 'theme_id is required.' });
        }

        // Verify the theme exists and is a preset
        const themeCheck = await pool.query(
            `SELECT id FROM themes WHERE id = $1 AND type = 'preset'`,
            [theme_id]
        );

        if (themeCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Theme not found or access denied.' });
        }

        // Upsert user_theme_preferences
        await pool.query(
            `INSERT INTO user_theme_preferences (user_id, theme_id, applied_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (user_id)
             DO UPDATE SET theme_id = $2, applied_at = NOW()`,
            [userId, theme_id]
        );

        // Return the full theme
        const themeResult = await pool.query('SELECT * FROM themes WHERE id = $1', [theme_id]);

        return res.json({
            success: true,
            message: 'Theme applied successfully.',
            theme: themeResult.rows[0],
        });
    } catch (error) {
        console.error('POST /themes/apply error:', error);
        return res.status(500).json({ success: false, message: 'Failed to apply theme.' });
    }
});

export default router;
