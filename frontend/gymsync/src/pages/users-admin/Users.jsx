import { useState, useEffect } from 'react';

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
                    : 'Remove'
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
            .catch(() => setEnrollError('Failed to load plans.'))
            .finally(() => setLoadingPlans(false));
    }, [gymId]);

    async function handleSearch(e) {
        e.preventDefault();
        setError(''); setSuccess(''); setFoundUser(null);

        if (!searchEmail.trim()) { setError('Please enter an email.'); return; }

        setSearching(true);
        try {
            const user = await authService.getUserByEmail(searchEmail.trim());
            setFoundUser(user);
        } catch {
            setError('No user found with this email.');
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
            setSuccess(`${foundUser.name} (${foundUser.role}) linked successfully!`);

            // Adiciona na lista local da sessão
            setLinkedUsers((prev) => [...prev, foundUser]);

            setFoundUser(null);
            setSearchEmail('');
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to link user.');
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
            setSuccess('User unlinked from gym successfully.');
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to unlink user.');
        } finally {
            setUnlinkingId(null);
        }
    }

    async function handleEnroll(e) {
        e.preventDefault();
        setEnrollError(''); setEnrollSuccess('');

        if (!selectedClient) { setEnrollError('Select a client.'); return; }
        if (!selectedPlan) { setEnrollError('Select a plan.'); return; }

        setEnrolling(true);
        try {
            await clientSubscriptionService.enroll({
                clientId: selectedClient, 
                planId: selectedPlan
            });
            
            setEnrollSuccess('Client enrolled successfully!');
            setSelectedClient('');
            setSelectedPlan('');
        } catch (err) {
            setEnrollError(err.response?.data?.message ?? 'Failed to enroll client.');
        } finally {
            setEnrolling(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Users</h1>
                <p className={styles.subtitle}>Manage trainers and clients linked to your gym.</p>
            </div>

            {/* Link a new user */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Link User to Gym</h2>
                <p className={styles.hint}>
                    Search a registered user by email and link them to your gym.
                </p>

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
                        {searching ? <span className={styles.spinner} /> : 'Search'}
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
                            {linking ? <span className={styles.spinner} /> : 'Link to gym'}
                        </button>
                    </div>
                )}

                {error && <div className={styles.error} role="alert">{error}</div>}
                {success && <div className={styles.success} role="status">{success}</div>}
            </section>

            {/* Trainers */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Trainers ({trainers.length})</h2>
                {loadingTrainers ? (
                    <p className={styles.loading}>Loading...</p>
                ) : trainersError ? (
                    <div className={styles.error}>{trainersError}</div>
                ) : trainers.length === 0 ? (
                    <p className={styles.empty}>No trainers linked yet.</p>
                ) : (
                    <div className={styles.list}>
                        <div className={styles.listHeader}>
                            <span>Name</span><span>Email</span><span>Role</span>
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
                <h2 className={styles.sectionTitle}>Clients ({clients.length})</h2>
                {loadingClients ? (
                    <p className={styles.loading}>Loading...</p>
                ) : clientsError ? (
                    <div className={styles.error}>{clientsError}</div>
                ) : clients.length === 0 ? (
                    <p className={styles.empty}>No clients linked yet.</p>
                ) : (
                    <div className={styles.list}>
                        <div className={styles.listHeader}>
                            <span>Name</span><span>Email</span><span>Role</span>
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

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Enroll Client in Plan</h2>
                <p className={styles.hint}>
                    Select a linked client and assign them to a membership plan.
                </p>

                <form className={styles.enrollForm} onSubmit={handleEnroll} noValidate>
                    <div className={styles.field}>
                        <label className={styles.label}>Client</label>
                        <select
                            className={styles.select}
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            disabled={enrolling || loadingClients}
                        >
                            <option value="">— Select a client —</option>
                            {[...clients, ...linkedUsers.filter((u) => u.role === 'CLIENT')]
                                .filter((u) => !unlinkedIds.has(u.id))
                                .map((u) => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Plan</label>
                        <select
                            className={styles.select}
                            value={selectedPlan}
                            onChange={(e) => setSelectedPlan(e.target.value)}
                            disabled={enrolling || loadingPlans}
                        >
                            <option value="">— Select a plan —</option>
                            {plans.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} — R$ {Number(p.price).toFixed(2)} / {p.durationInMonths} mo
                                </option>
                            ))}
                        </select>
                    </div>

                    {enrollError && <div className={styles.error} role="alert">{enrollError}</div>}
                    {enrollSuccess && <div className={styles.success} role="status">{enrollSuccess}</div>}

                    <button type="submit" className={styles.submitBtn} disabled={enrolling || loadingPlans}>
                        {enrolling ? <span className={styles.spinner} /> : 'Enroll Client'}
                    </button>
                </form>
            </section>
        </div>
    );
}