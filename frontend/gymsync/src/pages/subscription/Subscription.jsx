import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// context
import { useAuth } from '../../hooks/context/AuthContext';

// services
import membershipPlanService from '../../services/membershipPlanService'
import clientSubscriptionService from '../../services/clientSubscriptionService'

// components
import ActiveSubscriptionCard from '../../components/subscription/cards/ActiveSubscriptionCard'
import PlanCard from '../../components/subscription/cards/PlanCard';

// styles
import styles from './Subscription.module.css';

/**
 * Subscription page (CLIENT only).
 * Lists available plans and the client's active subscription.
 *
 * GET  /api/plans/gym/{gymId}
 * PATCH /api/subscriptions/{id}/cancel
 */
export default function Subscription() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const gymId = localStorage.getItem('gymId');

    const [plans, setPlans] = useState([]);
    const [subscription, setSubscription] = useState(null);
    const [cancelling, setCancelling] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loadingSub, setLoadingSub] = useState(true);
    const [noActivePlan, setNoActivePlan] = useState(false);

    useEffect(() => {
        clientSubscriptionService.getMySubscription()
            .then((data) => {
                setSubscription(data);
                setNoActivePlan(false);
            })
            .catch((err) => {
                if (err.response?.status === 404) {
                    setNoActivePlan(true); // ← sem plano, não é um erro real
                } else {
                    setError(t('subscription.loadFailed'));
                }
            })
            .finally(() => setLoadingSub(false));
    }, [t]);

    async function handleCancel(subscriptionId) {
        setError(''); setSuccess('');
        setCancelling(true);
        try {
            await clientSubscriptionService.cancelSubscription(subscriptionId);
            setSubscription((prev) => ({ ...prev, status: 'CANCELLED' }));
            setSuccess(t('subscription.cancelSuccess'));
        } catch (err) {
            setError(err.response?.data?.message ?? t('subscription.cancelFailed'));
        } finally {
            setCancelling(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('subscription.title')}</h1>
                <p className={styles.subtitle}>{t('subscription.subtitle')}</p>
            </div>

            {error && <div className={styles.error} role="alert">{error}</div>}
            {success && <div className={styles.success} role="status">{success}</div>}

            {/* Active subscription */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('subscription.activePlan')}</h2>

                {loadingSub ? (
                    <p className={styles.loading}>{t('common.loading')}</p>
                ) : noActivePlan ? (
                    <div className={styles.emptyPlan}>
                        <p className={styles.emptyPlanIcon}>📋</p>
                        <p className={styles.emptyPlanTitle}>{t('subscription.noActivePlan')}</p>
                        <p className={styles.emptyPlanSub}>
                            {t('subscription.noActivePlanSub')}
                        </p>
                    </div>
                ) : subscription ? (
                    <ActiveSubscriptionCard
                        subscription={subscription}
                        onCancel={handleCancel}
                        loading={cancelling}
                    />
                ) : null}
            </section>
        </div>
    );
}