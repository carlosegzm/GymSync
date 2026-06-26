import { useNavigate } from 'react-router-dom';

// styles
import styles from '../../../pages/DashBoard.module.css'

// services
import reportService from "../../../services/reportService";

// hooks 
import { useReportDownload } from '../../../hooks/report/useReportDownload';

// components 
import ActionCard from '../cards/ActionCard';

export default function ClientSection({ user }) {
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
                <h2 className={styles.sectionTitle}>Your Training</h2>
                <div className={styles.actionsGrid}>
                    <ActionCard
                        icon="🏃" 
                        label="Group Classes"
                        sub="Browse and book classes"
                        onClick={() => navigate('/schedule')}
                    />
                    <ActionCard
                        icon="📈" 
                        label="My Assessments"
                        sub="View your progress"
                        onClick={() => navigate('/assessments')}
                    />
                    <ActionCard
                        icon="💳" 
                        label="My Subscription"
                        sub="Manage your plan"
                        onClick={() => navigate('/subscription')}
                    />
                </div>
            </section>

            {/* Assessment Report Section */}
            <section className={styles.section}>
                <div className={styles.reportCard}>
                    <div className={styles.reportText}>
                        <h2 className={styles.reportTitle}>Assessment Report</h2>
                        <p className={styles.reportSub}>
                            Download your full physical assessment history as PDF.
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
                        {assessmentReport.loading ? 'Generating...' : 'Download My Report (PDF)'}
                    </button>
                    
                    {assessmentReport.error && (
                        <p className={styles.reportError}>{assessmentReport.error}</p>
                    )}
                </div>
            </section>
        </>
    );
}
