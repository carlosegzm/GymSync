// react
import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// context
import { useAuth } from "../../../hooks/context/AuthContext";

// services 
import authService from '../../../services/authService';

// routing
import { ROLE_HOME, ROLES } from '../../../routing/routeConfig';

// styles
import styles from './AuthForms.module.css';

/**
 * Calcula a força da senha de 0 a 4 (Apenas a pontuação).
 * @param {string} password
 * @returns {number} score
 */
function calculatePasswordStrength(password) {
    if (!password) return 0;

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
}

/**
 * Formulário de cadastro de novo usuário.
 *
 * @component
 * @description
 * Gerencia validação client-side, medidor visual de força de senha,
 * seleção de role e chamada ao authService.register().
 * Não tem conhecimento do layout externo.
 */
export default function RegisterForm() {
    const { t } = useTranslation();

    const { login } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirm] = useState('');
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const strength = useMemo(() => calculatePasswordStrength(password), [password]);

    const strengthProps = useMemo(() => {
        if (strength === 0) return { label: '', color: '' };

        const map = {
            1: { label: t('auth.strength.weak'), color: '#ff4757' },
            2: { label: t('auth.strength.regular'), color: '#ffa502' },
            3: { label: t('auth.strength.good'), color: '#2ed573' },
            4: { label: t('auth.strength.strong'), color: '#e8ff47' },
        };
        return map[strength] ?? { label: '', color: '' };
    }, [strength, t]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name.trim()) { setError(t('auth.validation.nameRequired')); return; }
        if (!email.trim()) { setError(t('auth.validation.emailRequired')); return; }
        if (score < 2) { setError(t('auth.validation.passwordTooWeak')); return; }
        if (password !== confirmPassword) { setError(t('auth.validation.passwordsDoNotMatch')); return; }

        setLoading(true);
        try {
            const user = await authService.register({ name, email, password });
            login(user);
            setSuccess(t('auth.validation.registerSuccess'));
            setTimeout(() => navigate('/dashboard'), 1800);
        } catch (err) {
            const msg = err.response?.data?.message ?? err.message ?? t('auth.validation.loginFailed');
            setError(msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>{t('auth.register.title')}</h2>
                <p className={styles.formSubtitle}>{t('auth.register.subtitle')}</p>
            </div>

            {/* Name Field */}
            <div className={styles.field}>
                <label htmlFor="reg-name" className={styles.label}>{t('auth.form.fullNameLabel')}</label>
                <input
                    id="reg-name"
                    type="text"
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('auth.form.fullNamePlaceholder')}
                    autoComplete="name"
                    autoFocus
                    disabled={loading}
                />
            </div>

            {/* Email Field */}
            <div className={styles.field}>
                <label htmlFor="reg-email" className={styles.label}>{t('auth.form.emailLabel')}</label>
                <input
                    id="reg-email"
                    type="email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.form.emailPlaceholder')}
                    autoComplete="email"
                    disabled={loading}
                />
            </div>

            {/* Password Field */}
            <div className={styles.field}>
                <label htmlFor="reg-password" className={styles.label}>{t('auth.form.passwordLabel')}</label>
                <div className={styles.inputWrapper}>
                    <input
                        id="reg-password"
                        type={visiblePassword ? 'text' : 'password'}
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('auth.form.passwordPlaceholder')}
                        autoComplete="new-password"
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setVisiblePassword((v) => !v)}
                        aria-label={visiblePassword ? t('auth.form.hidePassword') : t('auth.form.showPassword')}
                    >
                        {visiblePassword ? '🙈' : '👁️'}
                    </button>
                </div>

                {/* Medidor de força dinâmico */}
                {password && (
                    <div className={styles.strengthMeter}>
                        <div className={styles.strengthBars}>
                            {[1, 2, 3, 4].map((n) => (
                                <div
                                    key={n}
                                    className={styles.strengthBar}
                                    style={{
                                        background: n <= score ? strengthProps.color : 'var(--border)',
                                        transition: 'background 0.3s',
                                    }}
                                />
                            ))}
                        </div>
                        <span className={styles.strengthLabel} style={{ color: strengthProps.color }}>
                            {strengthProps.label}
                        </span>
                    </div>
                )}
            </div>

            {/* Confirm Password Field */}
            <div className={styles.field}>
                <label htmlFor="reg-confirm" className={styles.label}>{t('auth.form.confirmPasswordLabel')}</label>
                <div className={styles.inputWrapper}>
                    <input
                        id="reg-confirm"
                        type={visiblePassword ? 'text' : 'password'}
                        className={styles.input}
                        value={confirmPassword}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder={t('auth.form.confirmPasswordPlaceholder')}
                        autoComplete="new-password"
                        disabled={loading}
                    />
                    {confirmPassword && (
                        <span className={styles.matchIcon}>
                            {confirmPassword === password ? '✅' : '❌'}
                        </span>
                    )}
                </div>
            </div>

            {/* Feedback messages */}
            {error && (
                <div className={styles.error} role="alert">
                    {error}
                </div>
            )}

            {success && (
                <div className={styles.success} role="status">
                    {success}
                </div>
            )}

            <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
            >
                {loading ? <span className={styles.spinner} /> : t('auth.form.submitRegister')}
            </button>

            <p className={styles.switchLink}>
                {t('auth.register.alreadyHaveAccount')}{' '}
                <Link to="/login">{t('auth.register.signInLink')}</Link>
            </p>
        </form>
    );
}
