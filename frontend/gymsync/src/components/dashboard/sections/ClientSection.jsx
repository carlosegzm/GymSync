import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// styles
import styles from '../../../pages/DashBoard.module.css'

// services
import reportService from "../../../services/reportService";

// hooks 
import { useReportDownload } from '../../../hooks/report/useReportDownload';

// components 
import ActionCard from '../cards/ActionCard';

export default function ClientSection({ user }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const clientId = user?.id;

    const assessmentReport = useReportDownload(
        () => reportService.getAssessmentReport(clientId),
        `assessment-report-${clientId || 'client'}.pdf`
    );

    return (
        <>
            {/* Training Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('dashboard.training')}</h2>
                <div className={styles.actionsGrid}>
                    <ActionCard
                        icon="🏃"
                        label={t('dashboard.groupClasses')}
                        sub={t('dashboard.browseBookClasses')}
                        onClick={() => navigate('/classes')}
                    />
                    <ActionCard
                        icon="📈"
                        label={t('dashboard.myAssessments')}
                        sub={t('dashboard.viewProgress')}
                        onClick={() => navigate('/assessments')}
                    />
                    <ActionCard
                        icon="💳"
                        label={t('dashboard.mySubscription')}
                        sub={t('dashboard.managePlan')}
                        onClick={() => navigate('/subscription')}
                    />
                    <ActionCard
                        icon="📅"
                        label={t('dashboard.bookSession')}
                        sub={t('dashboard.reserveSlot')}
                        onClick={() => navigate('/book-slot')}
                    />
                </div>
            </section>

            {/* Assessment Report Section */}
            <section className={styles.section}>
                <div className={styles.reportCard}>
                    <div className={styles.reportText}>
                        <h2 className={styles.reportTitle}>{t('dashboard.assessmentReport')}</h2>
                        <p className={styles.reportSub}>
                            {t('dashboard.assessmentReportSub')}
                        </p>
                    </div>

                    <button
                        className={styles.pdfBtn}
                        onClick={assessmentReport.download}
                        disabled={assessmentReport.loading || !clientId}
                    >
                        {assessmentReport.loading ? (
                            <span className={styles.spinner} />
                        ) : (
                            <span>📄</span>
                        )}
                        {assessmentReport.loading ? t('dashboard.generating') : t('dashboard.downloadMyReport')}
                    </button>

                    {assessmentReport.error && (
                        <p className={styles.reportError}>{assessmentReport.error}</p>
                    )}
                </div>
            </section>
        </>
    );
}
