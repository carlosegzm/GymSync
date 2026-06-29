import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// contexto
import { useAuth } from '../../hooks/context/AuthContext';

// services
import availableTimeSlotService from '../../services/availableTimeSlotService';

// styles
import styles from './Timeslots.module.css';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function groupByDate(slots) {
    return slots.reduce((acc, slot) => {
        if (!acc[slot.date]) acc[slot.date] = [];
        acc[slot.date].push(slot);
        return acc;
    }, {});
}

function formatDateHeader(dateStr, lng = 'pt-BR') {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString(lng, {
        weekday: 'long', day: '2-digit', month: 'long',
    });
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SlotChip({ slot, onDelete, deleting }) {
    const { t } = useTranslation();
    return (
        <div className={[styles.chip, !slot.available ? styles.chipBooked : ''].join(' ')}>
            <span className={styles.chipTime}>{slot.startTime} – {slot.endTime}</span>
            <span className={[styles.chipStatus, slot.available ? styles.chipAvailable : styles.chipUnavailable].join(' ')}>
                {slot.available ? t('timeslots.free') : t('timeslots.booked')}
            </span>
            {slot.available && (
                <button
                    className={styles.chipDelete}
                    onClick={() => onDelete(slot.id)}
                    disabled={deleting === slot.id}
                    aria-label="Delete slot"
                >
                    {deleting === slot.id ? <span className={styles.spinnerSm} /> : '×'}
                </button>
            )}
        </div>
    );
}

function SlotsByDate({ grouped, onDelete, deleting, currentLanguage }) {
    return (
        <div className={styles.dateList}>
            {Object.keys(grouped).sort().map((date) => (
                <div key={date} className={styles.dateGroup}>
                    <p className={styles.dateHeader}>{formatDateHeader(date, currentLanguage)}</p>
                    <div className={styles.chips}>
                        {grouped[date].map((slot) => (
                            <SlotChip
                                key={slot.id}
                                slot={slot}
                                onDelete={onDelete}
                                deleting={deleting}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

/**
 * Timeslots page (TRAINER only).
 * Allows trainers to generate bulk availability slots and delete free ones.
 *
 * POST /api/timeslots/generate  (query params)
 * GET  /api/timeslots/trainer/{trainerId}
 * DELETE /api/timeslots/{slotId}
 * GET /api/timeslots/trainer/me/booked 
 * 
 * Business rule: only free slots (available: true) can be deleted.
 * Booked slots are displayed as read-only.
 */
export default function Timeslots() {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const trainerId = user?.id;

    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]);
    const [loadingBooked, setLoadingBooked] = useState(true);

    // Generate form
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('18:00');
    const [duration, setDuration] = useState(60);

    useEffect(() => {
        if (!trainerId) return;
        availableTimeSlotService.listByTrainer(trainerId)
            .then(setSlots)
            .catch(() => setError(t('timeslots.loadFailed')))
            .finally(() => setLoading(false));
    }, [trainerId, t]);

    useEffect(() => {
        availableTimeSlotService.listMyBookedSlots()
            .then(setBookedSlots)
            .catch(() => { }) 
            .finally(() => setLoadingBooked(false));
    }, []);

    async function handleGenerate(e) {
        e.preventDefault();
        setError(''); setSuccess('');

        if (!startDate || !endDate) { setError(t('timeslots.startEndRequired')); return; }
        if (endDate < startDate) { setError(t('timeslots.endAfterStart')); return; }
        if (!startTime || !endTime) { setError(t('timeslots.timeRequired')); return; }
        if (endTime <= startTime) { setError(t('timeslots.endTimeAfterStart')); return; }
        if (duration < 15) { setError(t('timeslots.minDuration')); return; }

        setGenerating(true);
        try {
            const generated = await availableTimeSlotService.generate({
                trainerId,
                startDate,
                endDate,
                startTime,
                endTime,
                durationMinutes: Number(duration),
            });
            setSlots((prev) => {
                const existingIds = new Set(prev.map((s) => s.id));
                const newSlots = generated.filter((s) => !existingIds.has(s.id));
                return [...prev, ...newSlots];
            });
            setSuccess(t('timeslots.generated', { count: generated.length }));
        } catch (err) {
            setError(err.response?.data?.message ?? t('timeslots.generateFailed'));
        } finally {
            setGenerating(false);
        }
    }

    async function handleDelete(slotId) {
        setError('');
        setDeleting(slotId);
        try {
            await availableTimeSlotService.deleteSlot(slotId);
            setSlots((prev) => prev.filter((s) => s.id !== slotId));
        } catch (err) {
            setError(err.response?.data?.message ?? t('timeslots.deleteFailed'));
        } finally {
            setDeleting(null);
        }
    }

    const grouped = groupByDate(slots);
    const freeCount = slots.filter((s) => s.available).length;
    const bookedCount = slots.filter((s) => !s.available).length;
    const currentLanguage = i18n.language || 'pt-BR';

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('timeslots.title')}</h1>
                <p className={styles.subtitle}>{t('timeslots.subtitle')}</p>
            </div>

            {/* Generate form */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('timeslots.generateBulk')}</h2>
                <form className={styles.form} onSubmit={handleGenerate} noValidate>
                    <div className={styles.formRow}>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('timeslots.startDate')}</label>
                            <input className={styles.input} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={generating} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('timeslots.endDate')}</label>
                            <input className={styles.input} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={generating} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('timeslots.from')}</label>
                            <input className={styles.input} type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} disabled={generating} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('timeslots.to')}</label>
                            <input className={styles.input} type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} disabled={generating} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('timeslots.duration')}</label>
                            <input className={styles.input} type="number" min="15" step="15" value={duration} onChange={(e) => setDuration(e.target.value)} disabled={generating} />
                        </div>
                    </div>

                    {error && <div className={styles.error} role="alert">{error}</div>}
                    {success && <div className={styles.success} role="status">{success}</div>}

                    <button type="submit" className={styles.submitBtn} disabled={generating}>
                        {generating ? <><span className={styles.spinner} /> {t('timeslots.generating')}</> : t('timeslots.generateBtn')}
                    </button>
                </form>
            </section>

            {/* Booked Slots */}
            <section className={styles.section}>
                <div className={styles.sectionRow}>
                    <h2 className={styles.sectionTitle}>
                        {t('timeslots.bookedSessions')} ({bookedSlots.length})
                    </h2>
                </div>

                {loadingBooked ? (
                    <p className={styles.loading}>{t('common.loading')}</p>
                ) : bookedSlots.length === 0 ? (
                    <p className={styles.empty}>{t('timeslots.noBooked')}</p>
                ) : (
                    <div className={styles.dateList}>
                        {Object.entries(groupByDate(bookedSlots))
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([date, slots]) => (
                                <div key={date} className={styles.dateGroup}>
                                    <p className={styles.dateHeader}>{formatDateHeader(date, currentLanguage)}</p>
                                    <div className={styles.chips}>
                                        {slots.map((slot) => (
                                            <div key={slot.id} className={styles.bookedChip}>
                                                <span className={styles.chipTime}>
                                                    {slot.startTime} – {slot.endTime}
                                                </span>
                                                <span className={styles.chipUnavailable}>{t('timeslots.booked')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )}
            </section>

            {/* Slots list */}
            <section className={styles.section}>
                <div className={styles.sectionRow}>
                    <h2 className={styles.sectionTitle}>
                        {t('timeslots.yourSlots')}
                    </h2>
                    {slots.length > 0 && (
                        <div className={styles.slotSummary}>
                            <span className={styles.summaryFree}>●  {freeCount} {t('timeslots.free')}</span>
                            <span className={styles.summaryBooked}>●  {bookedCount} {t('timeslots.booked')}</span>
                        </div>
                    )}
                </div>

                {loading ? (
                    <p className={styles.loading}>{t('common.loading')}</p>
                ) : slots.length === 0 ? (
                    <p className={styles.empty}>{t('timeslots.noSlots')}</p>
                ) : (
                    <SlotsByDate
                        grouped={grouped}
                        onDelete={handleDelete}
                        deleting={deleting}
                        currentLanguage={currentLanguage}
                    />
                )}
            </section>
        </div>
    );
}