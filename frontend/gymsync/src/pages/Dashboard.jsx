import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import styles from './Dashboard.module.css';

/**
 * Painel Principal (Feed).
 *
 * @description
 * Componente central da aplicação que gerencia:
 * ... componentes
 */
export default function Dashboard() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const gymId = localStorage.getItem('gymId');
	const reportUrl = `http://localhost:8080/api/reports/finance/${gymId}`;

	function handleLogout() {
		logout();
		navigate('/login');
	}

	return (
		<div className={styles.page}>
			{/* Header */}
			<div className={styles.header}>
				<div>
					<p className={styles.eyebrow}>Welcome back</p>
					<h1 className={styles.title}>
						{user?.name ?? 'User'} <span className={styles.role}>{user?.role}</span>
					</h1>
				</div>
				<button className={styles.logoutBtn} onClick={handleLogout}>
					Sign out
				</button>
			</div>

			{/* Quick actions */}
			<div className={styles.actions}>
				<button className={styles.actionCard} onClick={() => navigate('/schedule')}>
					<span className={styles.actionIcon}>🏋️</span>
					<span className={styles.actionLabel}>View Classes</span>
					<span className={styles.actionSub}>Book a group class</span>
				</button>

				<button className={styles.actionCard} onClick={() => navigate('/register')}>
					<span className={styles.actionIcon}>➕</span>
					<span className={styles.actionLabel}>Register Student</span>
					<span className={styles.actionSub}>Add a new client</span>
				</button>
			</div>

			{/* Botão de Report */}
			<div className={styles.reportSection}>
				<div className={styles.reportCard}>
					<div className={styles.reportText}>
						<h2 className={styles.reportTitle}>Financial Report</h2>
						<p className={styles.reportSub}>
							Download the complete financial summary for your gym. Generated live by the backend.
						</p>
					</div>

					<a
						href={reportUrl}
						target="_blank"
						rel="noreferrer"
						className={styles.pdfBtn}
					>
						<span className={styles.pdfIcon}>📄</span>
						Download Financial Report (PDF)
					</a>
				</div>
			</div>
		</div>
	);
}