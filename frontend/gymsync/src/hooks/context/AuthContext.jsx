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

				if (!storedUser || !token) return;

				const validation = await authService.validateToken();
				if (!validation.valid) { cleanup(); return; }

				const tokenRole = getRoleFromToken();
				const stored = JSON.parse(storedUser);

				if (tokenRole && stored.role !== tokenRole) {
					console.warn('AuthContext: role mismatch, cleaning session');
					cleanup();
					return;
				}

				// Atualiza gymId via /me a cada restauração de sessão
				// garante que mudanças no backend (e.g. admin linka gym) sejam refletidas
				const me = await authService.getMe();
				if (me.gymId) localStorage.setItem('gymId', me.gymId);

				setUser({ ...stored, role: tokenRole ?? stored.role });
				setIsAuthenticated(true);

			} catch {
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

		localStorage.setItem('user', JSON.stringify(userToStore));
		localStorage.setItem('token', data.token ?? '');
		localStorage.setItem('gymId', data.gymId ?? '');

		if (!data.gymId) {
			try {
				const me = await authService.getMe();
				if (me.gymId) localStorage.setItem('gymId', me.gymId);
			} catch {}
		}

		setUser(userToStore);
		setIsAuthenticated(true);
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