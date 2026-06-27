import { useState, useEffect } from 'react';

// services
import authService from '../../services/authService';

/**
 * Fetches a list of users (clients or trainers) belonging to the current gym.
 * Reads gymId from localStorage automatically.
 *
 * @param {'clients' | 'trainers'} type
 * @returns {{ users: Array, loading: boolean, error: string }}
 */
export function useGymUsers(type) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const gymId = localStorage.getItem('gymId');

    useEffect(() => {
        if (!gymId) {
            setError('No gym linked to this account.');
            setLoading(false);
            return;
        }

        const fetch = type === 'clients'
            ? authService.getClientsByGym(gymId)
            : authService.getTrainersByGym(gymId);

        fetch
            .then(setUsers)
            .catch(() => setError(`Failed to load ${type}.`))
            .finally(() => setLoading(false));
    }, [gymId, type]);

    return { users, loading, error };
}