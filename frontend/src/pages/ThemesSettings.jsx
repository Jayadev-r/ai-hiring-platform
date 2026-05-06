import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import UserLayout from '../components/user-layout/UserLayout';
import ProviderLayout from '../components/provider-layout/ProviderLayout';
import AdminLayout from '../components/admin-layout/AdminLayout';
import {
    Palette, Check, Eye, Sliders, AlertTriangle,
    Trash2, Plus, Loader, Clock, Tag, ChevronRight,
    Sun, Moon, Layers
} from 'lucide-react';

// ─── Helper: contrast ratio (for live frontend WCAG check) ───────────────────
function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const full = clean.length === 3
        ? clean.split('').map(c => c + c).join('')
        : clean;
    if (full.length !== 6) return null;
    const num = parseInt(full, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}
function getLuminance(r, g, b) {
    return [r, g, b].reduce((acc, c, i) => {
        const s = c / 255;
        const lin = s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        return acc + lin * [0.2126, 0.7152, 0.0722][i];
    }, 0);
}
function contrastRatio(hex1, hex2) {
    try {
        const rgb1 = hexToRgb(hex1);
        const rgb2 = hexToRgb(hex2);
        if (!rgb1 || !rgb2) return null;
        const l1 = getLuminance(...rgb1);
        const l2 = getLuminance(...rgb2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    } catch { return null; }
}

// ─── Color Field definitions for the Custom Builder ─────────────────────────
const COLOR_FIELDS = [
    { key: 'background_color', label: 'Background', group: 'Layout' },
    { key: 'navbar_color', label: 'Navbar', group: 'Layout' },
    { key: 'sidebar_color', label: 'Sidebar', group: 'Layout' },
    { key: 'card_background', label: 'Card Background', group: 'Layout' },
    { key: 'border_color', label: 'Border', group: 'Layout' },
    { key: 'hover_color', label: 'Hover', group: 'Layout' },
    { key: 'primary_color', label: 'Primary', group: 'Accent' },
    { key: 'secondary_color', label: 'Secondary', group: 'Accent' },
    { key: 'accent_color', label: 'Accent', group: 'Accent' },
    { key: 'text_primary', label: 'Primary Text', group: 'Typography' },
    { key: 'text_secondary', label: 'Secondary Text', group: 'Typography' },
    { key: 'button_bg', label: 'Button Background', group: 'Button' },
    { key: 'button_text', label: 'Button Text', group: 'Button' },
    { key: 'table_header', label: 'Table Header', group: 'Table' },
    { key: 'table_row', label: 'Table Row', group: 'Table' },
];

const CUSTOM_DEFAULTS = {
    background_color: '#ffffff', primary_color: '#4F46E5',
    secondary_color: '#7c3aed', accent_color: '#0891b2',
    navbar_color: '#ffffff', sidebar_color: '#f1f5f9',
    card_background: '#ffffff', border_color: '#e2e8f0',
    text_primary: '#0f172a', text_secondary: '#475569',
    button_bg: '#4F46E5', button_text: '#ffffff',
    table_header: '#f1f5f9', table_row: '#ffffff',
    hover_color: '#f8fafc',
};

// ─── Sub-component: Theme Preview Mini Card ──────────────────────────────────
function ThemeMiniPreview({ theme }) {
    return (
        <div
            className="rounded-xl overflow-hidden border-2 transition-all duration-300"
            style={{ borderColor: theme.border_color, backgroundColor: theme.background_color }}
        >
            {/* Navbar strip */}
            <div className="px-3 py-1.5 flex items-center gap-1.5" style={{ backgroundColor: theme.navbar_color, borderBottom: `1px solid ${theme.border_color}` }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary_color }} />
                <div className="h-1.5 w-12 rounded-full" style={{ backgroundColor: theme.primary_color, opacity: 0.4 }} />
            </div>
            <div className="flex">
                {/* Sidebar strip */}
                <div className="w-8 min-h-[48px] p-1 space-y-1" style={{ backgroundColor: theme.sidebar_color }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-1.5 rounded-full" style={{ backgroundColor: theme.primary_color, opacity: i === 1 ? 0.9 : 0.3 }} />
                    ))}
                </div>
                {/* Content area */}
                <div className="flex-1 p-1.5 space-y-1">
                    <div className="rounded p-1" style={{ backgroundColor: theme.card_background, border: `1px solid ${theme.border_color}` }}>
                        <div className="h-1.5 w-3/4 rounded-full mb-1" style={{ backgroundColor: theme.text_primary }} />
                        <div className="h-1 w-1/2 rounded-full" style={{ backgroundColor: theme.text_secondary }} />
                    </div>
                    <div className="rounded px-2 py-0.5 text-[7px] font-bold inline-block" style={{ backgroundColor: theme.button_bg, color: theme.button_text }}>
                        CTA
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Sub-component: Preset Theme Card ───────────────────────────────────────
function PresetThemeCard({ theme, isActive, onPreview, onApply, applying }) {
    const [hovering, setHovering] = useState(false);
    return (
        <div
            className={`relative rounded-2xl p-4 border-2 transition-all duration-300 cursor-pointer group ${isActive
                ? 'border-blue-500 ring-2 ring-blue-500/30'
                : 'border-gray-200 hover:border-blue-300'
                }`}
            style={{
                backgroundColor: 'var(--theme-card-bg, #fff)',
                borderColor: isActive ? 'var(--theme-primary, #3b82f6)' : undefined,
            }}
            onMouseEnter={() => { setHovering(true); onPreview(theme); }}
            onMouseLeave={() => { setHovering(false); onPreview(null); }}
        >
            {isActive && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5 text-white" />
                </div>
            )}

            <div className="mb-3">
                <ThemeMiniPreview theme={theme} />
            </div>

            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--theme-text-primary, #0f172a)' }}>
                {theme.name}
            </h3>

            {/* Color dots */}
            <div className="flex gap-1.5 mb-3">
                {[theme.background_color, theme.primary_color, theme.accent_color, theme.text_primary, theme.sidebar_color].map((color, i) => (
                    <div
                        key={i}
                        className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
            </div>

            <div className="flex gap-2">
                <button
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
                    style={{
                        borderColor: 'var(--theme-border, #e2e8f0)',
                        color: 'var(--theme-text-secondary, #475569)',
                        backgroundColor: 'var(--theme-hover, #f8fafc)',
                    }}
                    onClick={(e) => { e.stopPropagation(); onPreview(hovering ? null : theme); }}
                >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                </button>
                <button
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-px"
                    style={{ backgroundColor: 'var(--theme-btn-bg, #4F46E5)' }}
                    disabled={applying || isActive}
                    onClick={(e) => { e.stopPropagation(); onApply(theme.id); }}
                >
                    {applying ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    {isActive ? 'Active' : 'Apply'}
                </button>
            </div>
        </div>
    );
}

// ─── Main ThemesSettings Component ──────────────────────────────────────────
export default function ThemesSettings() {
    const { user } = useAuth();
    const {
        currentTheme, presetThemes, customThemes,
        applyTheme, previewThemeLocally, saveCustomTheme, deleteTheme,
        loading, error: ctxError,
    } = useTheme();

    const [applying, setApplying] = useState(null);   // theme ID being applied
    const [activeSection, setActiveSection] = useState('presets'); // 'presets' | 'current' | 'custom'

    // ── Apply preset theme ────────────────────────────────────────────────────
    const handleApply = async (themeId) => {
        setApplying(themeId);
        try {
            await applyTheme(themeId);
        } catch { /* error shown via ctxError */ }
        finally { setApplying(null); }
    };

    // Section tab options
    const tabs = [
        { id: 'presets', label: 'Preset Themes', icon: Layers },
        { id: 'current', label: 'Current Theme', icon: Tag },
    ];

    // Choose the wrapper Layout based on the user's role
    let LayoutWrapper = React.Fragment;
    if (user?.role === 'job_seeker') LayoutWrapper = UserLayout;
    else if (user?.role === 'recruiter') LayoutWrapper = ProviderLayout;
    else if (user?.role === 'admin') LayoutWrapper = AdminLayout;

    // Choose the wrapper Layout based on the user's role
    let LayoutWrapper = React.Fragment;
    if (user?.role === 'job_seeker') LayoutWrapper = UserLayout;
    else if (user?.role === 'recruiter') LayoutWrapper = ProviderLayout;
    else if (user?.role === 'admin') LayoutWrapper = AdminLayout;

    return (
        <LayoutWrapper>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: 'var(--theme-primary, #4F46E5)' }}>
                            <Palette className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--theme-text-primary, #0f172a)', fontFamily: 'Space Grotesk, sans-serif' }}>
                                Theme Settings
                            </h1>
                            <p className="text-sm" style={{ color: 'var(--theme-text-secondary, #475569)' }}>
                                Choose a visual style that suits your working environment
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section Tabs */}
                <div className="flex gap-1 p-1 rounded-xl mb-8 w-fit border"
                    style={{ backgroundColor: 'var(--theme-card-bg, #fff)', borderColor: 'var(--theme-border, #e2e8f0)' }}>
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeSection === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSection(tab.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                style={isActive ? {
                                    backgroundColor: 'var(--theme-primary, #4F46E5)',
                                    color: '#fff',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                } : {
                                    color: 'var(--theme-text-secondary, #475569)',
                                }}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* ── SECTION 1: Preset Themes ── */}
                {activeSection === 'presets' && (
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {loading
                                ? Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="rounded-2xl h-52 animate-pulse" style={{ backgroundColor: 'var(--theme-hover, #f8fafc)' }} />
                                ))
                                : presetThemes.map(theme => (
                                    <PresetThemeCard
                                        key={theme.id}
                                        theme={theme}
                                        isActive={currentTheme?.id === theme.id}
                                        onPreview={previewThemeLocally}
                                        onApply={handleApply}
                                        applying={applying === theme.id}
                                    />
                                ))
                            }
                        </div>
                        </div>
                    </div>
                )}

                {/* ── SECTION 2: Current Theme ── */}
                {activeSection === 'current' && (
                    <div className="max-w-2xl">
                        {!currentTheme ? (
                            <div className="rounded-2xl p-8 text-center border"
                                style={{ backgroundColor: 'var(--theme-card-bg, #fff)', borderColor: 'var(--theme-border, #e2e8f0)' }}>
                                <Palette className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: 'var(--theme-text-secondary)' }} />
                                <p className="font-medium mb-2" style={{ color: 'var(--theme-text-primary, #0f172a)' }}>No theme applied yet</p>
                                <p className="text-sm" style={{ color: 'var(--theme-text-secondary, #475569)' }}>
                                    Choose a preset theme to personalize your experience.
                                </p>
                                <button
                                    className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                                    style={{ backgroundColor: 'var(--theme-btn-bg, #4F46E5)' }}
                                    onClick={() => setActiveSection('presets')}
                                >
                                    Browse Themes
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {/* Active Theme Card */}
                                <div className="rounded-2xl p-6 border"
                                    style={{ backgroundColor: 'var(--theme-card-bg, #fff)', borderColor: 'var(--theme-border, #e2e8f0)' }}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h2 className="text-xl font-bold" style={{ color: 'var(--theme-text-primary, #0f172a)' }}>
                                                {currentTheme.name}
                                            </h2>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span
                                                    className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                                                    style={{
                                                        backgroundColor: 'rgba(79,70,229,0.1)',
                                                        color: 'var(--theme-primary, #4F46E5)',
                                                    }}
                                                >
                                                    Preset Theme
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {[0, 1, 2, 3, 4].map(i => {
                                                const colors = [currentTheme.background_color, currentTheme.primary_color, currentTheme.accent_color, currentTheme.text_primary, currentTheme.sidebar_color];
                                                return <div key={i} className="w-6 h-6 rounded-full border border-black/10 shadow" style={{ backgroundColor: colors[i] }} />;
                                            })}
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    <div className="mb-4 max-w-xs">
                                        <ThemeMiniPreview theme={currentTheme} />
                                    </div>

                                    {currentTheme.applied_at && (
                                        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--theme-text-secondary, #475569)' }}>
                                            <Clock className="w-3.5 h-3.5" />
                                            Applied {new Date(currentTheme.applied_at).toLocaleString()}
                                        </div>
                                    )}
                                </div>

                                {/* Color palette grid */}
                                <div className="rounded-2xl p-6 border"
                                    style={{ backgroundColor: 'var(--theme-card-bg, #fff)', borderColor: 'var(--theme-border, #e2e8f0)' }}>
                                    <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--theme-text-primary, #0f172a)' }}>
                                        Theme Palette
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {COLOR_FIELDS.map(f => (
                                            <div key={f.key} className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-md border border-black/10 flex-shrink-0"
                                                    style={{ backgroundColor: currentTheme[f.key] }} />
                                                <div>
                                                    <div className="text-xs font-medium" style={{ color: 'var(--theme-text-primary, #0f172a)' }}>{f.label}</div>
                                                    <div className="text-[10px] font-mono" style={{ color: 'var(--theme-text-secondary, #475569)' }}>{currentTheme[f.key]}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </LayoutWrapper>
    );
}
