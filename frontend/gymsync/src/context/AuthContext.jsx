// React
import React, { createContext, useContext, useState, useEffect } from 'react';

// service
import authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * Provides authentication state to the entire application.
 * 
 * Persistência no localStorage:
 *   - 'user'  → { id, name, email, role }
 *   - 'gymId' → gym.id da resposta do login
 *   - 'token' → JWT (se o futuramente o back responder)
 */
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Carrega a sessão do localstorage ao carregar uma página
	useEffect(() => {
		try {
			const stored = localStorage.getItem('user');
			if (stored) {
				setUser(JSON.parse(stored));
				setIsAuthenticated(true);
			}
		} catch {
			localStorage.clear();
		} finally {
			setIsLoading(false);
		}
	}, []);

	/**
	 * Salva o user e o gymId depois de um login bem sucedido
	 *
	 * @param {{ id, name, email, role, gym: { id, name } }} data
	 */
	const login = (data) => {
		const userToStore = {
			id:    data.id,
			name:  data.name,
			email: data.email,
			role:  data.role,
		};

		localStorage.setItem('user',  JSON.stringify(userToStore));
		localStorage.setItem('gymId', data.gym?.id ?? '');

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

	// limpa a sessão e redireciona para o login
	const logout = () => {
		localStorage.clear();
		setUser(null);
		setIsAuthenticated(false);
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