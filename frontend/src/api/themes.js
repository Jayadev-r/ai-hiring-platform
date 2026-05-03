import axios from './axios';

export const themeAPI = {
    /**
     * Fetch all available themes (preset + user's custom)
     */
    getAll: async () => {
        const res = await axios.get('/themes');
        return res.data;
    },

    /**
     * Fetch the current user's active theme
     */
    getCurrent: async () => {
        const res = await axios.get('/themes/current');
        return res.data;
    },

    /**
     * Apply a theme by ID
     * @param {string} themeId
     */
    apply: async (themeId) => {
        const res = await axios.post('/themes/apply', { theme_id: themeId });
        return res.data;
    },

    /**
     * Save a custom theme
     * @param {object} themeData - { name, background_color, primary_color, ... }
     */
    saveCustom: async (themeData) => {
        const res = await axios.post('/themes/custom', themeData);
        return res.data;
    },

    /**
     * Delete a custom theme
     * @param {string} themeId
     */
    deleteTheme: async (themeId) => {
        const res = await axios.delete(`/themes/${themeId}`);
        return res.data;
    },
};

export default themeAPI;
