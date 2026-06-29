// React
import React, { createContext, useContext, useState, useEffect } from 'react';

// service
import authService from '../../services/authService';

// utils 
import { decodeJwt } from '../../utils/jwt';
import { getRoleFromToken } from '../../utils/jwt';

const AuthContext = createContext(null);

/**
 * Provides an authentication state to the entire application.
 * 
 * Persistência no localStorage:
 *   - 'user'  → { id, name, email, role }
 *   - 'token' → JWT
 */
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	/**
	 * Loads session from localstorage after a page load
	 */
	useEffect(() => {
		const loadUserFromStorage = async () => {
			try {
				const storedUser = localStorage.getItem('user');
				const token = localStorage.getItem('token');

				console.log('1. storedUser:', storedUser);
				console.log('2. token:', token);

				if (!storedUser || !token) return;

				const validation = await authService.validateToken();
				console.log('3. validation:', validation);

				if (!validation.valid) { cleanup(); return; }

				const me = await authService.getMe();
				console.log('4. me:', me);

				if (me.gymId) localStorage.setItem('gymId', me.gymId);

				setUser(JSON.parse(storedUser));
				setIsAuthenticated(true);

			} catch (err) {
				console.error('5. ERRO que está causando cleanup:', err);
				cleanup();
			} finally {
				setIsLoading(false);
			}
		};

		loadUserFromStorage();
	}, []);

	/**
	 * Limpa o local storage e torna o usuário não autenticado
	 */
	const cleanup = () => {
		localStorage.clear();
		setIsAuthenticated(false);
		setUser(null);
	}

	/**
	 * Salva o user depois de um login bem sucedido
	 *
	 * @param {{ id, name, email, role, token, gymId }} data
	 */
	const login = async (data) => {
		const tokenPayload = decodeJwt(data.token);

		const userToStore = {
			id: data.id,
			name: data.name,
			email: data.email,
			role: tokenPayload?.role ?? data.role, // JWT primeiro, fallback no response
		};

		// 1. Salva no localStorage sincronamente
		localStorage.setItem('user', JSON.stringify(userToStore));
		localStorage.setItem('token', data.token ?? '');
		localStorage.setItem('gymId', data.gymId ?? '');

		// Isso garante que o ProtectedRoute veja o usuário como autenticado logo no próximo render.
		setUser(userToStore);
		setIsAuthenticated(true);

		// 2. Busca o gymId em segundo plano sem travar o estado de autenticação do app
		if (!data.gymId) {
			try {
				const me = await authService.getMe();
				if (me.gymId) localStorage.setItem('gymId', me.gymId);
			} catch (err) {
				console.error("Erro ao buscar dados complementares do usuário:", err);
			}
		}
	};

	/**
	 * Atualiza a informação de um usuário
	 * Preserva id e Role (por enquanto)
	 *
	 * @param {Partial<typeof user>} newData
	 */
	const updateUser = (newData) => {
		const merged = { ...user, ...newData };
		localStorage.setItem('user', JSON.stringify(merged));
		setUser(merged);
	};

	// limpa a sessão
	const logout = () => {
		cleanup();
	};

	const value = {
		user,
		isAuthenticated,
		isLoading,
		login,
		logout,
		updateUser
	};

	return (
		<AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, updateUser }}>
			{children}
		</AuthContext.Provider>
	);
};

/**
 * Hook to access the auth context from any component.
 * Must be used inside AuthProvider.
 *
 * @returns {{ user, isAuthenticated, isLoading, login, logout, updateUser }}
 */
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth deve ser usado dentro de um AuthProvider');
	}
	return context;
};