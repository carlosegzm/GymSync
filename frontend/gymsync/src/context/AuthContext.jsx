// React
import React, { createContext, useContext, useState, useEffect } from 'react';

// service
import authService from '../services/authService';

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
	 * Carrega a sessão do localstorage ao carregar uma página
	 */
	useEffect(() => {
		const loadUserFromStorage = async () => {
			try {
				const storedUser = localStorage.getItem('user');
				const token = localStorage.getItem('token');

				if (!storedUser || !token) return;

				const validation = await authService.validateToken();

				if (validation.valid) {
					setUser(JSON.parse(storedUser));
					setIsAuthenticated(true);
					return;
				}

				console.log('AuthContext: Invalid token, cleaning storage');
				cleanup();
			} catch {
				console.error('AuthContext: Error while loading user');
				cleanup();
			} finally {
				setIsLoading(false);
			}
		}

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
	 * @param {{ id, name, email, role, token }} data
	 */
	const login = (data) => {

		console.log(data)

		const userToStore = {
			id: data.id,
			name: data.name,
			email: data.email,
			role: data.role,
		};

		localStorage.setItem('user', JSON.stringify(userToStore));
		localStorage.setItem('token', data.token ?? '');

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