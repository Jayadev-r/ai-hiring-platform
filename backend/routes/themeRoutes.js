import express from 'express';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/**
 * Validates a single color value: must be hex (#rrggbb / #rgb), rgb(), or hsl()
 */
function isValidColor(color) {
    if (!color || typeof color !== 'string') return false;
    const trimmed = color.trim();
    const hexPattern = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    const rgbPattern = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
    const hslPattern = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;
    return hexPattern.test(trimmed) || rgbPattern.test(trimmed) || hslPattern.test(trimmed);
}

/**
 * Convert a hex color to RGB components
 */
function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const full = clean.length === 3
        ? clean.split('').map(c => c + c).join('')
        : clean;
    const num = parseInt(full, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Calculate relative luminance (WCAG formula)
 */
function getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two hex colors (WCAG)
 */
function getContrastRatio(hex1, hex2) {
    try {
        const rgb1 = hexToRgb(hex1);
        const rgb2 = hexToRgb(hex2);
        const l1 = getLuminance(...rgb1);
        const l2 = getLuminance(...rgb2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    } catch {
        return null;
    }
}

const THEME_FIELDS = [
    'background_color', 'primary_color', 'secondary_color', 'accent_color',
    'navbar_color', 'sidebar_color', 'card_background', 'border_color',
    'text_primary', 'text_secondary', 'button_bg', 'button_text',
    'table_header', 'table_row', 'hover_color',
];

/**
 * GET /api/themes
 * Returns all preset themes + current user's custom themes
 */
router.get('/', auth, async (req, res) => {
    try {
        const { userId } = req.user;

        const result = await pool.query(
            `SELECT * FROM themes
             WHERE type = 'preset' OR (type = 'custom' AND created_by_user_id = $1)
             ORDER BY type, created_at ASC`,
            [userId]
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

        // Verify the theme exists and belongs to preset or user
        const themeCheck = await pool.query(
            `SELECT id FROM themes WHERE id = $1 AND (type = 'preset' OR created_by_user_id = $2)`,
            [theme_id, userId]
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

/**
 * POST /api/themes/custom
 * Save a custom theme. Validates all colors + WCAG contrast for text/bg.
 */
router.post('/custom', auth, async (req, res) => {
    try {
        const { userId } = req.user;
        const { name, ...colors } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ success: false, message: 'Theme name is required.' });
        }

        if (name.trim().length > 100) {
            return res.status(400).json({ success: false, message: 'Theme name must be 100 characters or fewer.' });
        }

        // Validate all provided color fields
        const invalidFields = [];
        for (const field of THEME_FIELDS) {
            const value = colors[field];
            if (value !== undefined && !isValidColor(value)) {
                invalidFields.push(field);
            }
        }

        if (invalidFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Invalid color format in: ${invalidFields.join(', ')}. Use hex (#rrggbb), rgb(), or hsl().`,
            });
        }

        // WCAG contrast check: text on background (must be >= 4.5:1 for AA)
        const bgColor = colors.background_color || '#ffffff';
        const textColor = colors.text_primary || '#000000';
        const contrastErrors = [];

        if (bgColor.startsWith('#') && textColor.startsWith('#')) {
            const ratio = getContrastRatio(bgColor, textColor);
            if (ratio !== null && ratio < 4.5) {
                contrastErrors.push({
                    pair: 'text_primary on background_color',
                    ratio: ratio.toFixed(2),
                    required: '4.5',
                });
            }
        }

        const btnBg = colors.button_bg || '#3b82f6';
        const btnText = colors.button_text || '#ffffff';
        if (btnBg.startsWith('#') && btnText.startsWith('#')) {
            const ratio = getContrastRatio(btnBg, btnText);
            if (ratio !== null && ratio < 4.5) {
                contrastErrors.push({
                    pair: 'button_text on button_bg',
                    ratio: ratio.toFixed(2),
                    required: '4.5',
                });
            }
        }

        if (contrastErrors.length > 0) {
            return res.status(422).json({
                success: false,
                message: 'Theme fails WCAG contrast requirements. Please improve readability.',
                contrast_errors: contrastErrors,
            });
        }

        // Build insert with defaults for missing fields
        const defaults = {
            background_color: '#ffffff',
            primary_color: '#3b82f6',
            secondary_color: '#8b5cf6',
            accent_color: '#06b6d4',
            navbar_color: '#ffffff',
            sidebar_color: '#f8fafc',
            card_background: '#ffffff',
            border_color: '#e2e8f0',
            text_primary: '#0f172a',
            text_secondary: '#475569',
            button_bg: '#3b82f6',
            button_text: '#ffffff',
            table_header: '#f1f5f9',
            table_row: '#ffffff',
            hover_color: '#f8fafc',
        };

        const values = THEME_FIELDS.map(f => colors[f] ?? defaults[f]);

        const result = await pool.query(
            `INSERT INTO themes (
                name, type, created_by_user_id,
                background_color, primary_color, secondary_color, accent_color,
                navbar_color, sidebar_color, card_background, border_color,
                text_primary, text_secondary, button_bg, button_text,
                table_header, table_row, hover_color
            ) VALUES (
                $1, 'custom', $2,
                $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
            ) RETURNING *`,
            [name.trim(), userId, ...values]
        );

        return res.status(201).json({
            success: true,
            message: 'Custom theme saved.',
            theme: result.rows[0],
        });
    } catch (error) {
        console.error('POST /themes/custom error:', error);
        return res.status(500).json({ success: false, message: 'Failed to save custom theme.' });
    }
});

/**
 * DELETE /api/themes/:id
 * Delete a user's custom theme
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM themes WHERE id = $1 AND type = 'custom' AND created_by_user_id = $2 RETURNING id`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Custom theme not found or access denied.' });
        }

        return res.json({ success: true, message: 'Theme deleted.' });
    } catch (error) {
        console.error('DELETE /themes/:id error:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete theme.' });
    }
});

export default router;
