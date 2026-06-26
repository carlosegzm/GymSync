import styles from '../../../pages/subscription/Subscription.module.css';

export default function PlanCard({ plan, onEnroll, loading }) {
    return (
        <div className={styles.planCard}>
            <div className={styles.planHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <span className={styles.planPrice}>
                    R$ {Number(plan.price).toFixed(2)}
                    <span className={styles.planPer}>/ mo</span>
                </span>
            </div>
            <p className={styles.planDuration}>
                {plan.durationInMonths} month{plan.durationInMonths !== 1 ? 's' : ''}
            </p>
            <button
                className={styles.enrollBtn}
                onClick={() => onEnroll(plan.id)}
                disabled={loading}
            >
                {loading ? <span className={styles.spinner} /> : 'Enroll'}
            </button>
        </div>
    );
}