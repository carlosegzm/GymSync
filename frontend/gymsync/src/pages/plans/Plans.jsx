import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// services
import membershipPlanService from '../../services/membershipPlanService';

// styles
import styles from './Plans.module.css';

function PlanRow({ plan }) {
    const { t } = useTranslation();
    return (
        <div className={styles.row}>
            <span className={styles.rowName}>{plan.name}</span>
            <span className={styles.rowDuration}>{plan.durationInMonths} {t('plans.duration').toLowerCase().includes('mes') || t('plans.duration').toLowerCase().includes('mês') ? 'meses' : 'mo'}</span>
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
    const { t } = useTranslation();
    const gymId = localStorage.getItem('gymId');

    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');

    useEffect(() => {
        if (!gymId) { setLoading(false); return; }
        membershipPlanService.listByGym(gymId)
            .then(setPlans)
            .catch(() => setError(t('plans.loadFailed')))
            .finally(() => setLoading(false));
    }, [gymId, t]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(''); setSuccess('');

        if (!name.trim()) { setError(t('plans.nameRequired')); return; }
        if (!price || price <= 0) { setError(t('plans.priceRequired')); return; }
        if (!duration || duration < 1) { setError(t('plans.durationRequired')); return; }

        setSubmitting(true);
        try {
            const newPlan = await membershipPlanService.create({
                name,
                price: Number(price),
                durationInMonths: Number(duration),
                gymId,
            });
            setPlans((prev) => [...prev, newPlan]);
            setSuccess(t('plans.created', { name: newPlan.name }));
            setName(''); setPrice(''); setDuration('');
        } catch (err) {
            setError(err.response?.data?.message ?? t('plans.createFailed'));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('plans.title')}</h1>
                <p className={styles.subtitle}>{t('plans.subtitle')}</p>
            </div>

            {/* Create form */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('plans.newPlan')}</h2>
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <div className={styles.formRow}>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('plans.name')}</label>
                            <input
                                className={styles.input}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Monthly Basic"
                                disabled={submitting}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('plans.price')}</label>
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
                            <label className={styles.label}>{t('plans.duration')}</label>
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

                    {error && <div className={styles.error} role="alert">{error}</div>}
                    {success && <div className={styles.success} role="status">{success}</div>}

                    <button type="submit" className={styles.submitBtn} disabled={submitting}>
                        {submitting ? <span className={styles.spinner} /> : t('plans.createPlan')}
                    </button>
                </form>
            </section>

            {/* Plans list */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    {t('plans.existingPlans')} ({plans.length})
                </h2>
                {loading ? (
                    <p className={styles.loading}>{t('common.loading')}</p>
                ) : plans.length === 0 ? (
                    <p className={styles.empty}>{t('plans.noPlans')}</p>
                ) : (
                    <div className={styles.list}>
                        <div className={styles.listHeader}>
                            <span>{t('plans.name')}</span>
                            <span>{t('plans.duration')}</span>
                            <span>{t('plans.price')}</span>
                        </div>
                        {plans.map((p) => <PlanRow key={p.id} plan={p} />)}
                    </div>
                )}
            </section>
        </div>
    );
}