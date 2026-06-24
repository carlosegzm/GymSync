import styles from '../../../pages/DashBoard.module.css'

export default function ActionCard({ icon, label, sub, onClick }) {
    return (
        <button className={styles.actionCard} onClick={onClick}>
            <span className={styles.actionIcon}>{icon}</span>
            <span className={styles.actionLabel}>{label}</span>
            <span className={styles.actionSub}>{sub}</span>
        </button>
    );
}