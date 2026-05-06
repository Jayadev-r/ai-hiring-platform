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

    apply: async (themeId) => {
        const res = await axios.post('/themes/apply', { theme_id: themeId });
        return res.data;
    },
};

export default themeAPI;
