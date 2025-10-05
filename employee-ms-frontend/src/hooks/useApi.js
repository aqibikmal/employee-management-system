import { useState, useEffect } from 'react';

/**
 * custom hook for fetching data from an API endpoint.
 * @param {function} apiFunc - The API function to call.
 * @returns {{data: any, loading: boolean, error: string}}
 */
const useApi = (apiFunc) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiFunc();
                setData(response.data);
            } catch (err) {
                console.error('API call failed:', err);
                setError('Failed to fetch data from the server.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array to run only once on mount
    return { data, loading, error };
};

export default useApi;
