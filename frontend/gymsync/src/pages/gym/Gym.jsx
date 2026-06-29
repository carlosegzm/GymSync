import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// hooks
import { useAuth } from '../../hooks/context/AuthContext';

// services
import gymService from '../../services/gymService';

// styles 
import styles from './Gym.module.css';

/**
 * Gym registration page (ADMIN only).
 * Creates a new gym unit and saves the returned gymId to localStorage,
 * making it available for all other pages immediately.
 *
 * POST /api/gyms { name, cnpj }
 */
export default function Gym() {
    const { t } = useTranslation();
    const { updateUser } = useAuth();

    const [name, setName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [created, setCreated] = useState(null);

    function formatCnpj(value) {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .slice(0, 18);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        const rawCnpj = cnpj.replace(/\D/g, '');
        if (!name.trim()) { setError(t('gym.nameRequired')); return; }
        if (rawCnpj.length !== 14) { setError(t('gym.cnpjInvalid')); return; }

        setSubmitting(true);
        try {
            const gym = await gymService.create({ name, cnpj: rawCnpj });

            // Persist gymId so all other pages can use it immediately
            localStorage.setItem('gymId', gym.id);
            setCreated(gym);
            setName(''); setCnpj('');
        } catch (err) {
            setError(err.response?.data?.message ?? t('gym.createFailed'));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('gym.title')}</h1>
                <p className={styles.subtitle}>{t('gym.subtitle')}</p>
            </div>

            {/* Current gymId info */}
            {localStorage.getItem('gymId') && !created && (
                <div className={styles.infoCard}>
                    <p className={styles.infoLabel}>{t('gym.activeGymId')}</p>
                    <p className={styles.infoValue}>{localStorage.getItem('gymId')}</p>
                    <p className={styles.infoHint}>{t('gym.activeGymWarning')}</p>
                </div>
            )}

            {/* Success state */}
            {created ? (
                <div className={styles.successCard}>
                    <p className={styles.successIcon}>🏋️</p>
                    <h2 className={styles.successTitle}>{created.name}</h2>
                    <p className={styles.successSub}>{t('gym.created')}</p>
                    <div className={styles.successMeta}>
                        <span className={styles.metaItem}><b>ID:</b> {created.id}</span>
                        <span className={styles.metaItem}><b>CNPJ:</b> {created.cnpj}</span>
                    </div>
                    <button
                        className={styles.resetBtn}
                        onClick={() => setCreated(null)}
                    >
                        {t('gym.registerAnother')}
                    </button>
                </div>
            ) : (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('gym.newGym')}</h2>
                    <form className={styles.form} onSubmit={handleSubmit} noValidate>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('gym.gymName')}</label>
                            <input
                                className={styles.input}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('gym.gymNamePlaceholder')}
                                disabled={submitting}
                                autoFocus
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('gym.cnpj')}</label>
                            <input
                                className={styles.input}
                                value={cnpj}
                                onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                                placeholder="00.000.000/0000-00"
                                disabled={submitting}
                                maxLength={18}
                            />
                        </div>

                        {error && <div className={styles.error} role="alert">{error}</div>}

                        <button type="submit" className={styles.submitBtn} disabled={submitting}>
                            {submitting ? <span className={styles.spinner} /> : t('gym.createGym')}
                        </button>
                    </form>
                </section>
            )}
        </div>
    );
}