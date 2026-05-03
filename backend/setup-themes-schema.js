import pool from './config/db.js';

async function setupThemesSchema() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log('🔄 Setting up themes schema...');

        // 1. Create themes table
        await client.query(`
            CREATE TABLE IF NOT EXISTS themes (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(100) NOT NULL,
                type VARCHAR(20) NOT NULL DEFAULT 'preset' CHECK (type IN ('preset', 'custom')),
                created_by_user_id UUID REFERENCES credentials(id) ON DELETE CASCADE,
                background_color VARCHAR(50) NOT NULL DEFAULT '#ffffff',
                primary_color VARCHAR(50) NOT NULL DEFAULT '#3b82f6',
                secondary_color VARCHAR(50) NOT NULL DEFAULT '#8b5cf6',
                accent_color VARCHAR(50) NOT NULL DEFAULT '#06b6d4',
                navbar_color VARCHAR(50) NOT NULL DEFAULT '#ffffff',
                sidebar_color VARCHAR(50) NOT NULL DEFAULT '#f8fafc',
                card_background VARCHAR(50) NOT NULL DEFAULT '#ffffff',
                border_color VARCHAR(50) NOT NULL DEFAULT '#e2e8f0',
                text_primary VARCHAR(50) NOT NULL DEFAULT '#0f172a',
                text_secondary VARCHAR(50) NOT NULL DEFAULT '#475569',
                button_bg VARCHAR(50) NOT NULL DEFAULT '#3b82f6',
                button_text VARCHAR(50) NOT NULL DEFAULT '#ffffff',
                table_header VARCHAR(50) NOT NULL DEFAULT '#f1f5f9',
                table_row VARCHAR(50) NOT NULL DEFAULT '#ffffff',
                hover_color VARCHAR(50) NOT NULL DEFAULT '#f8fafc',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('✅ themes table created/verified');

        // 2. Create user_theme_preferences table
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_theme_preferences (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL UNIQUE REFERENCES credentials(id) ON DELETE CASCADE,
                theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
                applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('✅ user_theme_preferences table created/verified');

        // 3. Seed 10 preset themes (skip if any preset themes already exist)
        const existingPresets = await client.query(`SELECT COUNT(*) FROM themes WHERE type = 'preset'`);
        if (parseInt(existingPresets.rows[0].count) === 0) {
            const presets = [
                {
                    name: 'Dark Professional',
                    background_color: '#121212',
                    primary_color: '#1E88E5',
                    secondary_color: '#1565C0',
                    accent_color: '#00E5FF',
                    navbar_color: '#1A1A1A',
                    sidebar_color: '#1A1A1A',
                    card_background: '#1E1E1E',
                    border_color: '#2C2C2C',
                    text_primary: '#FFFFFF',
                    text_secondary: '#B0B0B0',
                    button_bg: '#1E88E5',
                    button_text: '#FFFFFF',
                    table_header: '#242424',
                    table_row: '#1E1E1E',
                    hover_color: '#2A2A2A',
                },
                {
                    name: 'Midnight Blue',
                    background_color: '#0A192F',
                    primary_color: '#64FFDA',
                    secondary_color: '#1D6FA4',
                    accent_color: '#64FFDA',
                    navbar_color: '#0D2137',
                    sidebar_color: '#0D2137',
                    card_background: '#112240',
                    border_color: '#1E3A5F',
                    text_primary: '#CCD6F6',
                    text_secondary: '#8892B0',
                    button_bg: '#64FFDA',
                    button_text: '#0A192F',
                    table_header: '#0D2137',
                    table_row: '#112240',
                    hover_color: '#172F52',
                },
                {
                    name: 'Light Corporate',
                    background_color: '#F5F7FA',
                    primary_color: '#1976D2',
                    secondary_color: '#455A64',
                    accent_color: '#0288D1',
                    navbar_color: '#FFFFFF',
                    sidebar_color: '#FFFFFF',
                    card_background: '#FFFFFF',
                    border_color: '#E0E7EF',
                    text_primary: '#1F2937',
                    text_secondary: '#6B7280',
                    button_bg: '#1976D2',
                    button_text: '#FFFFFF',
                    table_header: '#EEF2F7',
                    table_row: '#FFFFFF',
                    hover_color: '#EEF2F7',
                },
                {
                    name: 'Emerald Dark',
                    background_color: '#0B3D2E',
                    primary_color: '#10B981',
                    secondary_color: '#059669',
                    accent_color: '#34D399',
                    navbar_color: '#0A3326',
                    sidebar_color: '#0A3326',
                    card_background: '#0F4D3A',
                    border_color: '#1A5C47',
                    text_primary: '#ECFDF5',
                    text_secondary: '#A7F3D0',
                    button_bg: '#10B981',
                    button_text: '#FFFFFF',
                    table_header: '#0A3326',
                    table_row: '#0F4D3A',
                    hover_color: '#145740',
                },
                {
                    name: 'Purple Neon',
                    background_color: '#1A0033',
                    primary_color: '#8B5CF6',
                    secondary_color: '#6D28D9',
                    accent_color: '#22D3EE',
                    navbar_color: '#1E0040',
                    sidebar_color: '#1E0040',
                    card_background: '#220045',
                    border_color: '#3D0080',
                    text_primary: '#F9FAFB',
                    text_secondary: '#DDD6FE',
                    button_bg: '#8B5CF6',
                    button_text: '#FFFFFF',
                    table_header: '#1E0040',
                    table_row: '#220045',
                    hover_color: '#2D0055',
                },
                {
                    name: 'Warm Sunrise',
                    background_color: '#FFFBF0',
                    primary_color: '#EA580C',
                    secondary_color: '#D97706',
                    accent_color: '#F59E0B',
                    navbar_color: '#FFFFFF',
                    sidebar_color: '#FFF7ED',
                    card_background: '#FFFFFF',
                    border_color: '#FED7AA',
                    text_primary: '#1C1917',
                    text_secondary: '#78716C',
                    button_bg: '#EA580C',
                    button_text: '#FFFFFF',
                    table_header: '#FFF7ED',
                    table_row: '#FFFFFF',
                    hover_color: '#FFF7ED',
                },
                {
                    name: 'Ocean Breeze',
                    background_color: '#F0F9FF',
                    primary_color: '#0369A1',
                    secondary_color: '#0891B2',
                    accent_color: '#06B6D4',
                    navbar_color: '#FFFFFF',
                    sidebar_color: '#E0F2FE',
                    card_background: '#FFFFFF',
                    border_color: '#BAE6FD',
                    text_primary: '#0C4A6E',
                    text_secondary: '#0369A1',
                    button_bg: '#0369A1',
                    button_text: '#FFFFFF',
                    table_header: '#E0F2FE',
                    table_row: '#FFFFFF',
                    hover_color: '#E0F2FE',
                },
                {
                    name: 'Slate Noir',
                    background_color: '#0F172A',
                    primary_color: '#6366F1',
                    secondary_color: '#4F46E5',
                    accent_color: '#818CF8',
                    navbar_color: '#0F172A',
                    sidebar_color: '#1E293B',
                    card_background: '#1E293B',
                    border_color: '#334155',
                    text_primary: '#F1F5F9',
                    text_secondary: '#94A3B8',
                    button_bg: '#6366F1',
                    button_text: '#FFFFFF',
                    table_header: '#1E293B',
                    table_row: '#263248',
                    hover_color: '#263248',
                },
                {
                    name: 'Rose Gold',
                    background_color: '#FDF2F8',
                    primary_color: '#BE185D',
                    secondary_color: '#9D174D',
                    accent_color: '#DB2777',
                    navbar_color: '#FFFFFF',
                    sidebar_color: '#FCE7F3',
                    card_background: '#FFFFFF',
                    border_color: '#FBCFE8',
                    text_primary: '#1F2937',
                    text_secondary: '#6B7280',
                    button_bg: '#BE185D',
                    button_text: '#FFFFFF',
                    table_header: '#FCE7F3',
                    table_row: '#FFFFFF',
                    hover_color: '#FCE7F3',
                },
                {
                    name: 'Carbon Dark',
                    background_color: '#111111',
                    primary_color: '#F59E0B',
                    secondary_color: '#D97706',
                    accent_color: '#FBBF24',
                    navbar_color: '#161616',
                    sidebar_color: '#1A1A1A',
                    card_background: '#1C1C1C',
                    border_color: '#2A2A2A',
                    text_primary: '#F5F5F5',
                    text_secondary: '#A3A3A3',
                    button_bg: '#F59E0B',
                    button_text: '#111111',
                    table_header: '#1A1A1A',
                    table_row: '#1C1C1C',
                    hover_color: '#222222',
                },
            ];

            for (const theme of presets) {
                await client.query(`
                    INSERT INTO themes (
                        name, type, background_color, primary_color, secondary_color, accent_color,
                        navbar_color, sidebar_color, card_background, border_color,
                        text_primary, text_secondary, button_bg, button_text,
                        table_header, table_row, hover_color
                    ) VALUES ($1, 'preset', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                `, [
                    theme.name,
                    theme.background_color, theme.primary_color, theme.secondary_color, theme.accent_color,
                    theme.navbar_color, theme.sidebar_color, theme.card_background, theme.border_color,
                    theme.text_primary, theme.text_secondary, theme.button_bg, theme.button_text,
                    theme.table_header, theme.table_row, theme.hover_color,
                ]);
                console.log(`  ✅ Seeded preset theme: ${theme.name}`);
            }
        } else {
            console.log(`ℹ️  Preset themes already exist (${existingPresets.rows[0].count} found). Skipping seed.`);
        }

        await client.query('COMMIT');
        console.log('');
        console.log('🎉 Theme schema setup complete!');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Themes schema setup failed:', error);
        process.exit(1);
    } finally {
        client.release();
        process.exit(0);
    }
}

setupThemesSchema();
