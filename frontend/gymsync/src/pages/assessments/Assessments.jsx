import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// contexts
import { useAuth } from '../../hooks/context/AuthContext';

// utils
import { getRoleFromToken } from '../../utils/jwt';

// hooks
import { useReportDownload } from '../../hooks/report/useReportDownload';
import { useGymUsers } from '../../hooks/users/useGymUsers';

//services
import reportService from '../../services/reportService';
import physicalAssessmentService from '../../services/physicalAssessmentService';

// components
import UserSelect from '../../components/commom/userselect/UserSelect';

// styles
import styles from './Assessments.module.css';

// TODO: organizar em arquivos separados urgentemente

// ─── Shared ────────────────────────────────────────────────────────────────────

function AssessmentRow({ a }) {
    return (
        <div className={styles.row}>
            <span className={styles.rowDate}>{a.assessmentDate}</span>
            <span className={styles.rowValue}>{a.weight} kg</span>
            <span className={styles.rowValue}>{a.height} m</span>
            <span className={styles.rowValue}>{a.bodyFatPercentage}%</span>
        </div>
    );
}

function AssessmentList({ assessments, loading }) {
    const { t } = useTranslation();

    if (loading) return <p className={styles.loading}>{t('common.loading')}</p>;
    if (assessments.length === 0) return <p className={styles.empty}>{t('assessments.noAssessments')}</p>;

    return (
        <div className={styles.list}>
            <div className={styles.listHeader}>
                <span>{t('assessments.date')}</span>
                <span>{t('assessments.weight')}</span>
                <span>{t('assessments.height')}</span>
                <span>{t('assessments.bodyFat')}</span>
            </div>
            {assessments.map((a) => <AssessmentRow key={a.id} a={a} />)}
        </div>
    );
}

// ─── Client view ───────────────────────────────────────────────────────────────

function ClientAssessments({ userId }) {
    const { t } = useTranslation();
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const report = useReportDownload(
        () => reportService.getAssessmentReport(userId),
        `assessment-${userId}.pdf`
    );

    useEffect(() => {
        physicalAssessmentService.listByClient(userId)
            .then(setAssessments)
            .catch(() => setError(t('assessments.noAssessments')))
            .finally(() => setLoading(false));
    }, [userId]);

    return (
        <>
            <section className={styles.section}>
                <div className={styles.sectionRow}>
                    <h2 className={styles.sectionTitle}>{t('assessments.myHistory')}</h2>
                    <button
                        className={styles.pdfBtn}
                        onClick={report.download}
                        disabled={report.loading}
                    >
                        {report.loading ? <span className={styles.spinner} /> : '📄'}
                        {report.loading ? t('dashboard.generating') : t('assessments.downloadPDF')}
                    </button>
                </div>
                {error && <div className={styles.error}>{error}</div>}
                {report.error && <div className={styles.error}>{report.error}</div>}
                <AssessmentList assessments={assessments} loading={loading} />
            </section>
        </>
    );
}

// ─── Trainer view ──────────────────────────────────────────────────────────────

function TrainerAssessments({ trainerId }) {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [selectedClient, setSelectedClient] = useState(null);
    const { users: clients, loading: loadingClients } = useGymUsers('clients');
    const [assessmentDate, setDate] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bodyFatPercentage, setBodyFat] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError(''); setSuccess('');

        if (!selectedClient) { setError(t('assessments.clientRequired')); return; }
        if (!assessmentDate) { setError(t('assessments.dateRequired')); return; }
        if (!weight || !height) { setError(t('assessments.measurementsRequired')); return; }

        setSubmitting(true);
        try {
            const created = await physicalAssessmentService.create({
                clientId: selectedClient.id,  // ← usa o id do objeto selecionado
                trainerId,
                assessmentDate,
                weight: Number(weight),
                height: Number(height),
                bodyFatPercentage: bodyFatPercentage ? Number(bodyFatPercentage) : null,
            });

            setAssessments((prev) => [created, ...prev]);
            setSuccess(t('assessments.created'));
            setDate('');
            setWeight('');
            setHeight('');
            setBodyFat('');
            setSelectedClient(null);

        } catch (err) {
            setError(err.response?.data?.message ?? (t('assessments.createFailed')));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            {/* Create form */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('assessments.registerAssessment')}</h2>
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <div className={styles.formRow}>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('assessments.clientId')}</label>
                            {loadingClients
                                ? <p className={styles.loading}>{t('assessments.loadingClients')}</p>
                                : <UserSelect
                                    users={clients}
                                    selected={selectedClient}
                                    onSelect={setSelectedClient}
                                    placeholder={t('assessments.clientId')}
                                    disabled={submitting}
                                />
                            }
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('assessments.date')}</label>
                            <input
                                className={styles.input}
                                type="date"
                                value={assessmentDate}
                                onChange={(e) => setDate(e.target.value)}
                                disabled={submitting}
                            />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('assessments.weight')}</label>
                            <input className={styles.input} type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70.5" disabled={submitting} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('assessments.height')}</label>
                            <input className={styles.input} type="number" step="0.01" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="1.75" disabled={submitting} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('assessments.bodyFat')}</label>
                            <input className={styles.input} type="number" step="0.1" value={bodyFatPercentage} onChange={(e) => setBodyFat(e.target.value)} placeholder="18.5" disabled={submitting} />
                        </div>
                    </div>

                    {error && <div className={styles.error} role="alert">{error}</div>}
                    {success && <div className={styles.success} role="status">{success}</div>}

                    <button type="submit" className={styles.submitBtn} disabled={submitting}>
                        {submitting ? <span className={styles.spinner} /> : t('assessments.register')}
                    </button>
                </form>
            </section>

            {/* Recent assessments registered by this trainer */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('assessments.recentlyRegistered')}</h2>
                <AssessmentList assessments={assessments} loading={loading} />
            </section>
        </>
    );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

/**
 * Assessments page — role-conditional rendering.
 * CLIENT: views their own assessment history + PDF download.
 * TRAINER: registers new assessments + sees recently created ones.
 */
export default function Assessments() {
    const { user } = useAuth();
    const role = getRoleFromToken();

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('assessments.title')}</h1>
                <p className={styles.subtitle}>
                    {role === 'CLIENT' ? t('assessments.clientSubtitle') : t('assessments.trainerSubtitle')}
                </p>
            </div>

            {role === 'CLIENT' && <ClientAssessments userId={user?.id} />}
            {role === 'TRAINER' && <TrainerAssessments trainerId={user?.id} />}
        </div>
    );
}