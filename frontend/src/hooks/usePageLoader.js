import { useEffect, useRef, useCallback, useState } from 'react';
import AILoader from '../components/futuristic/AILoader';

/**
 * usePageLoader – Centralised async data-loading hook.
 *
 * Usage:
 *   const { data, loading, error, refetch } = usePageLoader(fetchFn);
 *
 * `fetchFn` should be a stable reference (useCallback) or a simple function.
 */
const usePageLoader = (fetchFn, deps = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const mountedRef = useRef(true);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchFn();
            if (mountedRef.current) setData(result);
        } catch (err) {
            if (mountedRef.current) setError(err?.response?.data?.message || err?.message || 'Something went wrong.');
        } finally {
            if (mountedRef.current) setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        mountedRef.current = true;
        load();
        return () => { mountedRef.current = false; };
    }, [load]);

    return { data, loading, error, refetch: load };
};

export default usePageLoader;
