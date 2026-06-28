import { useState } from 'react';
import authService from '../../services/authService';
import styles from './Users.module.css';
import { useGymUsers } from '../../hooks/users/useGymUsers';
import UserSelect from '../../components/commom/userselect/UserSelect';

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
        </div>
    );
}