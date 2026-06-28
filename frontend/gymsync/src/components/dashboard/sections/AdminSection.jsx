import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

// services
import reportService from "../../../services/reportService";
import dashboardService from "../../../services/dashboardService";
import groupClassService from "../../../services/groupClassService";

// hooks
import { useReportDownload } from "../../../hooks/report/useReportDownload";

// components
import MetricCard from "../cards/MetricCard";
import ActionCard from "../cards/ActionCard";

// styles
import styles from '../../../pages/DashBoard.module.css'

// No AdminSection, adiciona nos useEffects ou num componente separado
// uma prévia das próximas aulas da academia

function UpcomingClasses() {
    const gymId = localStorage.getItem('gymId');
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!gymId) { setLoading(false); return; }
        groupClassService.listByGym(gymId)
            .then((data) => {
                // Ordena por data e pega as próximas 5
                const sorted = [...data].sort(
                    (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
                );
                setClasses(sorted.slice(0, 5));
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [gymId]);

    if (loading || classes.length === 0) return null;

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Upcoming Classes</h2>
            <div className={styles.upcomingList}>
                {classes.map((gc) => {
                    const d = new Date(gc.startDateTime);
                    return (
                        <div key={gc.id} className={styles.upcomingRow}>
                            <span className={styles.upcomingType}>{gc.classType}</span>
                            <span className={styles.upcomingName}>{gc.name}</span>
                            <span className={styles.upcomingDate}>
                                {d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                {' · '}
                                {d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

// Adiciona dentro do return do AdminSection, após as métricas:
<UpcomingClasses />

export default function AdminSection({ gymId }) {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState(null);
    const [loadingMetrics, setLoadingMetrics] = useState(true);

    useEffect(() => {
        if (!gymId) {
            setLoadingMetrics(false);
            return;
        }

        dashboardService.getMetrics(gymId)
            .then((data) => setMetrics(data))
            .catch(() => setMetrics(null))
            .finally(() => setLoadingMetrics(false));
    }, [gymId]);

    // Blob-based service-consuming hook
    const financeReport = useReportDownload(
        () => reportService.getFinanceReport(gymId),
        'financial-report.pdf'
    );

    return (
        <>
            {/* Metrics */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Gym Overview</h2>
                {!gymId && (
                    <p className={styles.warn}>
                        ⚠️ No gym linked to this account. Metrics unavailable.
                    </p>
                )}
                <div className={styles.metricsGrid}>
                    <MetricCard
                        label="Active Members"
                        value={loadingMetrics ? '...' : metrics?.activeMembers}
                    />
                    <MetricCard
                        label="Expiring in 30 days"
                        value={loadingMetrics ? '...' : metrics?.membersExpiringIn30Days}
                        sub="memberships"
                    />
                    <MetricCard
                        label="Net Balance"
                        value={
                            loadingMetrics
                                ? '...'
                                : metrics?.netFinancialBalance != null
                                    ? `R$ ${Number(metrics.netFinancialBalance).toFixed(2)}`
                                    : null
                        }
                    />
                </div>
            </section>

            {/* Quick actions */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Management</h2>
                <div className={styles.actionsGrid}>
                    <ActionCard
                        icon="📋"
                        label="Membership Plans"
                        sub="Create and manage plans"
                        onClick={() => navigate('/plans')}
                    />
                    <ActionCard
                        icon="👤"
                        label="Register Student"
                        sub="Add a new client"
                        onClick={() => navigate('/register')}
                    />
                    <ActionCard
                        icon="👥"
                        label="Users"
                        sub="Link trainers and clients to your gym"
                        onClick={() => navigate('/users')}
                    />
                    <ActionCard
                        icon="💰"
                        label="Finances"
                        sub="Track income and expenses"
                        onClick={() => navigate('/finances')}
                    />
                    <ActionCard
                        icon="🏢"
                        label="Gym Setup"
                        sub="Register or update gym info"
                        onClick={() =>
                            navigate('/gym')}
                    />
                </div>
            </section>

            {/* Financial Report */}
            <section className={styles.section}>
                <div className={styles.reportCard}>
                    <div className={styles.reportText}>
                        <h2 className={styles.reportTitle}>Financial Report</h2>
                        <p className={styles.reportSub}>
                            Complete financial summary for your gym, generated live.
                        </p>
                    </div>
                    <button
                        className={styles.pdfBtn}
                        onClick={financeReport.download}
                        disabled={financeReport.loading || !gymId}
                    >
                        {financeReport.loading ? (
                            <span className={styles.spinner} />
                        ) : (
                            <span>📄</span>
                        )}
                        {financeReport.loading ? 'Generating...' : 'Download Financial Report (PDF)'}
                    </button>
                    {financeReport.error && (
                        <p className={styles.reportError}>{financeReport.error}</p>
                    )}
                </div>
            </section>

            <section className={styles.section}>
                <div>
                    <UpcomingClasses />
                </div>
            </section>
        </>
    );
}