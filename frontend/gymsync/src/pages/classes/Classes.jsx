import { useState, useEffect } from 'react';

// hooks
import { useAuth } from '../../hooks/context/AuthContext';
import { useReportDownload } from '../../hooks/report/useReportDownload';

// services
import groupClassService from '../../services/groupClassService';
import classBookingService from '../../services/classBookingService';
import reportService from '../../services/reportService';

// utils
import { getRoleFromToken } from '../../utils/jwt';

// styles
import styles from './Classes.module.css';

// ─── Shared ────────────────────────────────────────────────────────────────────

const CLASS_TYPES = ['ZUMBA', 'AEROHIT', 'SPINNING', 'FITDANCE', 'JUMP'];

function formatDateTime(iso) {
    const d = new Date(iso);
    return {
        date: d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }),
        time: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
}

function ClassCard({ gc, action }) {
    const { date, time } = formatDateTime(gc.startDateTime);
    return (
        <div className={styles.card}>
            <div className={styles.cardTop}>
                <span className={styles.classType}>{gc.classType}</span>
                <span className={styles.capacity}>👥 {gc.maxCapacity} spots</span>
            </div>
            <h3 className={styles.className}>{gc.name}</h3>
            <div className={styles.cardMeta}>
                <span>📅 {date}</span>
                <span>🕐 {time}</span>
            </div>
            {action && <div className={styles.cardAction}>{action(gc)}</div>}
        </div>
    );
}

function TrainerClassCard({ gc }) {
    const { date, time } = formatDateTime(gc.startDateTime);

    const report = useReportDownload(
        () => reportService.getClassOccupancyReport(gc.id),
        `occupancy-class-${gc.id}.pdf`
    );

    return (
        <div className={styles.card}>
            <div className={styles.cardTop}>
                <span className={styles.classType}>{gc.classType}</span>
                <span className={styles.capacity}>👥 {gc.maxCapacity} spots</span>
            </div>
            <h3 className={styles.className}>{gc.name}</h3>
            <div className={styles.cardMeta}>
                <span>📅 {date}</span>
                <span>🕐 {time}</span>
            </div>
            <div className={styles.cardAction}>
                {report.error && <p className={styles.bookError}>{report.error}</p>}
                <button
                    className={styles.occupancyBtn}
                    onClick={report.download}
                    disabled={report.loading}
                >
                    {report.loading ? <span className={styles.spinner} /> : '📄'}
                    {report.loading ? 'Generating...' : 'Occupancy Report'}
                </button>
            </div>
        </div>
    );
}

// ─── Trainer view ──────────────────────────────────────────────────────────────

function TrainerClasses({ trainerId }) {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // form
    const [name, setName] = useState('');
    const [classType, setClassType] = useState(CLASS_TYPES[0]);
    const [startDateTime, setStartDateTime] = useState('');
    const [maxCapacity, setMaxCapacity] = useState('');

    useEffect(() => {
        groupClassService.listAll()
            .then((all) => setClasses(all.filter((c) => c.trainerId === trainerId)))
            .catch(() => setError('Failed to load classes.'))
            .finally(() => setLoading(false));
    }, [trainerId]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(''); setSuccess('');

        if (!name.trim()) { setError('Class name is required.'); return; }
        if (!startDateTime) { setError('Start date and time is required.'); return; }
        if (!maxCapacity || maxCapacity < 1) { setError('Capacity must be at least 1.'); return; }

        setSubmitting(true);
        try {
            const created = await groupClassService.create({
                name,
                classType,
                startDateTime: new Date(startDateTime).toISOString(),
                maxCapacity: Number(maxCapacity),
                trainerId,
            });
            setClasses((prev) => [created, ...prev]);
            setSuccess(`Class "${created.name}" created!`);
            setName(''); setStartDateTime(''); setMaxCapacity('');
            setClassType(CLASS_TYPES[0]);
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to create class.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>New Class</h2>
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <div className={styles.formRow}>
                        <div className={styles.field}>
                            <label className={styles.label}>Name</label>
                            <input
                                className={styles.input}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Evening Spinning"
                                disabled={submitting}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Type</label>
                            <select
                                className={styles.input}
                                value={classType}
                                onChange={(e) => setClassType(e.target.value)}
                                disabled={submitting}
                            >
                                {CLASS_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.field}>
                            <label className={styles.label}>Start date & time</label>
                            <input
                                className={styles.input}
                                type="datetime-local"
                                value={startDateTime}
                                onChange={(e) => setStartDateTime(e.target.value)}
                                disabled={submitting}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Max capacity</label>
                            <input
                                className={styles.input}
                                type="number"
                                min="1"
                                value={maxCapacity}
                                onChange={(e) => setMaxCapacity(e.target.value)}
                                placeholder="20"
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    {error && <div className={styles.error} role="alert">{error}</div>}
                    {success && <div className={styles.success} role="status">{success}</div>}

                    <button type="submit" className={styles.submitBtn} disabled={submitting}>
                        {submitting ? <span className={styles.spinner} /> : '+ Create Class'}
                    </button>
                </form>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Your Classes ({classes.length})</h2>
                {loading ? (
                    <p className={styles.loading}>Loading...</p>
                ) : classes.length === 0 ? (
                    <p className={styles.empty}>No classes yet. Create one above.</p>
                ) : (
                    <div className={styles.grid}>
                        {classes.map((gc) => <TrainerClassCard key={gc.id} gc={gc} />)}
                    </div>
                )}
            </section>
        </>
    );
}

// ─── Client view ───────────────────────────────────────────────────────────────

function ClientClasses({ clientId }) {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // bookingState: { [classId]: 'idle' | 'loading' | 'booked' | 'error:msg' }
    const [bookingState, setBookingState] = useState({});

    useEffect(() => {
        groupClassService.listAll()
            .then((data) => {
                setClasses(data);
                const initial = {};
                data.forEach((c) => { initial[c.id] = 'idle'; });
                setBookingState(initial);
            })
            .catch(() => setError('Failed to load classes.'))
            .finally(() => setLoading(false));
    }, []);

    async function handleBook(gc) {
        setBookingState((prev) => ({ ...prev, [gc.id]: 'loading' }));
        try {
            await classBookingService.create(clientId, gc.id);
            setBookingState((prev) => ({ ...prev, [gc.id]: 'booked' }));
        } catch (err) {
            const msg = err.response?.data?.message ?? 'Booking failed.';
            setBookingState((prev) => ({ ...prev, [gc.id]: `error:${msg}` }));
        }
    }

    if (loading) return <p className={styles.loading}>Loading classes...</p>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (classes.length === 0) return <p className={styles.empty}>No classes available.</p>;

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Available Classes ({classes.length})</h2>
            <div className={styles.grid}>
                {classes.map((gc) => {
                    const state = bookingState[gc.id] ?? 'idle';
                    const isBooked = state === 'booked';
                    const isLoading = state === 'loading';
                    const isError = state.startsWith('error:');
                    const errorMsg = isError ? state.replace('error:', '') : '';

                    return (
                        <ClassCard
                            key={gc.id}
                            gc={gc}
                            action={() => (
                                <div className={styles.bookWrapper}>
                                    {isError && <p className={styles.bookError}>{errorMsg}</p>}
                                    <button
                                        className={[
                                            styles.bookBtn,
                                            isBooked ? styles.bookBtnBooked : '',
                                            isLoading ? styles.bookBtnLoading : '',
                                        ].join(' ')}
                                        onClick={() => handleBook(gc)}
                                        disabled={isBooked || isLoading}
                                    >
                                        {isLoading && <span className={styles.spinner} />}
                                        {isBooked ? '✓ Booked!' : 'Book now'}
                                    </button>
                                </div>
                            )}
                        />
                    );
                })}
            </div>
        </section>
    );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

/**
 * Classes page — role-conditional rendering.
 * TRAINER: creates and manages their own group classes.
 * CLIENT:  browses all available classes and books a spot.
 *
 * Business rule enforced: if the class is full, the backend returns an error
 * that is displayed inline on the card without crashing the page.
 */
export default function Classes() {
    const { user } = useAuth();
    const role = getRoleFromToken();

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Group Classes</h1>
                <p className={styles.subtitle}>
                    {role === 'TRAINER'
                        ? 'Create and manage your group classes.'
                        : 'Browse and book available classes.'}
                </p>
            </div>

            {role === 'TRAINER' && <TrainerClasses trainerId={user?.id} />}
            {role === 'CLIENT' && <ClientClasses clientId={user?.id} />}
        </div>
    );
}