import { useState } from 'react';
import { useAuth } from '../../hooks/context/AuthContext';
import availableTimeSlotService from '../../services/availableTimeSlotService';
import styles from './BookSlot.module.css';

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

function SlotChip({ slot, onBook, bookingId }) {
    const isBooking = bookingId === slot.id;

    return (
        <button
            className={styles.chip}
            onClick={() => onBook(slot.id)}
            disabled={isBooking}
        >
            <span className={styles.chipTime}>
                {slot.startTime} – {slot.endTime}
            </span>
            {isBooking
                ? <span className={styles.spinnerSm} />
                : <span className={styles.chipCta}>Book</span>
            }
        </button>
    );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

/**
 * Book a Slot page (CLIENT only).
 * Client enters a trainer ID, fetches their free slots,
 * and books one via PATCH /api/timeslots/{slotId}/book/client/{clientId}.
 *
 * @preAuthorize CLIENT
 */
export default function BookSlot() {
    const { user } = useAuth();

    const [trainerId, setTrainerId] = useState('');
    const [slots, setSlots] = useState([]);
    const [searched, setSearched] = useState(false);
    const [searching, setSearching] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [bookedIds, setBookedIds] = useState(new Set());
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    async function handleSearch(e) {
        e.preventDefault();
        setError(''); setSuccess(''); setSlots([]); setSearched(false);

        if (!trainerId.trim()) { setError('Please enter a trainer ID.'); return; }

        setSearching(true);
        try {
            const all = await availableTimeSlotService.listByTrainer(trainerId.trim());
            const free = all.filter((s) => s.available);
            setSlots(free);
            setSearched(true);
            if (free.length === 0) setError('No available slots for this trainer.');
        } catch (err) {
            setError(err.response?.data?.message ?? 'Trainer not found or failed to load slots.');
        } finally {
            setSearching(false);
        }
    }

    async function handleBook(slotId) {
        setError(''); setSuccess('');
        setBookingId(slotId);
        try {
            await availableTimeSlotService.bookSlot(slotId, user.id);
            setBookedIds((prev) => new Set([...prev, slotId]));
            setSlots((prev) => prev.filter((s) => s.id !== slotId));
            setSuccess('Slot booked successfully!');
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to book slot.');
        } finally {
            setBookingId(null);
        }
    }

    const grouped = groupByDate(slots);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Book a Session</h1>
                <p className={styles.subtitle}>
                    Enter your trainer's ID to see their available slots.
                </p>
            </div>

            {/* Trainer search */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Find Trainer</h2>
                <form className={styles.searchForm} onSubmit={handleSearch} noValidate>
                    <input
                        className={styles.searchInput}
                        value={trainerId}
                        onChange={(e) => setTrainerId(e.target.value)}
                        placeholder="Trainer UUID"
                        disabled={searching}
                    />
                    <button
                        type="submit"
                        className={styles.searchBtn}
                        disabled={searching}
                    >
                        {searching ? <span className={styles.spinner} /> : 'Search'}
                    </button>
                </form>
            </section>

            {error && <div className={styles.error} role="alert">{error}</div>}
            {success && <div className={styles.success} role="status">{success}</div>}

            {/* Available slots */}
            {searched && slots.length > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        Available Slots ({slots.length})
                    </h2>
                    <div className={styles.dateList}>
                        {Object.keys(grouped).sort().map((date) => (
                            <div key={date} className={styles.dateGroup}>
                                <p className={styles.dateHeader}>
                                    {formatDateHeader(date)}
                                </p>
                                <div className={styles.chips}>
                                    {grouped[date].map((slot) => (
                                        <SlotChip
                                            key={slot.id}
                                            slot={slot}
                                            onBook={handleBook}
                                            bookingId={bookingId}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Booked this session */}
            {bookedIds.size > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        Booked this session ({bookedIds.size})
                    </h2>
                    <p className={styles.bookedNote}>
                        ✓ {bookedIds.size} slot{bookedIds.size !== 1 ? 's' : ''} confirmed.
                        Check with your trainer for details.
                    </p>
                </section>
            )}
        </div>
    );
}