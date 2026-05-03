import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import themeAPI from '../api/themes';
import { useAuth } from './AuthContext';

const ThemeContext = createContext(null);

/**
 * Map of theme DB column names → CSS variable names injected into :root
 */
const THEME_CSS_MAP = {
    background_color: '--theme-bg',
    primary_color: '--theme-primary',
    secondary_color: '--theme-secondary',
    accent_color: '--theme-accent',
    navbar_color: '--theme-navbar',
    sidebar_color: '--theme-sidebar',
    card_background: '--theme-card-bg',
    border_color: '--theme-border',
    text_primary: '--theme-text-primary',
    text_secondary: '--theme-text-secondary',
    button_bg: '--theme-btn-bg',
    button_text: '--theme-btn-text',
    table_header: '--theme-table-header',
    table_row: '--theme-table-row',
    hover_color: '--theme-hover',
};

/**
 * Inject a theme object's colors into :root CSS variables
 */
function injectThemeVariables(theme) {
    if (!theme) return;
    const root = document.documentElement;
    for (const [key, cssVar] of Object.entries(THEME_CSS_MAP)) {
        if (theme[key]) {
            root.style.setProperty(cssVar, theme[key]);
        }
    }
}

/**
 * Remove all injected theme variables from :root (reset to CSS defaults)
 */
function clearThemeVariables() {
    const root = document.documentElement;
    for (const cssVar of Object.values(THEME_CSS_MAP)) {
        root.style.removeProperty(cssVar);
    }
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};

export const ThemeProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [currentTheme, setCurrentTheme] = useState(null);    // active DB theme
    const [allThemes, setAllThemes] = useState([]);            // all preset + custom themes
    const [previewTheme, setPreviewThemeState] = useState(null); // ephemeral preview, not saved
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Load all available themes from the API
     */
    const loadAllThemes = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const data = await themeAPI.getAll();
            if (data.success) setAllThemes(data.themes);
        } catch (err) {
            console.warn('Could not load themes:', err.message);
        }
    }, [isAuthenticated]);

    /**
     * Load current user's active theme from the API and inject it
     */
    const loadCurrentTheme = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            setLoading(true);
            const data = await themeAPI.getCurrent();
            if (data.success && data.theme) {
                setCurrentTheme(data.theme);
                injectThemeVariables(data.theme);
            }
        } catch (err) {
            console.warn('Could not load current theme:', err.message);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Load active theme on mount / auth change
    useEffect(() => {
        if (isAuthenticated) {
            loadCurrentTheme();
            loadAllThemes();
        } else {
            // User logged out – clear injected variables
            clearThemeVariables();
            setCurrentTheme(null);
            setAllThemes([]);
        }
    }, [isAuthenticated, loadCurrentTheme, loadAllThemes]);

    /**
     * Apply a theme by its ID (persists in DB)
     */
    const applyTheme = useCallback(async (themeId) => {
        try {
            setError(null);
            const data = await themeAPI.apply(themeId);
            if (data.success) {
                setCurrentTheme(data.theme);
                setPreviewThemeState(null);
                injectThemeVariables(data.theme);
            }
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to apply theme';
            setError(msg);
            throw err;
        }
    }, []);

    /**
     * Preview a theme locally WITHOUT saving (ephemeral)
     * Pass `null` to cancel preview and revert to active theme.
     */
    const previewThemeLocally = useCallback((theme) => {
        if (theme === null) {
            // Revert to current persisted theme
            setPreviewThemeState(null);
            injectThemeVariables(currentTheme);
        } else {
            setPreviewThemeState(theme);
            injectThemeVariables(theme);
        }
    }, [currentTheme]);

    /**
     * Save a custom theme (persists in DB)
     */
    const saveCustomTheme = useCallback(async (themeData) => {
        try {
            setError(null);
            const data = await themeAPI.saveCustom(themeData);
            if (data.success) {
                await loadAllThemes(); // Refresh theme list
            }
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to save custom theme';
            const contrastErrors = err.response?.data?.contrast_errors;
            setError(msg);
            const error = new Error(msg);
            error.contrastErrors = contrastErrors;
            throw error;
        }
    }, [loadAllThemes]);

    /**
     * Delete a custom theme
     */
    const deleteTheme = useCallback(async (themeId) => {
        try {
            setError(null);
            const data = await themeAPI.deleteTheme(themeId);
            if (data.success) {
                setAllThemes(prev => prev.filter(t => t.id !== themeId));
                // If the deleted theme was the active one, clear CSS vars
                if (currentTheme?.id === themeId) {
                    clearThemeVariables();
                    setCurrentTheme(null);
                }
            }
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to delete theme';
            setError(msg);
            throw err;
        }
    }, [currentTheme]);

    const presetThemes = allThemes.filter(t => t.type === 'preset');
    const customThemes = allThemes.filter(t => t.type === 'custom');

    const value = {
        currentTheme,
        previewTheme,
        allThemes,
        presetThemes,
        customThemes,
        loading,
        error,
        applyTheme,
        previewThemeLocally,
        saveCustomTheme,
        deleteTheme,
        loadAllThemes,
        loadCurrentTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
