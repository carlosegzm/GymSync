// react
import { useNavigate } from 'react-router-dom';

// auth context
import { useAuth } from '../hooks/context/AuthContext';

// styles
import styles from './Dashboard.module.css';

// components
import ClientSection from '../components/dashboard/sections/ClientSection';
import TrainerSection from '../components/dashboard/sections/TrainerSection';
import AdminSection from '../components/dashboard/sections/AdminSection';

/**
 * Dashboard page 
 * 
 * @description renders role-specific content for ADMIN, TRAINER and CLIENT.
 * Metrics are fetched from GET /api/dashboard/{gymId}/metrics (ADMIN only).
 * PDF reports use direct anchor links — the browser handles the download natively.
 */
export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const gymId = localStorage.getItem('gymId');

    function handleLogout() {
        logout();
        navigate('/login');
    }

    function renderRoleSection() {
        switch (user?.role) {
            case 'ADMIN':   return <AdminSection gymId={gymId} />;
            case 'TRAINER': return <TrainerSection user={user} />;
            case 'CLIENT':  return <ClientSection user={user} />;
            default:        return null;
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>Welcome back</p>
                    <h1 className={styles.title}>
                        {user?.name ?? 'User'}
                        <span className={styles.roleBadge}>{user?.role}</span>
                    </h1>
                </div>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                    Sign out
                </button>
            </div>

            {renderRoleSection()}
        </div>
    );
}