// react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// services
import groupClassService from '../../services/groupClassService';
import classBookingService from '../../services/classBookingService';

// contexto
import { useAuth } from '../../hooks/context/AuthContext';

// estilização
import styles from './Schedule.module.css';

/**
 * Schedule page — lists all available group classes and allows booking.
 *
 * Business rule enforced here:
 *   A booking request is only sent if the class is not already full.
 *   The backend is the final authority, but we disable the button optimistically.
 *
 * GET  /api/group-classes
 * POST /api/class-bookings  { clientId, groupClassId }
 */
export default function Schedule() {
	const { t, i18n } = useTranslation();
	const { user } = useAuth();

	const [classes, setClasses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// bookingState: { [classId]: 'idle' | 'loading' | 'booked' | 'error' }
	const [bookingState, setBookingState] = useState({});

	useEffect(() => {
		(async () => {
			const gymId = localStorage.getItem("gymId");

			try {
				const data = await groupClassService.listByGym(gymId);
				setClasses(data);
				// initialize all buttons as idle
				const initial = {};
				data.forEach((c) => { initial[c.id] = 'idle'; });
				setBookingState(initial);
			} catch {
				setError(t('schedule.loadFailed'));
			} finally {
				setLoading(false);
			}
		})();
	}, [t]);

	async function handleBook(groupClass) {
		if (!user?.id) return;

		setBookingState((prev) => ({ ...prev, [groupClass.id]: 'loading' }));
		try {
			await classBookingService.create({
				clientId: user.id,
				groupClassId: groupClass.id
			});
			setBookingState((prev) => ({ ...prev, [groupClass.id]: 'booked' }));
		} catch (err) {
			// Show backend message (e.g. "Class is full") inside the card
			const msg = err.response?.data?.message ?? t('schedule.bookingFailed');
			setBookingState((prev) => ({ ...prev, [groupClass.id]: `error:${msg}` }));
		}
	}

	function formatDate(iso) {
		const d = new Date(iso);

		// Utiliza dinamicamente o idioma atual da aplicação (ex: 'pt-BR', 'en', 'es')
		const currentLanguage = i18n.language || 'pt-BR';

		return d.toLocaleDateString(currentLanguage, { weekday: 'short', day: '2-digit', month: 'short' })
			+ ' — '
			+ d.toLocaleTimeString(currentLanguage, { hour: '2-digit', minute: '2-digit' });
	}

	if (loading) return <div className={styles.center}>{t('schedule.loadingClasses')}</div>;
	if (error) return <div className={styles.center + ' ' + styles.errorText}>{error}</div>;

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<h1 className={styles.title}>{t('schedule.title')}</h1>
				<p className={styles.subtitle}>{t('schedule.subtitle')}</p>
			</div>

			{classes.length === 0 ? (
				<div className={styles.empty}>{t('schedule.noClasses')}</div>
			) : (
				<div className={styles.grid}>
					{classes.map((gc) => {
						const state = bookingState[gc.id] ?? 'idle';
						const isBooked = state === 'booked';
						const isLoading = state === 'loading';
						const isError = state.startsWith('error:');
						const errorMsg = isError ? state.replace('error:', '') : '';

						return (
							<div key={gc.id} className={styles.card}>
								<div className={styles.cardTop}>
									<span className={styles.classType}>{gc.classType}</span>
									<span className={styles.capacity}>
										{t('schedule.spots', { count: gc.maxCapacity })}
									</span>
								</div>

								<h3 className={styles.className}>{gc.name}</h3>
								<p className={styles.trainer}>👤 {gc.trainerName}</p>
								<p className={styles.date}>🕐 {formatDate(gc.startDateTime)}</p>

								{isError && (
									<p className={styles.cardError}>{errorMsg}</p>
								)}

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
									{isBooked ? t('schedule.booked') : t('schedule.bookNow')}
								</button>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
