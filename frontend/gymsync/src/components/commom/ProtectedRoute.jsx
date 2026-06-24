import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/context/AuthContext';
import { getRoleFromToken } from '../../utils/jwt';

import { ROLE_HOME } from '../../routing/routeConfig';

/**
 * Protects routes by authentication and optionally by role.
 * Role should always be read from the JWT, never from localStorage directly.
 *
 * @param {React.ReactNode} children  - Conteúdo da rota protegida
 * @param {string[]} [allowedRoles] - e.g. ['ADMIN'] or ['TRAINER', 'ADMIN']
 *
 * @example
 * // any authenticated user
 * <ProtectedRoute><Dashboard /></ProtectedRoute>
 *
 * // only trainers
 * <ProtectedRoute role="TRAINER"><AgendaTreinador /></ProtectedRoute>
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
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

	if (allowedRoles?.length) {

		// BEGIN COMENTAR AQUI PRA TESTAR EM DEV AS PÁGINAS
        // const role = getRoleFromToken();
        // if (!allowedRoles.includes(role)) {
        //     return <Navigate to="/dashboard" replace />;
        // }
		// END COMENTAR AQUI PRA TESTAR EM DEV AS PÁGINAS
    }

	// Se estiver autenticado e o loading terminou, renderiza o componente filho (Protected child)
	return children;
};

export default ProtectedRoute;