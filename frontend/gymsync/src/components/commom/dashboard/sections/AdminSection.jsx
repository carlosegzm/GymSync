import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

// services
import reportService from "../../../../services/reportService";
import dashboardService from "../../../../services/dashboardService";

// hooks
import { useReportDownload } from "../../../../hooks/report/useReportDownload";

// components
import MetricCard from "../cards/MetricCard";
import ActionCard from "../cards/ActionCard";

// styles
import styles from '../../../../pages/DashBoard.module.css'

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
        </>
    );
}