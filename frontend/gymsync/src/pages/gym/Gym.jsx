import { useState } from 'react';
import { useAuth } from '../../hooks/context/AuthContext';
import gymService from '../../services/gymService';
import styles from './Gym.module.css';

/**
 * Gym registration page (ADMIN only).
 * Creates a new gym unit and saves the returned gymId to localStorage,
 * making it available for all other pages immediately.
 *
 * POST /api/gyms { name, cnpj }
 */
export default function Gym() {
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
        if (!name.trim()) { setError('Gym name is required.'); return; }
        if (rawCnpj.length !== 14) { setError('Please enter a valid CNPJ.'); return; }

        setSubmitting(true);
        try {
            const gym = await gymService.create({ name, cnpj: rawCnpj });

            // Persist gymId so all other pages can use it immediately
            localStorage.setItem('gymId', gym.id);
            setCreated(gym);
            setName(''); setCnpj('');
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to create gym.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Gym Setup</h1>
                <p className={styles.subtitle}>Register your gym unit to unlock all features.</p>
            </div>

            {/* Current gymId info */}
            {localStorage.getItem('gymId') && !created && (
                <div className={styles.infoCard}>
                    <p className={styles.infoLabel}>Active Gym ID</p>
                    <p className={styles.infoValue}>{localStorage.getItem('gymId')}</p>
                    <p className={styles.infoHint}>A gym is already linked to this session. Creating a new one will replace it.</p>
                </div>
            )}

            {/* Success state */}
            {created ? (
                <div className={styles.successCard}>
                    <p className={styles.successIcon}>🏋️</p>
                    <h2 className={styles.successTitle}>{created.name}</h2>
                    <p className={styles.successSub}>Gym created and linked to your session.</p>
                    <div className={styles.successMeta}>
                        <span className={styles.metaItem}><b>ID:</b> {created.id}</span>
                        <span className={styles.metaItem}><b>CNPJ:</b> {created.cnpj}</span>
                    </div>
                    <button
                        className={styles.resetBtn}
                        onClick={() => setCreated(null)}
                    >
                        Register another gym
                    </button>
                </div>
            ) : (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>New Gym</h2>
                    <form className={styles.form} onSubmit={handleSubmit} noValidate>
                        <div className={styles.field}>
                            <label className={styles.label}>Gym name</label>
                            <input
                                className={styles.input}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. GymSync Fitness"
                                disabled={submitting}
                                autoFocus
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>CNPJ</label>
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
                            {submitting ? <span className={styles.spinner} /> : 'Create Gym'}
                        </button>
                    </form>
                </section>
            )}
        </div>
    );
}