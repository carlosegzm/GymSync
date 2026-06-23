import { useNavigate } from 'react-router-dom';

// components
import ActionCard from '../cards/ActionCard';

// styles
import styles from '../../../../pages/DashBoard.module.css'

export default function TrainerSection({ user }) {
    const navigate = useNavigate();
    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Tools</h2>
            <div className={styles.actionsGrid}>
                <ActionCard
                    icon="📅" label="My Schedule"
                    sub="Manage your timeslots"
                    onClick={() => navigate('/timeslots')}
                />
                <ActionCard
                    icon="🏋️" label="Group Classes"
                    sub="Create and manage classes"
                    onClick={() => navigate('/classes')}
                />
                <ActionCard
                    icon="📊" label="Assessments"
                    sub="Register physical evaluations"
                    onClick={() => navigate('/assessments')}
                />
            </div>
        </section>
    );
}