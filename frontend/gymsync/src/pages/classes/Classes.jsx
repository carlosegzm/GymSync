import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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

// ===== Shared =====

const CLASS_TYPES = ['ZUMBA', 'AEROHIT', 'SPINNING', 'FITDANCE', 'JUMP'];

function formatDateTime(iso, lng) {
    const d = new Date(iso);
    return {
        // Utiliza o idioma atual do i18n dinamicamente
        date: d.toLocaleDateString(lng, { weekday: 'short', day: '2-digit', month: 'short' }),
        time: d.toLocaleTimeString(lng, { hour: '2-digit', minute: '2-digit' }),
    };
}

function ClassCard({ gc, action }) {
    const { i18n, t } = useTranslation();
    const { date, time } = formatDateTime(gc.startDateTime, i18n.language);
    return (
        <div className={styles.card}>
            <div className={styles.cardTop}>
                <span className={styles.classType}>{gc.classType}</span>
                <span className={styles.capacity}>👥 {gc.maxCapacity} {t('classes.spots')}</span>
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
    const { i18n, t } = useTranslation();
    const { date, time } = formatDateTime(gc.startDateTime, i18n.language);

    const report = useReportDownload(
        () => reportService.getClassOccupancyReport(gc.id),
        `occupancy-class-${gc.id}.pdf`
    );

    return (
        <div className={styles.card}>
            <div className={styles.cardTop}>
                <span className={styles.classType}>{gc.classType}</span>
                <span className={styles.capacity}>👥 {gc.maxCapacity} {t('classes.spots')}</span>
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
                    {report.loading ? <span className={styles.spinner} /> : '📄 '}
                    {report.loading ? t('common.loading') : t('classes.occupancyReport')}
                </button>
            </div>
        </div>
    );
}

// ===== Trainer view =====

function TrainerClasses({ trainerId }) {
    const { t } = useTranslation();
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
        groupClassService.listMyClassesAsTrainer()
            .then((data) => setClasses(data))
            .catch(() => setError(t('classes.loadFailed')))
            .finally(() => setLoading(false));
    }, [trainerId, t]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(''); setSuccess('');

        if (!name.trim()) { setError(t('classes.nameRequired')); return; }
        if (!startDateTime) { setError(t('classes.dateRequired')); return; }
        if (!maxCapacity || maxCapacity < 1) { setError(t('classes.capacityMin')); return; }

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
            setSuccess(t('classes.created', { name: created.name }));
            setName(''); setStartDateTime(''); setMaxCapacity('');
            setClassType(CLASS_TYPES[0]);
        } catch (err) {
            setError(err.response?.data?.message ?? t('classes.createFailed'));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('classes.newClass')}</h2>
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <div className={styles.formRow}>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('classes.name')}</label>
                            <input
                                className={styles.input}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('classes.namePlaceholder')}
                                disabled={submitting}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('classes.type')}</label>
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
                            <label className={styles.label}>{t('classes.startDateTime')}</label>
                            <input
                                className={styles.input}
                                type="datetime-local"
                                value={startDateTime}
                                onChange={(e) => setStartDateTime(e.target.value)}
                                disabled={submitting}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('classes.maxCapacity')}</label>
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
                        {submitting ? <span className={styles.spinner} /> : t('classes.createClass')}
                    </button>
                </form>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('classes.yourClasses')} ({classes.length})</h2>
                {loading ? (
                    <p className={styles.loading}>{t('common.loading')}</p>
                ) : classes.length === 0 ? (
                    <p className={styles.empty}>{t('common.noData')}</p>
                ) : (
                    <div className={styles.grid}>
                        {classes.map((gc) => <TrainerClassCard key={gc.id} gc={gc} />)}
                    </div>
                )}
            </section>
        </>
    );
}

// ===== Client view =====

function ClientClasses({ clientId }) {
    const { t } = useTranslation();
    const [classes, setClasses] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [bookingState, setBookingState] = useState({});

    useEffect(() => {
        const gymId = localStorage.getItem('gymId');

        Promise.all([
            groupClassService.listByGym(gymId),
            classBookingService.listMyBookingsAsClient(),
        ])
            .then(([allClasses, bookings]) => {
                setClasses(allClasses);
                setMyBookings(bookings);

                console.log(myBookings)

                const bookedClassIds = new Set(bookings.map((b) => b.groupClassId));
                const initial = {};
                allClasses.forEach((c) => {
                    initial[c.id] = bookedClassIds.has(c.id) ? 'booked' : 'idle';
                });
                setBookingState(initial);
            })
            .catch(() => setError(t('classes.loadFailed')))
            .finally(() => setLoading(false));
    }, [clientId, t]);

    async function handleBook(gc) {
        setBookingState((prev) => ({ ...prev, [gc.id]: 'loading' }));
        try {
            await classBookingService.create(clientId, gc.id);
            setBookingState((prev) => ({ ...prev, [gc.id]: 'booked' }));
        } catch (err) {
            const msg = err.response?.data?.message ?? t('classes.bookingFailed');
            setBookingState((prev) => ({ ...prev, [gc.id]: `error:${msg}` }));
        }
    }

    if (loading) return <p className={styles.loading}>{t('common.loading')}</p>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (classes.length === 0) return <p className={styles.empty}>{t('common.noData')}</p>;

    return (
        <>
            {/* Aulas agendadas */}
            {myBookings.length > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('classes.myBookings')} ({myBookings.length})</h2>
                    <div className={styles.grid}>
                        {classes
                            .filter((gc) => myBookings.some((b) => b.groupClassId === gc.id))
                            .map((gc) => <ClassCard key={gc.id} gc={gc} />)
                        }
                    </div>
                </section>
            )}

            {/* Todas as aulas disponíveis */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('classes.availableClasses')} ({classes.length})</h2>
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
                                            {isBooked ? t('classes.booked') : t('classes.bookNow')}
                                        </button>
                                    </div>
                                )}
                            />
                        );
                    })}
                </div>
            </section>
        </>
    );
}

// ===== Main =====

/**
 * Classes page — role-conditional rendering.
 * 
 * TRAINER: creates and manages their own group classes.
 * CLIENT:  browses all available classes and books a spot.
 */
export default function Classes() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const role = getRoleFromToken();

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('classes.title')}</h1>
                <p className={styles.subtitle}>
                    {role === 'TRAINER'
                        ? t('classes.trainerSubtitle')
                        : t('classes.clientSubtitle')}
                </p>
            </div>

            {role === 'TRAINER' && <TrainerClasses trainerId={user?.id} />}
            {role === 'CLIENT' && <ClientClasses clientId={user?.id} />}
        </div>
    );
}