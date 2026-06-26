import styles from '../../../pages/subscription/Subscription.module.css';

export default function ActiveSubscriptionCard({ subscription, onCancel, loading }) {
    const statusColor = {
        ACTIVE:   'var(--success)',
        EXPIRED:  'var(--danger)',
        CANCELLED:'var(--text-muted)',
    };

    return (
        <div className={styles.activeCard}>
            <div className={styles.activeHeader}>
                <div>
                    <p className={styles.activeLabel}>Current Plan</p>
                    <p className={styles.activePlanId}>{subscription.planId}</p>
                </div>
                <span
                    className={styles.statusBadge}
                    style={{ color: statusColor[subscription.status] ?? 'var(--text-secondary)' }}
                >
                    {subscription.status}
                </span>
            </div>

            <div className={styles.activeDates}>
                <div>
                    <p className={styles.dateLabel}>Start</p>
                    <p className={styles.dateValue}>{subscription.startDate}</p>
                </div>
                <div>
                    <p className={styles.dateLabel}>Expires</p>
                    <p className={styles.dateValue}>{subscription.endDate}</p>
                </div>
            </div>

            {subscription.status === 'ACTIVE' && (
                <button
                    className={styles.cancelBtn}
                    onClick={() => onCancel(subscription.id)}
                    disabled={loading}
                >
                    {loading ? <span className={styles.spinner} /> : 'Cancel subscription'}
                </button>
            )}
        </div>
    );
}