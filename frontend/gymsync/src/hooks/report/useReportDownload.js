import { useState } from 'react';

/**
 * Hook for downloading PDF reports returned as Blob.
 * Creates a temporary object URL, triggers the download, then revokes it.
 *
 * @param {() => Promise<Blob>} fetchFn  - Async function that returns a Blob
 * @param {string} filename              - Downloaded file name, e.g. "report.pdf"
 * @returns {{ download: () => void, loading: boolean, error: string }}
 */
export function useReportDownload(fetchFn, filename) {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');

    async function download() {
        setError('');
        setLoading(true);
        try {
            const blob = await fetchFn();
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href     = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            setError('Failed to download report.');
        } finally {
            setLoading(false);
        }
    }

    return { download, loading, error };
}