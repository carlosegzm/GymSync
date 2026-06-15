// react
import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// context
import { useAuth } from '../../../context/AuthContext';

// services 
import authService from '../../../services/authService.mock';

// routing
import { ROLE_HOME, ROLES } from '../../../routing/routeConfig';

// styles
import styles from './AuthForms.module.css';

/**
 * Calcula a força da senha de 0 a 4.
 * @param {string} password
 * @returns {{ score: number, label: string, color: string }}
 */
function calculatePasswordStrength(password) {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const map = {
        1: { label: 'Fraca', color: '#ff4757' },
        2: { label: 'Regular', color: '#ffa502' },
        3: { label: 'Boa', color: '#2ed573' },
        4: { label: 'Forte', color: '#e8ff47' },
    };
    return { score, ...(map[score] ?? { label: '', color: '' }) };
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
    const { login } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirm] = useState('');
    const [role, setRole] = useState(ROLES.ALUNO);
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const strength = useMemo(() => calculatePasswordStrength(password), [password]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (!name.trim()) { setError('Informe seu nome.'); return; }
        if (!email.trim()) { setError('Informe o e-mail.'); return; }
        if (strength.score < 2) { setError('Escolha uma senha mais forte.'); return; }
        if (password !== confirmPassword) { setError('As senhas não coincidem.'); return; }

        setLoading(true);
        try {
            const userData = await authService.register({ name, email, password, role });
            login(userData);
            navigate(ROLE_HOME[userData.role] ?? '/', { replace: true });
        } catch (err) {
            setError(err.message ?? 'Erro ao criar conta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Criar conta</h2>
                <p className={styles.formSubtitle}>Junte-se ao GymSync</p>
            </div>

            {/* Seletor de Role */}
            <div className={styles.roleSelector}>
                {Object.values(ROLES).map((r) => (
                    <button
                        key={r}
                        type="button"
                        className={[styles.roleBtn, role === r ? styles.roleBtnActive : ''].join(' ')}
                        onClick={() => setRole(r)}
                        disabled={loading}
                    >
                        <span className={styles.roleIcon}>{r === ROLES.ALUNO ? '🏃' : '🏋️'}</span>
                        <span className={styles.roleLabel}>{r === ROLES.ALUNO ? 'Aluno' : 'Treinador'}</span>
                    </button>
                ))}
            </div>

            <div className={styles.field}>
                <label htmlFor="reg-name" className={styles.label}>Nome completo</label>
                <input
                    id="reg-name"
                    type="text"
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    autoComplete="name"
                    autoFocus
                    disabled={loading}
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="reg-email" className={styles.label}>E-mail</label>
                <input
                    id="reg-email"
                    type="email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    autoComplete="email"
                    disabled={loading}
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="reg-password" className={styles.label}>Senha</label>
                <div className={styles.inputWrapper}>
                    <input
                        id="reg-password"
                        type={visiblePassword ? 'text' : 'password'}
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        autoComplete="new-password"
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setVisiblePassword((v) => !v)}
                        aria-label={visiblePassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                        {visiblePassword ? '🙈' : '👁️'}
                    </button>
                </div>

                {/* Medidor de força — o elemento signature da tela */}
                {password && (
                    <div className={styles.strengthMeter}>
                        <div className={styles.strengthBars}>
                            {[1, 2, 3, 4].map((n) => (
                                <div
                                    key={n}
                                    className={styles.strengthBar}
                                    style={{
                                        background: n <= strength.score ? strength.color : 'var(--border)',
                                        transition: 'background 0.3s',
                                    }}
                                />
                            ))}
                        </div>
                        <span className={styles.strengthLabel} style={{ color: strength.color }}>
                            {strength.label}
                        </span>
                    </div>
                )}
            </div>

            <div className={styles.field}>
                <label htmlFor="reg-confirm" className={styles.label}>Confirmar senha</label>
                <div className={styles.inputWrapper}>
                    <input
                        id="reg-confirm"
                        type={visiblePassword ? 'text' : 'password'}
                        className={styles.input}
                        value={confirmPassword}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Repita a senha"
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

            {error && (
                <div className={styles.error} role="alert">
                    {error}
                </div>
            )}

            <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
            >
                {loading ? <span className={styles.spinner} /> : 'Criar conta'}
            </button>

            <p className={styles.switchLink}>
                Já tem conta?{' '}
                <Link to="/login">Entrar</Link>
            </p>
        </form>
    );
}
