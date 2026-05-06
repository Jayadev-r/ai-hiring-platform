import api from './axios';

/**
 * Fetch public company details by ID
 * @param {string|number} companyId 
 * @returns {Promise<Object>} Company details
 */
export const getPublicCompany = async (companyId) => {
    try {
        const response = await api.get(`/companies/public/${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching public company:', error);
        throw error;
    }
};
