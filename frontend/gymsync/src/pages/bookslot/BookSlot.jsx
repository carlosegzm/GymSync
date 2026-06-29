import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// hooks
import { useAuth } from '../../hooks/context/AuthContext';
import { useGymUsers } from '../../hooks/users/useGymUsers';

// services
import availableTimeSlotService from '../../services/availableTimeSlotService';

// components
import UserSelect from '../../components/commom/userselect/UserSelect';

// styles
import styles from './BookSlot.module.css';

// ===== Helpers ===== 

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

// ===== Sub-components =====

function SlotChip({ slot, onBook, bookingId }) {
    const { t } = useTranslation();
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
                : <span className={styles.chipCta}>{t('bookSlot.enroll')}</span>
            }
        </button>
    );
}

// ===== Main =====

/**
 * Book a Slot page (CLIENT only).
 * Client enters a trainer ID, fetches their free slots,
 * and books one via PATCH /api/timeslots/{slotId}/book/client/{clientId}.
 *
 * @preAuthorize CLIENT
 */
export default function BookSlot() {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();

    const [selectedTrainerId, setSelectedTrainerId] = useState('');
    const { users: trainers, loading: loadingTrainers, error: trainersError } = useGymUsers('trainers');

    const [slots, setSlots] = useState([]);
    const [searched, setSearched] = useState(false);
    const [searching, setSearching] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [bookedIds, setBookedIds] = useState(new Set());
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!selectedTrainerId) { setSlots([]); setSearched(false); return; }

        setError(''); setSuccess(''); setSlots([]); setSearched(false);
        setSearching(true);

        availableTimeSlotService.listByTrainer(selectedTrainerId)
            .then((all) => {
                const free = all.filter((s) => s.available);
                setSlots(free);
                setSearched(true);
                if (free.length === 0) setError(t('bookSlot.noSlots'));
            })
            .catch(() => setError(t('bookSlot.loadFailed')))
            .finally(() => setSearching(false));
    }, [selectedTrainerId, t]);

    async function handleBook(slotId) {
        setError(''); setSuccess('');
        setBookingId(slotId);
        try {
            await availableTimeSlotService.bookSlot(slotId, user.id);
            setBookedIds((prev) => new Set([...prev, slotId]));
            setSlots((prev) => prev.filter((s) => s.id !== slotId));
            setSuccess(t('common.success'));
        } catch (err) {
            setError(err.response?.data?.message ?? t('bookSlot.bookFailed'));
        } finally {
            setBookingId(null);
        }
    }

    const grouped = groupByDate(slots);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('bookSlot.title')}</h1>
                <p className={styles.subtitle}>
                    {t('bookSlot.subtitle')}
                </p>
            </div>

            {/* Trainer search */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('bookSlot.selectTrainer')}</h2>
                {loadingTrainers ? (
                    <p className={styles.loading}>{t('bookSlot.loadingTrainers')}</p>
                ) : trainersError ? (
                    <div className={styles.error}>{trainersError}</div>
                ) : (
                    <select
                        className={styles.select}
                        value={selectedTrainerId}
                        onChange={(e) => setSelectedTrainerId(e.target.value)}
                        disabled={searching}
                    >
                        <option value="">{t('bookSlot.chooseTrainer')}</option>
                        {trainers.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                )}
                {searching && <p className={styles.loading}>{t('bookSlot.loadingSlots')}</p>}
            </section>

            {error && <div className={styles.error} role="alert">{error}</div>}
            {success && <div className={styles.success} role="status">{success}</div>}

            {/* Available slots */}
            {searched && slots.length > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        {t('bookSlot.availableSlots')} ({slots.length})
                    </h2>
                    <div className={styles.dateList}>
                        {Object.keys(grouped).sort().map((date) => (
                            <div key={date} className={styles.dateGroup}>
                                <p className={styles.dateHeader}>
                                    {formatDateHeader(date, i18n.language)}
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
                        {t('bookSlot.bookedThisSession')} ({bookedIds.size})
                    </h2>
                    <p className={styles.bookedNote}>
                        {/* Utiliza a chave nativa com suporte a plural e contagem do i18next */}
                        {t('bookSlot.confirmed', { count: bookedIds.size })}
                    </p>
                </section>
            )}
        </div>
    );
}