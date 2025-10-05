import { useState } from 'react';

/**
 * Custom hook to handle form submissions (POST, PUT, DELETE).
 * @param {function} apiCall - The apiClient function to execute (e.g., (data) => apiClient.post('/url', data)).
 * @returns {[(data: any) => Promise<void>, { loading: boolean, error: string | null }]}
 */
const useSubmit = (apiCall) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (data) => {
        setLoading(true);
        setError(null);
        try {
            await apiCall(data);
            // lets component handle success
        } catch (err) {
            console.error('Submission failed:', err);
            if (err.response && err.response.data && err.response.data.errors) {
                // got validation errors from laravel
                const validationErrors = err.response.data.errors;
                const firstError = Object.values(validationErrors)[0][0];
                setError(firstError);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
            // throw error so calling component can also handle it if needed
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return [handleSubmit, { loading, error }];
};

export default useSubmit;
