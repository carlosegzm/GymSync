import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// services
import financialTransactionService from '../../services/financialTransactionService';
import reportService from '../../services/reportService';

// hooks 
import { useReportDownload } from '../../hooks/report/useReportDownload';

// styles
import styles from './Finances.module.css';

const TRANSACTION_TYPES = ['INCOME', 'EXPENSE'];
const TRANSACTION_CATEGORIES = ['OTHER', 'SALARY', 'LOSS', 'MEMBERSHIP_PAYMENT', 'MAINTENANCE'];

// ===== Sub-components =====

function BalanceCard({ balance, loading }) {
    const { t } = useTranslation();
    const isPositive = balance >= 0;
    return (
        <div className={[styles.balanceCard, isPositive ? styles.balancePositive : styles.balanceNegative].join(' ')}>
            <p className={styles.balanceLabel}>{t('finances.currentBalance')}</p>
            {loading ? (
                <p className={styles.balanceValue}>...</p>
            ) : (
                <p className={styles.balanceValue}>
                    {isPositive ? '+' : ''}R$ {Number(balance).toFixed(2)}
                </p>
            )}
        </div>
    );
}

function TransactionRow({ t }) {
    const isIncome = t.type === 'INCOME';
    return (
        <div className={styles.row}>
            <span className={styles.rowDate}>{t.transactionDate}</span>
            <span className={styles.rowDesc}>{t.description}</span>
            <span className={styles.rowCategory}>{t.category}</span>
            <span className={[styles.rowAmount, isIncome ? styles.income : styles.expense].join(' ')}>
                {isIncome ? '+' : '-'} R$ {Number(t.amount).toFixed(2)}
            </span>
        </div>
    );
}

// ===== Main =====

/**
 * Finances page (ADMIN only).
 * Shows current gym balance, allows registering new transactions,
 * and lists transactions created in the current session.
 *
 * GET  /api/finances/gym/{gymId}/balance
 * POST /api/finances
 * GET  /api/reports/finance/{gymId}  (PDF)
 */
export default function Finances() {
    const { t } = useTranslation();
    const gymId = localStorage.getItem('gymId');

    const [balance, setBalance] = useState(0);
    const [loadingBalance, setLoadingBal] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('INCOME');
    const [category, setCategory] = useState('OTHER');
    const [transactionDate, setDate] = useState(
        new Date().toISOString().split('T')[0]
    );

    const report = useReportDownload(
        () => reportService.getFinanceReport(gymId),
        'financial-report.pdf'
    );

    useEffect(() => {
        if (!gymId) { setLoadingBal(false); return; }
        financialTransactionService.getBalance(gymId)
            .then(setBalance)
            .catch(() => setError(t('finances.loadFailed')))
            .finally(() => setLoadingBal(false));
    }, [gymId, t]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(''); setSuccess('');

        if (!description.trim()) { setError(t('finances.descriptionRequired')); return; }
        if (!amount || amount <= 0) { setError(t('finances.amountRequired')); return; }
        if (!transactionDate) { setError(t('finances.dateRequired')); return; }

        setSubmitting(true);
        try {
            const created = await financialTransactionService.create({
                description,
                amount: Number(amount),
                type,
                category,
                transactionDate,
                gymId,
            });

            // Update balance optimistically
            setBalance((prev) =>
                type === 'INCOME'
                    ? prev + Number(amount)
                    : prev - Number(amount)
            );

            setTransactions((prev) => [created, ...prev]);
            setSuccess(t('finances.registered'));
            setDescription(''); setAmount('');
            setType('INCOME'); setCategory('OTHER');
            setDate(new Date().toISOString().split('T')[0]);
        } catch (err) {
            setError(err.response?.data?.message ?? t('finances.registerFailed'));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>{t('finances.title')}</h1>
                    <p className={styles.subtitle}>{t('finances.subtitle')}</p>
                </div>
                <button
                    className={styles.pdfBtn}
                    onClick={report.download}
                    disabled={report.loading || !gymId}
                >
                    {report.loading ? <span className={styles.spinner} /> : '📄 '}
                    {report.loading ? t('common.loading') : t('finances.downloadReport')}
                </button>
            </div>

            {/* Balance */}
            <BalanceCard balance={balance} loading={loadingBalance} />

            {error && <div className={styles.error} role="alert">{error}</div>}
            {success && <div className={styles.success} role="status">{success}</div>}

            {/* New transaction form */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('finances.newTransaction')}</h2>
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <div className={styles.formRow}>
                        <div className={[styles.field, styles.fieldWide].join(' ')}>
                            <label className={styles.label}>{t('finances.description')}</label>
                            <input
                                className={styles.input}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g. Monthly subscription - João"
                                disabled={submitting}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('finances.amount')}</label>
                            <input
                                className={styles.input}
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                disabled={submitting}
                            />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('finances.type')}</label>
                            <select
                                className={styles.input}
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                disabled={submitting}
                            >
                                {TRANSACTION_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('finances.category')}</label>
                            <select
                                className={styles.input}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                disabled={submitting}
                            >
                                {TRANSACTION_CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('finances.date')}</label>
                            <input
                                className={styles.input}
                                type="date"
                                value={transactionDate}
                                onChange={(e) => setDate(e.target.value)}
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={submitting}>
                        {submitting ? <span className={styles.spinner} /> : t('finances.register')}
                    </button>
                </form>
            </section>

            {/* Transaction Sections */}
            {transactions.length > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        {t('finances.sessionTransactions')} ({transactions.length})
                    </h2>
                    <div className={styles.list}>
                        <div className={styles.listHeader}>
                            <span>{t('finances.date')}</span>
                            <span>{t('finances.description')}</span>
                            <span>{t('finances.category')}</span>
                            <span>{t('finances.amount')}</span>
                        </div>
                        {transactions.map((t) => (
                            <TransactionRow key={t.id} t={t} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}