import { useState, useEffect } from 'react';

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
 * POST /api/subscriptions/enroll   { clientId, planId }
 * PATCH /api/subscriptions/{id}/cancel
 */
export default function Subscription() {
    const { user } = useAuth();
    const gymId = localStorage.getItem('gymId');

    const [plans, setPlans] = useState([]);
    const [subscription, setSubscription] = useState(null);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [enrollingId, setEnrollingId] = useState(null);
    const [cancelling, setCancelling] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!gymId) { setLoadingPlans(false); return; }
        membershipPlanService.listByGym(gymId)
            .then(setPlans)
            .catch(() => setError('Failed to load plans.'))
            .finally(() => setLoadingPlans(false));
    }, [gymId]);

    async function handleEnroll(planId) {
        setError(''); setSuccess('');
        setEnrollingId(planId);
        try {
            const sub = await clientSubscriptionService.enroll({
                clientId: user.id,
                planId
            });
            setSubscription(sub);
            setSuccess('Enrolled successfully!');
        } catch (err) {
            setError(err.response?.data?.message ?? 'Enrollment failed.');
        } finally {
            setEnrollingId(null);
        }
    }

    async function handleCancel(subscriptionId) {
        setError(''); setSuccess('');
        setCancelling(true);
        try {
            await clientSubscriptionService.cancelSubscription(subscriptionId);
            setSubscription((prev) => ({ ...prev, status: 'CANCELLED' }));
            setSuccess('Subscription cancelled.');
        } catch (err) {
            setError(err.response?.data?.message ?? 'Cancellation failed.');
        } finally {
            setCancelling(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Subscription</h1>
                <p className={styles.subtitle}>Manage your membership plan.</p>
            </div>

            {error && <div className={styles.error} role="alert">{error}</div>}
            {success && <div className={styles.success} role="status">{success}</div>}

            {/* Active subscription */}
            {subscription && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Active Plan</h2>
                    <ActiveSubscriptionCard
                        subscription={subscription}
                        onCancel={handleCancel}
                        loading={cancelling}
                    />
                </section>
            )}

            {/* Available plans */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Available Plans</h2>
                {loadingPlans ? (
                    <p className={styles.loading}>Loading plans...</p>
                ) : plans.length === 0 ? (
                    <p className={styles.empty}>No plans available.</p>
                ) : (
                    <div className={styles.plansGrid}>
                        {plans.map((plan) => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                onEnroll={handleEnroll}
                                loading={enrollingId === plan.id}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}