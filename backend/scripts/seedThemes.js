/**
 * Seed script: inserts 8 preset themes into the `themes` table.
 * Run with:  node backend/scripts/seedThemes.js
 */
import pool from '../config/db.js';

const PRESET_THEMES = [
    {
        name: 'Clean Light',
        background_color: '#ffffff', primary_color: '#4F46E5',
        secondary_color: '#7c3aed', accent_color: '#06b6d4',
        navbar_color: '#ffffff', sidebar_color: '#f8fafc',
        card_background: '#ffffff', border_color: '#e2e8f0',
        text_primary: '#0f172a', text_secondary: '#475569',
        button_bg: '#4F46E5', button_text: '#ffffff',
        table_header: '#f1f5f9', table_row: '#ffffff',
        hover_color: '#f1f5f9',
    },
    {
        name: 'Midnight Dark',
        background_color: '#0f172a', primary_color: '#6366f1',
        secondary_color: '#8b5cf6', accent_color: '#22d3ee',
        navbar_color: '#1e293b', sidebar_color: '#1e293b',
        card_background: '#1e293b', border_color: '#334155',
        text_primary: '#f1f5f9', text_secondary: '#94a3b8',
        button_bg: '#6366f1', button_text: '#ffffff',
        table_header: '#1e293b', table_row: '#0f172a',
        hover_color: '#334155',
    },
    {
        name: 'Ocean Blue',
        background_color: '#eff6ff', primary_color: '#1d4ed8',
        secondary_color: '#0369a1', accent_color: '#0891b2',
        navbar_color: '#1d4ed8', sidebar_color: '#dbeafe',
        card_background: '#ffffff', border_color: '#bfdbfe',
        text_primary: '#1e3a5f', text_secondary: '#3b6ea5',
        button_bg: '#1d4ed8', button_text: '#ffffff',
        table_header: '#dbeafe', table_row: '#eff6ff',
        hover_color: '#dbeafe',
    },
    {
        name: 'Forest Green',
        background_color: '#f0fdf4', primary_color: '#15803d',
        secondary_color: '#166534', accent_color: '#0d9488',
        navbar_color: '#15803d', sidebar_color: '#dcfce7',
        card_background: '#ffffff', border_color: '#bbf7d0',
        text_primary: '#14532d', text_secondary: '#166534',
        button_bg: '#15803d', button_text: '#ffffff',
        table_header: '#dcfce7', table_row: '#f0fdf4',
        hover_color: '#dcfce7',
    },
    {
        name: 'Sunset Orange',
        background_color: '#fff7ed', primary_color: '#ea580c',
        secondary_color: '#c2410c', accent_color: '#d97706',
        navbar_color: '#ea580c', sidebar_color: '#ffedd5',
        card_background: '#ffffff', border_color: '#fed7aa',
        text_primary: '#431407', text_secondary: '#9a3412',
        button_bg: '#ea580c', button_text: '#ffffff',
        table_header: '#ffedd5', table_row: '#fff7ed',
        hover_color: '#ffedd5',
    },
    {
        name: 'Rose Pink',
        background_color: '#fff1f2', primary_color: '#e11d48',
        secondary_color: '#9f1239', accent_color: '#db2777',
        navbar_color: '#e11d48', sidebar_color: '#ffe4e6',
        card_background: '#ffffff', border_color: '#fecdd3',
        text_primary: '#4c0519', text_secondary: '#9f1239',
        button_bg: '#e11d48', button_text: '#ffffff',
        table_header: '#ffe4e6', table_row: '#fff1f2',
        hover_color: '#ffe4e6',
    },
    {
        name: 'Slate Professional',
        background_color: '#f8fafc', primary_color: '#334155',
        secondary_color: '#475569', accent_color: '#0ea5e9',
        navbar_color: '#1e293b', sidebar_color: '#f1f5f9',
        card_background: '#ffffff', border_color: '#cbd5e1',
        text_primary: '#0f172a', text_secondary: '#475569',
        button_bg: '#334155', button_text: '#ffffff',
        table_header: '#f1f5f9', table_row: '#ffffff',
        hover_color: '#e2e8f0',
    },
    {
        name: 'Purple Haze',
        background_color: '#faf5ff', primary_color: '#7c3aed',
        secondary_color: '#6d28d9', accent_color: '#db2777',
        navbar_color: '#7c3aed', sidebar_color: '#ede9fe',
        card_background: '#ffffff', border_color: '#ddd6fe',
        text_primary: '#3b0764', text_secondary: '#6d28d9',
        button_bg: '#7c3aed', button_text: '#ffffff',
        table_header: '#ede9fe', table_row: '#faf5ff',
        hover_color: '#ede9fe',
    },
    {
        name: 'Charcoal Dark',
        background_color: '#18181b', primary_color: '#a78bfa',
        secondary_color: '#7c3aed', accent_color: '#34d399',
        navbar_color: '#27272a', sidebar_color: '#27272a',
        card_background: '#27272a', border_color: '#3f3f46',
        text_primary: '#fafafa', text_secondary: '#a1a1aa',
        button_bg: '#7c3aed', button_text: '#ffffff',
        table_header: '#27272a', table_row: '#18181b',
        hover_color: '#3f3f46',
    },
    {
        name: 'Golden Hour',
        background_color: '#fffbeb', primary_color: '#b45309',
        secondary_color: '#92400e', accent_color: '#d97706',
        navbar_color: '#92400e', sidebar_color: '#fef3c7',
        card_background: '#ffffff', border_color: '#fde68a',
        text_primary: '#451a03', text_secondary: '#78350f',
        button_bg: '#b45309', button_text: '#ffffff',
        table_header: '#fef3c7', table_row: '#fffbeb',
        hover_color: '#fef3c7',
    },
];

async function seedThemes() {
    console.log('🎨 Seeding preset themes...\n');
    let inserted = 0;
    let skipped = 0;

    for (const theme of PRESET_THEMES) {
        try {
            // Skip if a preset with this name already exists
            const exists = await pool.query(
                `SELECT id FROM themes WHERE name = $1 AND type = 'preset'`,
                [theme.name]
            );
            if (exists.rows.length > 0) {
                console.log(`  ⚡ Skipped (already exists): ${theme.name}`);
                skipped++;
                continue;
            }

            await pool.query(
                `INSERT INTO themes (
                    name, type,
                    background_color, primary_color, secondary_color, accent_color,
                    navbar_color, sidebar_color, card_background, border_color,
                    text_primary, text_secondary, button_bg, button_text,
                    table_header, table_row, hover_color
                ) VALUES (
                    $1, 'preset',
                    $2, $3, $4, $5, $6, $7, $8, $9,
                    $10, $11, $12, $13, $14, $15, $16
                )`,
                [
                    theme.name,
                    theme.background_color, theme.primary_color,
                    theme.secondary_color, theme.accent_color,
                    theme.navbar_color, theme.sidebar_color,
                    theme.card_background, theme.border_color,
                    theme.text_primary, theme.text_secondary,
                    theme.button_bg, theme.button_text,
                    theme.table_header, theme.table_row, theme.hover_color,
                ]
            );
            console.log(`  ✅ Inserted: ${theme.name}`);
            inserted++;
        } catch (err) {
            console.error(`  ❌ Failed: ${theme.name} — ${err.message}`);
        }
    }

    console.log(`\n✨ Done. ${inserted} inserted, ${skipped} skipped.`);
    await pool.end();
    process.exit(0);
}

seedThemes().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
