import { useState, useEffect } from 'react';

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
    if (loading) return <p className={styles.loading}>Loading assessments...</p>;
    if (assessments.length === 0) return <p className={styles.empty}>No assessments found.</p>;

    return (
        <div className={styles.list}>
            <div className={styles.listHeader}>
                <span>Date</span>
                <span>Weight</span>
                <span>Height</span>
                <span>Body Fat</span>
            </div>
            {assessments.map((a) => <AssessmentRow key={a.id} a={a} />)}
        </div>
    );
}

// ─── Client view ───────────────────────────────────────────────────────────────

function ClientAssessments({ userId }) {
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
            .catch(() => setError('Nenhuma avaliação encontrada ou erro ao buscar histórico.'))
            .finally(() => setLoading(false));
    }, [userId]);

    return (
        <>
            <section className={styles.section}>
                <div className={styles.sectionRow}>
                    <h2 className={styles.sectionTitle}>My Assessment History</h2>
                    <button
                        className={styles.pdfBtn}
                        onClick={report.download}
                        disabled={report.loading}
                    >
                        {report.loading ? <span className={styles.spinner} /> : '📄'}
                        {report.loading ? 'Generating...' : 'Download PDF'}
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

        if (!selectedClient) { setError('Please select a client.'); return; }
        if (!assessmentDate) { setError('Date is required.'); return; }
        if (!weight || !height) { setError('Weight and height are required.'); return; }

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
            setSuccess('Assessment registered successfully!');
            setDate('');
            setWeight('');
            setHeight('');
            setBodyFat('');
            setSelectedClient(null);

        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to register assessment.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            {/* Create form */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Register Assessment</h2>
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <div className={styles.formRow}>
                        <div className={styles.field}>
                            <label className={styles.label}>Client</label>
                            {loadingClients
                                ? <p className={styles.loading}>Loading clients...</p>
                                : <UserSelect
                                    users={clients}
                                    selected={selectedClient}
                                    onSelect={setSelectedClient}
                                    placeholder="Search client by name..."
                                    disabled={submitting}
                                />
                            }
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Date</label>
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
                            <label className={styles.label}>Weight (kg)</label>
                            <input className={styles.input} type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70.5" disabled={submitting} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Height (m)</label>
                            <input className={styles.input} type="number" step="0.01" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="1.75" disabled={submitting} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Body Fat %</label>
                            <input className={styles.input} type="number" step="0.1" value={bodyFatPercentage} onChange={(e) => setBodyFat(e.target.value)} placeholder="18.5" disabled={submitting} />
                        </div>
                    </div>

                    {error && <div className={styles.error} role="alert">{error}</div>}
                    {success && <div className={styles.success} role="status">{success}</div>}

                    <button type="submit" className={styles.submitBtn} disabled={submitting}>
                        {submitting ? <span className={styles.spinner} /> : '+ Register Assessment'}
                    </button>
                </form>
            </section>

            {/* Recent assessments registered by this trainer */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Recently Registered</h2>
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
                <h1 className={styles.title}>Assessments</h1>
                <p className={styles.subtitle}>
                    {role === 'CLIENT'
                        ? 'Your physical assessment history.'
                        : 'Register and manage client assessments.'}
                </p>
            </div>

            {role === 'CLIENT' && <ClientAssessments userId={user?.id} />}
            {role === 'TRAINER' && <TrainerAssessments trainerId={user?.id} />}
        </div>
    );
}