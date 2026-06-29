import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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

function UpcomingClasses() {
    const { t, i18n } = useTranslation();
    const gymId = localStorage.getItem('gymId');
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!gymId) { setLoading(false); return; }
        groupClassService.listByGym(gymId)
            .then((data) => {
                const sorted = [...data].sort(
                    (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
                );
                setClasses(sorted.slice(0, 5));
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [gymId]);

    if (loading || classes.length === 0) return null;

    const currentLanguage = i18n.language || 'en';

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('dashboard.upcomingClasses')}</h2>
            <div className={styles.upcomingList}>
                {classes.map((gc) => {
                    const d = new Date(gc.startDateTime);
                    return (
                        <div key={gc.id} className={styles.upcomingRow}>
                            <span className={styles.upcomingType}>{gc.classType}</span>
                            <span className={styles.upcomingName}>{gc.name}</span>
                            <span className={styles.upcomingDate}>
                                {d.toLocaleDateString(currentLanguage, { day: '2-digit', month: 'short' })}
                                {' · '}
                                {d.toLocaleTimeString(currentLanguage, { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default function AdminSection({ gymId }) {
    const { t, i18n } = useTranslation();
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

    const financeReport = useReportDownload(
        () => reportService.getFinanceReport(gymId),
        'financial-report.pdf'
    );

    const currentLanguage = i18n.language || 'en';

    return (
        <>
            {/* Metrics */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('dashboard.overview')}</h2>
                {!gymId && (
                    <p className={styles.warn}>
                        ⚠️ No gym linked to this account. Metrics unavailable.
                    </p>
                )}
                <div className={styles.metricsGrid}>
                    <MetricCard
                        label={t('dashboard.activeMembers')}
                        value={loadingMetrics ? '...' : metrics?.activeMembers}
                    />
                    <MetricCard
                        label={t('dashboard.expiringIn30Days')}
                        value={loadingMetrics ? '...' : metrics?.membersExpiringIn30Days}
                        sub={t('dashboard.memberships')}
                    />
                    <MetricCard
                        label={t('dashboard.netBalance')}
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
                <h2 className={styles.sectionTitle}>Admin </h2>
                <div className={styles.actionsGrid}>
                    <ActionCard
                        icon="📋"
                        label={t('dashboard.membershipPlans')}
                        sub={t('dashboard.createManagePlans')}
                        onClick={() => navigate('/plans')}
                    />
                    <ActionCard
                        icon="👥"
                        label={t('dashboard.gymUsers')}
                        sub={t('dashboard.linkClientsTrainers')}
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
                        label={t('dashboard.gymSetup')}
                        sub={t('dashboard.registerUpdateGym')}
                        onClick={() => navigate('/gym')}
                    />
                </div>
            </section>

            {/* Financial Report */}
            <section className={styles.section}>
                <div className={styles.reportCard}>
                    <div className={styles.reportText}>
                        <h2 className={styles.reportTitle}>{t('dashboard.financialReport')}</h2>
                        <p className={styles.reportSub}>
                            {t('dashboard.financialReportSub')}
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
                        {financeReport.loading ? t('dashboard.generating') : t('dashboard.downloadReport')}
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