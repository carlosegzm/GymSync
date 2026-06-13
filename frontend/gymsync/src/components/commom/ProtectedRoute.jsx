import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente de rota protegida (HOC - Higher Order Component).
 *
 * @component
 * @description
 * Envolve componentes que requerem autenticação. Gerencia o fluxo de acesso:
 * 1. **Loading:** Enquanto verifica o token, exibe "Carregando...".
 * 2. **Não Autenticado:** Redireciona para `/login` salvando a localização atual (para retorno pós-login).
 * 3. **Autenticado:** Renderiza o conteúdo filho (`children`).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - O componente da página que deve ser protegido.
 *
 * @example
 * <ProtectedRoute>
 *     <Dashboard />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	console.log((isAuthenticated))

	if (isLoading) {
		return <p>Carregando...</p>;
	}

	// Se não estiver autenticado, redireciona para a página de login
	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	// Se estiver autenticado e o loading terminou, renderiza o componente filho (Protected child)
	return children;
};

export default ProtectedRoute;