import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { ROLE_HOME } from '../../routing/routeConfig';

/**
 * Protege rotas por autenticação e/ou role.
 *
 * @param {React.ReactNode} children  - Conteúdo da rota protegida
 * @param {string}          [role]    - Role exigido (ex: 'ALUNO', 'TREINADOR').
 *                                      Se omitido, aceita qualquer usuário autenticado.
 *
 * @example
 * // Qualquer usuário autenticado:
 * <ProtectedRoute><Dashboard /></ProtectedRoute>
 *
 * // Apenas treinadores:
 * <ProtectedRoute role="TREINADOR"><AgendaTreinador /></ProtectedRoute>
 */
const ProtectedRoute = ({ children, role }) => {
	const { isAuthenticated, isLoading, user } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return (
			<div style={{
				display: 'flex', alignItems: 'center', justifyContent: 'center',
				height: '100vh', background: 'var(--bg-base)', color: 'var(--text-secondary)',
				fontFamily: 'var(--font-body)',
			}}>
				Carregando...
			</div>
		);
	}

	// Se não estiver autenticado, redireciona para a página de login
	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	// Role incorreto: redireciona para o home do role atual do usuário
  if (role && user?.role !== role) {
    const home = ROLE_HOME[user?.role] ?? '/login';
    return <Navigate to={home} replace />;
  }

	// Se estiver autenticado e o loading terminou, renderiza o componente filho (Protected child)
	return children;
};

export default ProtectedRoute;