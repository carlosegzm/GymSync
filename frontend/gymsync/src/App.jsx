// React
import React from 'react';
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";

//Paginas
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";

//Layout e seguranca
import AppLayout from './layout/AppLayout';
import ProtectedRoute from './components/commom/ProtectedRoute';

// Contexto
import { AuthProvider } from './context/AuthContext';

/**
 * Entry Point da aplicação
 *
 * Configura o roteamento e inicializa a renderização do React na DOM.
 *
 * @description
 * 1. **Roteamento:** Utiliza `createHashRouter` para gerenciar a navegação.
 * 2. **Layout:** Define `AppLayout` como o componente raiz visual, onde todas
 * as outras páginas são renderizadas dentro dele (via Outlet).
 * 3. **Providers:** Envolve toda a app no `AuthProvider` para garantir que
 * o estado de login esteja acessível globalmente.
 */
const router = createHashRouter([
	{
		path: '/',
		element: <AppLayout />,
		children: [
			// Rotas Protegidas
			{
				index: true,
				element: (
					<ProtectedRoute>
						<Dashboard />
					</ProtectedRoute>
				),
			},
			{
				path: 'profile',
				element: (
					<ProtectedRoute>
						<Profile />
					</ProtectedRoute>
				),
			},

			// Rotas Públicas que compartilham o mesmo layout
			{
				path: 'login',
				element: <Login />,
			},
		],
	},

	// adicionar aqui rotas que não devem ter layout nenhum,
	// ex: 404 page
	// { path: '*', element: <NotFoundPage /> }

]);

/**
 * Inicialização do React 18.
 *
 * @note **Por que `createRoot`?**
 * É a nova API do React que substitui o antigo `ReactDOM.render`.
 * Ela habilita os recursos de "Concorrência" (Concurrent Mode), permitindo
 * renderizações mais performáticas e transições de estado automáticas (batching).
 *
 * @note **Por que `createHashRouter`?**
 * Optou-se pelo uso de Hash (#) na URL (ex: meussite.com/#/login) para facilitar o deploy.
 * Isso evita erros de "404 Not Found" em servidores estáticos (como GitHub Pages, S3 ou Netlify)
 * quando o usuário recarrega a página (F5) em uma rota profunda.
 */
createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</React.StrictMode>
);