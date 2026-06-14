// react
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

// context
import { useAuth } from "../../../context/AuthContext";

// services
import authService from '../../../services/authService.mock';

// route
import { ROLE_HOME } from "../../../routing/routeConfig";

// styles
import styles from './AuthForms.module.css';

/**
 * Formulário de login.
 *
 * @component
 * @description
 * Gerencia o estado do form, validação client-side, chamada ao authService
 * e redirecionamento pós-login baseado no role do usuário.
 * Não tem conhecimento do layout externo — é inserido pela página Login.jsx.
 */
export default function LoginForm() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [visiblePassword, setVisiblePassword] = useState(false);
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');

		// validação básica de campos
		if (!email.trim()) { setErro('Informe o e-mail.'); return; }
		if (!password) { setErro('Informe a senha.'); return; }

		setLoading(true);
		try {
			const userData = await authService.login(email, password);
			login(userData);

			// Redireciona para a rota que o usuário tentava acessar antes,
			// ou para o home do role dele.
			const destination = location.state?.from?.pathname ?? ROLE_HOME[userData.role] ?? '/';
			navigate(destination, { replace: true });
		} catch (err) {
			setError(err.message ?? 'Erro ao fazer login. Tente novamente');
		} finally {
			setLoading(false);
		}
	}

	return (
		<form className={styles.form} onSubmit={handleSubmit} noValidate>
			<div className={styles.formHeader}>
				<h2 className={styles.formTitle}>Entrar</h2>
				<p className={styles.formSubtitle}>Acesse sua conta GymSync</p>
			</div>

			{/* Credenciais de teste visíveis em DEV */}
			{import.meta.env.DEV && (
				<div className={styles.devHint}>
					<span>🧪 Mock ativo</span>
					<code>aluno@gymsync.com / 123456</code>
					<code>treinador@gymsync.com / 123456</code>
				</div>
			)}

			{/* Email Field */}
			<div className={styles.field}>
				<label htmlFor="login-email" className={styles.label}>E-mail</label>
				<input
					id="login-email"
					type="email"
					className={styles.input}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="seu@email.com"
					autoComplete="email"
					autoFocus
					disabled={loading}
				/>
			</div>

			{/* Password Field with visibility */}
			<div className={styles.field}>
				<label htmlFor="login-password" className={styles.label}>Senha</label>
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
						aria-label={visiblePassword ? 'Ocultar senha' : 'Mostrar senha'}
					>
						{visiblePassword ? '🙈' : '👁️'}
					</button>
				</div>
			</div>

			{/* Error msg */}
			{error && (
				<div className={styles.error} role="alert">
					{erro}
				</div>
			)}

			{/* Submit bttn */}
			<button
				type="submit"
				className={styles.submitBtn}
				disabled={loading}
			>
				{loading ? <span className={styles.spinner} /> : 'Entrar'}
			</button>

			{/* Redirect to Register page */}
			<p className={styles.switchLink}>
				Não tem conta?{' '}
				<Link to="/register">Criar conta</Link>
			</p>
		</form>
	);
}