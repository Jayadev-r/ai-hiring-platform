import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop – Resets window scroll to top on every route change.
 * Placed inside UserLayout so it applies to all user-portal routes.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
    return null;
};

export default ScrollToTop;
