import { useState, useEffect } from 'react';

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

function formatDateHeader(dateStr) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', {
        weekday: 'long', day: '2-digit', month: 'long',
    });
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SlotChip({ slot, onDelete, deleting }) {
    return (
        <div className={[styles.chip, !slot.available ? styles.chipBooked : ''].join(' ')}>
            <span className={styles.chipTime}>{slot.startTime} – {slot.endTime}</span>
            <span className={[styles.chipStatus, slot.available ? styles.chipAvailable : styles.chipUnavailable].join(' ')}>
                {slot.available ? 'Free' : 'Booked'}
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

function SlotsByDate({ grouped, onDelete, deleting }) {
    return (
        <div className={styles.dateList}>
            {Object.keys(grouped).sort().map((date) => (
                <div key={date} className={styles.dateGroup}>
                    <p className={styles.dateHeader}>{formatDateHeader(date)}</p>
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
 *
 * Business rule: only free slots (available: true) can be deleted.
 * Booked slots are displayed as read-only.
 */
export default function Timeslots() {
    const { user } = useAuth();
    const trainerId = user?.id;

    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [deleting, setDeleting] = useState(null); // slotId being deleted
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
            .catch(() => setError('Failed to load timeslots.'))
            .finally(() => setLoading(false));
    }, [trainerId]);

    async function handleGenerate(e) {
        e.preventDefault();
        setError(''); setSuccess('');

        if (!startDate || !endDate) { setError('Start and end date are required.'); return; }
        if (endDate < startDate) { setError('End date must be after start date.'); return; }
        if (!startTime || !endTime) { setError('Start and end time are required.'); return; }
        if (endTime <= startTime) { setError('End time must be after start time.'); return; }
        if (duration < 15) { setError('Minimum duration is 15 minutes.'); return; }

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
                // merge avoiding duplicates by id
                const existingIds = new Set(prev.map((s) => s.id));
                const newSlots = generated.filter((s) => !existingIds.has(s.id));
                return [...prev, ...newSlots];
            });
            setSuccess(`${generated.length} slot${generated.length !== 1 ? 's' : ''} generated!`);
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to generate slots.');
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
            setError(err.response?.data?.message ?? 'Failed to delete slot.');
        } finally {
            setDeleting(null);
        }
    }

    const grouped = groupByDate(slots);
    const freeCount = slots.filter((s) => s.available).length;
    const bookedCount = slots.filter((s) => !s.available).length;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Schedule</h1>
                <p className={styles.subtitle}>Generate and manage your available timeslots.</p>
            </div>

            {/* Generate form */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Generate Slots in Bulk</h2>
                <form className={styles.form} onSubmit={handleGenerate} noValidate>
                    <div className={styles.formRow}>
                        <div className={styles.field}>
                            <label className={styles.label}>Start date</label>
                            <input className={styles.input} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={generating} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>End date</label>
                            <input className={styles.input} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={generating} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>From</label>
                            <input className={styles.input} type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} disabled={generating} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>To</label>
                            <input className={styles.input} type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} disabled={generating} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Duration (min)</label>
                            <input className={styles.input} type="number" min="15" step="15" value={duration} onChange={(e) => setDuration(e.target.value)} disabled={generating} />
                        </div>
                    </div>

                    {error && <div className={styles.error} role="alert">{error}</div>}
                    {success && <div className={styles.success} role="status">{success}</div>}

                    <button type="submit" className={styles.submitBtn} disabled={generating}>
                        {generating ? <><span className={styles.spinner} /> Generating...</> : '⚡ Generate Slots'}
                    </button>
                </form>
            </section>

            {/* Slots list */}
            <section className={styles.section}>
                <div className={styles.sectionRow}>
                    <h2 className={styles.sectionTitle}>
                        Your Slots
                    </h2>
                    {slots.length > 0 && (
                        <div className={styles.slotSummary}>
                            <span className={styles.summaryFree}>●  {freeCount} free</span>
                            <span className={styles.summaryBooked}>●  {bookedCount} booked</span>
                        </div>
                    )}
                </div>

                {loading ? (
                    <p className={styles.loading}>Loading slots...</p>
                ) : slots.length === 0 ? (
                    <p className={styles.empty}>No slots yet. Generate your availability above.</p>
                ) : (
                    <SlotsByDate
                        grouped={grouped}
                        onDelete={handleDelete}
                        deleting={deleting}
                    />
                )}
            </section>
        </div>
    );
}