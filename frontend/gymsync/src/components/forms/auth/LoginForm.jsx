// react
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

// context
import { useAuth } from "../../../hooks/context/AuthContext";

// services
import authService from '../../../services/authService';

// routing
import { ROLE_HOME } from "../../../routing/routeConfig";

// styles
import styles from './AuthForms.module.css';

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
	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const [email, setEmail]                   = useState('');
	const [password, setPassword]             = useState('');
	const [visiblePassword, setVisiblePassword] = useState(false);
	const [error, setError]                   = useState('');
	const [loading, setLoading]               = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');

		if (!email.trim()) { setError('Please enter your email.');    return; }
		if (!password)     { setError('Please enter your password.'); return; }

		setLoading(true);
		try {
			const userData = await authService.login(email, password);
			login(userData);

			// Redirect to the route the user was trying to access,
			// or to the default home for their role.
			const destination = location.state?.from?.pathname ?? '/dashboard';
			navigate(destination, { replace: true });
		} catch (err) {
			const msg = err.response?.data?.message ?? err.message ?? 'Login failed. Please try again.';
			setError(err.message ?? 'Login failed. Please try again.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<form className={styles.form} onSubmit={handleSubmit} noValidate>
			<div className={styles.formHeader}>
				<h2 className={styles.formTitle}>Sign in</h2>
				<p className={styles.formSubtitle}>Access your GymSync account</p>
			</div>

			{/* Email Field */}
			<div className={styles.field}>
				<label htmlFor="login-email" className={styles.label}>Email</label>
				<input
					id="login-email"
					type="email"
					className={styles.input}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@email.com"
					autoComplete="email"
					autoFocus
					disabled={loading}
				/>
			</div>

			{/* Password Field with visibility */}
			<div className={styles.field}>
				<label htmlFor="login-password" className={styles.label}>Password</label>
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
						aria-label={visiblePassword ? 'Hide password' : 'Show password'}
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
				{loading ? <span className={styles.spinner} /> : 'Sign in'}
			</button>

			{/* Redirect to Register page */}
			<p className={styles.switchLink}>
				Don't have an account?{' '}
				<Link to="/register">Create one</Link>
			</p>
		</form>
	);
}
