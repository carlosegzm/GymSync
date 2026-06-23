import styles from '../../../../pages/DashBoard.module.css'

export default function MetricCard({ label, value, sub }) {
    return (
        <div className={styles.metricCard}>
            <p className={styles.metricLabel}>{label}</p>
            <p className={styles.metricValue}>{value ?? '—'}</p>
            {sub && <p className={styles.metricSub}>{sub}</p>}
        </div>
    );
}1