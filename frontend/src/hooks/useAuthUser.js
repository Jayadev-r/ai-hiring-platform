import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * useAuthUser – convenience hook for user identity and role.
 * Returns { name, email, role, avatar, isJobSeeker, isRecruiter, isAdmin }
 */
const useAuthUser = () => {
    const { user } = useAuth();

    return useMemo(() => ({
        name: user?.name || user?.email?.split('@')[0] || 'User',
        email: user?.email || '',
        role: user?.role || '',
        avatar: user?.avatar || null,
        isJobSeeker: user?.role === 'job_seeker',
        isRecruiter: user?.role === 'recruiter',
        isAdmin: user?.role === 'admin',
    }), [user]);
};

export default useAuthUser;
