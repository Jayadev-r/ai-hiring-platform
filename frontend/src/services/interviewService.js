import api from '../api/axios';

/**
 * Select a candidate for interview
 */
export const selectCandidateForInterview = async (jobId, applicationId, candidateId) => {
    const response = await api.post('/interviews/select', { jobId, applicationId, candidateId });
    return response.data;
};

/**
 * Schedule an interview
 */
export const scheduleInterview = async (interviewId, scheduleData) => {
    const response = await api.put(`/interviews/schedule/${interviewId}`, scheduleData);
    return response.data;
};

/**
 * Send interview invitation email
 */
export const sendInterviewEmail = async (interviewId) => {
    const response = await api.post(`/interviews/send-email/${interviewId}`, {});
    return response.data;
};

/**
 * Get recruiter's interviews
 */
export const getRecruiterInterviews = async () => {
    const response = await api.get('/interviews/recruiter');
    return response.data;
};

/**
 * Get candidate's interviews
 */
export const getCandidateInterviews = async () => {
    const response = await api.get('/interviews/candidate');
    return response.data;
};

/**
 * Join interview (get Agora token)
 */
export const joinInterview = async (channelName) => {
    const response = await api.post('/interviews/join', { channelName });
    return response.data;
};

/**
 * Cancel interview
 */
export const cancelInterview = async (interviewId) => {
    const response = await api.delete(`/interviews/${interviewId}`);
    return response.data;
};

export default {
    selectCandidateForInterview,
    scheduleInterview,
    sendInterviewEmail,
    getRecruiterInterviews,
    getCandidateInterviews,
    joinInterview,
    cancelInterview
};
