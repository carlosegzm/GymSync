import { useState, useEffect } from 'react';

// services
import membershipPlanService from '../../services/membershipPlanService';

// styles
import styles from './Plans.module.css';

function PlanRow({ plan }) {
    return (
        <div className={styles.row}>
            <span className={styles.rowName}>{plan.name}</span>
            <span className={styles.rowDuration}>{plan.durationInMonths} mo</span>
            <span className={styles.rowPrice}>R$ {Number(plan.price).toFixed(2)}</span>
        </div>
    );
}

/**
 * Plans management page (ADMIN only).
 * Lists existing plans and allows creating new ones.
 *
 * GET  /api/plans/gym/{gymId}
 * POST /api/plans  { name, price, durationInMonths, gymId }
 */
export default function Plans() {
    const gymId = localStorage.getItem('gymId');

    const [plans, setPlans]             = useState([]);
    const [loading, setLoading]         = useState(true);
    const [submitting, setSubmitting]   = useState(false);
    const [error, setError]             = useState('');
    const [success, setSuccess]         = useState('');

    // Form state
    const [name, setName]               = useState('');
    const [price, setPrice]             = useState('');
    const [duration, setDuration]       = useState('');

    useEffect(() => {
        if (!gymId) { setLoading(false); return; }
        membershipPlanService.listByGym(gymId)
            .then(setPlans)
            .catch(() => setError('Failed to load plans.'))
            .finally(() => setLoading(false));
    }, [gymId]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(''); setSuccess('');

        if (!name.trim())       { setError('Plan name is required.');       return; }
        if (!price || price <= 0) { setError('Price must be greater than 0.'); return; }
        if (!duration || duration < 1) { setError('Duration must be at least 1 month.'); return; }

        setSubmitting(true);
        try {
            const newPlan = await membershipPlanService.create({
                name,
                price: Number(price),
                durationInMonths: Number(duration),
                gymId,
            });
            setPlans((prev) => [...prev, newPlan]);
            setSuccess(`Plan "${newPlan.name}" created!`);
            setName(''); setPrice(''); setDuration('');
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to create plan.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Membership Plans</h1>
                <p className={styles.subtitle}>Create and manage your gym's plans.</p>
            </div>

            {/* Create form */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>New Plan</h2>
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <div className={styles.formRow}>
                        <div className={styles.field}>
                            <label className={styles.label}>Name</label>
                            <input
                                className={styles.input}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Monthly Basic"
                                disabled={submitting}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Price (R$)</label>
                            <input
                                className={styles.input}
                                type="number"
                                min="0"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="99.90"
                                disabled={submitting}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Duration (months)</label>
                            <input
                                className={styles.input}
                                type="number"
                                min="1"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                placeholder="1"
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    {error   && <div className={styles.error}   role="alert">{error}</div>}
                    {success && <div className={styles.success} role="status">{success}</div>}

                    <button type="submit" className={styles.submitBtn} disabled={submitting}>
                        {submitting ? <span className={styles.spinner} /> : '+ Create Plan'}
                    </button>
                </form>
            </section>

            {/* Plans list */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Existing Plans ({plans.length})</h2>
                {loading ? (
                    <p className={styles.loading}>Loading...</p>
                ) : plans.length === 0 ? (
                    <p className={styles.empty}>No plans yet. Create one above.</p>
                ) : (
                    <div className={styles.list}>
                        <div className={styles.listHeader}>
                            <span>Name</span>
                            <span>Duration</span>
                            <span>Price</span>
                        </div>
                        {plans.map((p) => <PlanRow key={p.id} plan={p} />)}
                    </div>
                )}
            </section>
        </div>
    );
}