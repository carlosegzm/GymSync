// react
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

// context
import { useAuth } from "../../../hooks/context/AuthContext";

// services
import authService from '../../../services/authService';

// routing
import { ROLE_HOME } from "../../../routing/routeConfig";

// styles
import styles from './AuthForms.module.css';

// testing
const DEV_PROFILES = [
	{ label: 'Admin', email: 'admin@gymsync.com', password: '123456', role: 'ADMIN' },
	{ label: 'Trainer', email: 'trainer@gymsync.com', password: '123456', role: 'TRAINER' },
	{ label: 'Client', email: 'client@gymsync.com', password: '123456', role: 'CLIENT' },
];

/**
 * Login form component.
 *
 * @component
 * @description
 * Manages form state, client-side validation, authService call,
 * and post-login redirect based on the user's role.
 * Has no knowledge of the outer layout — inserted by Login.jsx.
 */
export default function LoginForm() {
	const { t } = useTranslation();

	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [visiblePassword, setVisiblePassword] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	function fillProfile(profile) {
		setEmail(profile.email);
		setPassword(profile.password);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');

		if (!email.trim()) { setError(t('auth.validation.emailRequired')); return; }
        if (!password) { setError(t('auth.validation.passwordRequired')); return; }

		setLoading(true);
		try {
			const userData = await authService.login(email, password);
			login(userData);

			// Redirect to the route the user was trying to access,
			// or to the default home for their role.
			const destination = location.state?.from?.pathname ?? '/dashboard';
			console.log(destination);
			navigate(destination, { replace: true });
		} catch (err) {
			const msg = err.response?.data?.message ?? err.message ?? t('auth.validation.loginFailed');
            setError(msg);
		} finally {
			setLoading(false);
		}
	}


	return (
		<form className={styles.form} onSubmit={handleSubmit} noValidate>
			{import.meta.env.DEV && (
				<div className={styles.devHint}>
					<span>{t('auth.form.quickLogin')}</span>
					<div className={styles.devProfiles}>
						{DEV_PROFILES.map((p) => (
							<button
								key={p.role}
								type="button"
								className={styles.devProfileBtn}
								onClick={() => fillProfile(p)}
							>
								{p.label}
							</button>
						))}
					</div>
				</div>
			)}

			<div className={styles.formHeader}>
				<h2 className={styles.formTitle}>{t('auth.login.title')}</h2>
				<p className={styles.formSubtitle}>{t('auth.login.subtitle')}</p>
			</div>

			{/* Email Field */}
			<div className={styles.field}>
				<label htmlFor="login-email" className={styles.label}>{t('auth.form.emailLabel')}</label>
				<input
					id="login-email"
					type="email"
					className={styles.input}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder={t('auth.form.emailPlaceholder')}
					autoComplete="email"
					autoFocus
					disabled={loading}
				/>
			</div>

			{/* Password Field with visibility */}
			<div className={styles.field}>
				<label htmlFor="login-password" className={styles.label}>{t('auth.form.passwordLabel')}</label>
				<div className={styles.inputWrapper}>
					<input
						id="login-password"
						type={visiblePassword ? 'text' : 'password'}
						className={styles.input}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="••••••••"
						autoComplete="current-password"
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
			</div>

			{/* Error msg */}
			{error && (
				<div className={styles.error} role="alert">
					{error}
				</div>
			)}

			{/* Submit bttn */}
			<button type="submit" className={styles.submitBtn} disabled={loading}>
				{loading ? <span className={styles.spinner} /> : t('auth.form.submitLogin')}
			</button>

			{/* Redirect to Register page */}
			<p className={styles.switchLink}>
				{t('auth.login.dontHaveAccount')}{' '}
				<Link to="/register">{t('auth.login.createOne')}</Link>
			</p>
		</form>
	);
}
