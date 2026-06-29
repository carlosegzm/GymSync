import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// components
import ActionCard from '../cards/ActionCard';

// styles
import styles from '../../../pages/DashBoard.module.css'

export default function TrainerSection({ user }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('dashboard.trainerTools')}</h2>
            <div className={styles.actionsGrid}>
                <ActionCard
                    icon="📅" 
                    label={t('dashboard.mySchedule')}
                    sub={t('dashboard.manageTimeslots')}
                    onClick={() => navigate('/timeslots')}
                />
                <ActionCard
                    icon="🏋️" 
                    label={t('dashboard.groupClasses')}
                    sub={t('dashboard.createManageClasses')}
                    onClick={() => navigate('/classes')}
                />
                <ActionCard
                    icon="📊" 
                    label={t('dashboard.assessments')}
                    sub={t('dashboard.registerEvaluations')}
                    onClick={() => navigate('/assessments')}
                />
            </div>
        </section>
    );
}