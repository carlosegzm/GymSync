import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// services 
import authService from '../../services/authService';
import clientSubscriptionService from '../../services/clientSubscriptionService';
import membershipPlanService from '../../services/membershipPlanService';

// hooks
import { useGymUsers } from '../../hooks/users/useGymUsers';

// components 
import UserSelect from '../../components/commom/userselect/UserSelect';

// styles
import styles from './Users.module.css';

function UserRow({ user, onUnlink, unlinkingId }) {
    const { t } = useTranslation();
    const isUnlinking = unlinkingId === user.id;

    return (
        <div className={styles.row}>
            <span className={styles.rowName}>{user.name}</span>
            <span className={styles.rowEmail}>{user.email}</span>
            <span className={styles.rowRole}>{user.role}</span>
            <button
                className={styles.unlinkBtn}
                onClick={() => onUnlink(user.id)}
                disabled={isUnlinking}
            >
                {isUnlinking
                    ? <span className={styles.spinnerSm} />
                    : t('users.remove')
                }
            </button>
        </div>
    );
}

/**
 * Users management page (ADMIN only).
 * Links trainers and clients to the gym via PATCH /api/users/{userId}/gym/{gymId}
 */
export default function Users() {
    const { t, i18n } = useTranslation();
    const gymId = localStorage.getItem('gymId');

    const { users: clients, loading: loadingClients, error: clientsError } = useGymUsers('clients');
    const { users: trainers, loading: loadingTrainers, error: trainersError } = useGymUsers('trainers');

    const [selectedUser, setSelectedUser] = useState(null);
    const [searchEmail, setSearchEmail] = useState('');
    const [foundUser, setFoundUser] = useState(null);
    const [searching, setSearching] = useState(false);
    const [linking, setLinking] = useState(false);
    const [unlinkingId, setUnlinkingId] = useState(null);
    const [unlinkedIds, setUnlinkedIds] = useState(new Set());
    const [linkedUsers, setLinkedUsers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [plans, setPlans] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [selectedClient, setSelectedClient] = useState('');   // clientId
    const [selectedPlan, setSelectedPlan] = useState('');   // planId
    const [enrolling, setEnrolling] = useState(false);
    const [enrollError, setEnrollError] = useState('');
    const [enrollSuccess, setEnrollSuccess] = useState('');

    useEffect(() => {
        if (!gymId) { setLoadingPlans(false); return; }
        membershipPlanService.listByGym(gymId)
            .then(setPlans)
            .catch(() => setEnrollError(t('subscription.loadFailed'))) // Reutilizado fallback global ou tratar local
            .finally(() => setLoadingPlans(false));
    }, [gymId, t]);

    async function handleSearch(e) {
        e.preventDefault();
        setError(''); setSuccess(''); setFoundUser(null);

        if (!searchEmail.trim()) { setError(t('users.searchEmail')); return; }

        setSearching(true);
        try {
            const user = await authService.getUserByEmail(searchEmail.trim());
            setFoundUser(user);
        } catch {
            setError(t('users.userNotFound'));
        } finally {
            setSearching(false);
        }
    }

    async function handleLink() {
        setError(''); setSuccess('');
        if (!foundUser || !gymId) return;

        setLinking(true);
        try {
            await authService.linkUserToGym(foundUser.id, gymId);
            setSuccess(t('users.linkedSuccess', { name: foundUser.name, role: foundUser.role }));

            // Adiciona na lista local da sessão
            setLinkedUsers((prev) => [...prev, foundUser]);

            setFoundUser(null);
            setSearchEmail('');
        } catch (err) {
            setError(err.response?.data?.message ?? t('users.linkFailed'));
        } finally {
            setLinking(false);
        }
    }

    async function handleUnlink(userId) {
        setError(''); setSuccess('');
        setUnlinkingId(userId);
        try {
            await authService.unlinkUserFromGym(userId);
            setUnlinkedIds((prev) => new Set([...prev, userId]));
            setSuccess(t('users.unlinkedSuccess'));
        } catch (err) {
            setError(err.response?.data?.message ?? t('users.unlinkFailed'));
        } finally {
            setUnlinkingId(null);
        }
    }

    async function handleEnroll(e) {
        e.preventDefault();
        setEnrollError(''); setEnrollSuccess('');

        if (!selectedClient) { setEnrollError(t('users.selectClient')); return; }
        if (!selectedPlan) { setEnrollError(t('users.selectPlan')); return; }

        setEnrolling(true);
        try {
            await clientSubscriptionService.enroll({
                clientId: selectedClient,
                planId: selectedPlan
            });

            setEnrollSuccess(t('users.enrollSuccess'));
            setSelectedClient('');
            setSelectedPlan('');
        } catch (err) {
            setEnrollError(err.response?.data?.message ?? t('users.enrollFailed'));
        } finally {
            setEnrolling(false);
        }
    }

    const currentLanguage = i18n.language || 'pt-BR';

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('users.title')}</h1>
                <p className={styles.subtitle}>{t('users.subtitle')}</p>
            </div>

            {/* Link a new user */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('users.linkUser')}</h2>
                <p className={styles.hint}>{t('users.linkHint')}</p>

                <form className={styles.linkForm} onSubmit={handleSearch} noValidate>
                    <input
                        className={styles.input}
                        type="email"
                        value={searchEmail}
                        onChange={(e) => { setSearchEmail(e.target.value); setFoundUser(null); }}
                        placeholder="user@email.com"
                        disabled={searching || linking}
                    />
                    <button type="submit" className={styles.linkBtn} disabled={searching || linking}>
                        {searching ? <span className={styles.spinner} /> : t('users.search')}
                    </button>
                </form>

                {/* Preview do usuário encontrado */}
                {foundUser && (
                    <div className={styles.foundCard}>
                        <div className={styles.foundInfo}>
                            <span className={styles.foundName}>{foundUser.name}</span>
                            <span className={styles.foundMeta}>{foundUser.email} · {foundUser.role}</span>
                        </div>
                        <button
                            className={styles.confirmBtn}
                            onClick={handleLink}
                            disabled={linking}
                        >
                            {linking ? <span className={styles.spinner} /> : t('users.linkToGym')}
                        </button>
                    </div>
                )}

                {error && <div className={styles.error} role="alert">{error}</div>}
                {success && <div className={styles.success} role="status">{success}</div>}
            </section>

            {/* Trainers */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('users.trainers')} ({trainers.length})</h2>
                {loadingTrainers ? (
                    <p className={styles.loading}>{t('common.loading')}</p>
                ) : trainersError ? (
                    <div className={styles.error}>{trainersError}</div>
                ) : trainers.length === 0 ? (
                    <p className={styles.empty}>{t('users.noTrainers')}</p>
                ) : (
                    <div className={styles.list}>
                        <div className={styles.listHeader}>
                            <span>{t('common.name')}</span><span>{t('common.email')}</span><span>{t('common.role')}</span>
                        </div>
                        {[...trainers, ...linkedUsers.filter((u) => u.role === 'TRAINER')]
                            .filter((u) => !unlinkedIds.has(u.id))
                            .map((u) => (
                                <UserRow key={u.id} user={u} onUnlink={handleUnlink} unlinkingId={unlinkingId} />
                            ))
                        }
                    </div>
                )}
            </section>

            {/* Clients */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('users.clients')} ({clients.length})</h2>
                {loadingClients ? (
                    <p className={styles.loading}>{t('common.loading')}</p>
                ) : clientsError ? (
                    <div className={styles.error}>{clientsError}</div>
                ) : clients.length === 0 ? (
                    <p className={styles.empty}>{t('users.noClients')}</p>
                ) : (
                    <div className={styles.list}>
                        <div className={styles.listHeader}>
                            <span>{t('common.name')}</span><span>{t('common.email')}</span><span>{t('common.role')}</span>
                        </div>
                        {[...clients, ...linkedUsers.filter((u) => u.role === 'CLIENT')]
                            .filter((u) => !unlinkedIds.has(u.id))
                            .map((u) => (
                                <UserRow key={u.id} user={u} onUnlink={handleUnlink} unlinkingId={unlinkingId} />
                            ))
                        }
                    </div>
                )}
            </section>

            {/* Enroll Client */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('users.enrollTitle')}</h2>
                <p className={styles.hint}>{t('users.enrollHint')}</p>

                <form className={styles.enrollForm} onSubmit={handleEnroll} noValidate>
                    <div className={styles.field}>
                        <label className={styles.label}>{t('users.clients')}</label>
                        <select
                            className={styles.select}
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            disabled={enrolling || loadingClients}
                        >
                            <option value="">{t('users.selectClient')}</option>
                            {[...clients, ...linkedUsers.filter((u) => u.role === 'CLIENT')]
                                .filter((u) => !unlinkedIds.has(u.id))
                                .map((u) => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>{t('subscription.availablePlans')}</label>
                        <select
                            className={styles.select}
                            value={selectedPlan}
                            onChange={(e) => setSelectedPlan(e.target.value)}
                            disabled={enrolling || loadingPlans}
                        >
                            <option value="">{t('users.selectPlan')}</option>
                            {plans.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} — {Number(p.price).toLocaleString(currentLanguage, { style: 'currency', currency: currentLanguage === 'pt-BR' ? 'BRL' : 'USD' })} / {p.durationInMonths} {t('subscription.months')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {enrollError && <div className={styles.error} role="alert">{enrollError}</div>}
                    {enrollSuccess && <div className={styles.success} role="status">{enrollSuccess}</div>}

                    <button type="submit" className={styles.submitBtn} disabled={enrolling || loadingPlans}>
                        {enrolling ? <span className={styles.spinner} /> : t('users.enrollBtn')}
                    </button>
                </form>
            </section>
        </div>
    );
}