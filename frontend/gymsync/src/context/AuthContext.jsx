// MOCK — Será substituido pelo AuthContext.jsx real quando o backend estiver pronto
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// ALternar entre 'ALUNO' e 'TREINADOR' para testar os paineis (quando existirem kkkkkk)
const MOCK_USER = {
	id: 1,
	nome: 'Carlos Eduardo',
	email: 'carlos@gymsync.com',
	fotoPerfil: null,
	role: 'ALUNO', // 'ALUNO' | 'TREINADOR'
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(MOCK_USER);
	const [isAuthenticated, setIsAuthenticated] = useState(true);
	const isLoading = false;

	const login = (data) => {
		const userToStore = {
			id: data.id,
			nome: data.nome,
			fotoPerfil: data.fotoPerfil,
			email: data.email,
			role: data.role,
		};
		setUser(userToStore);
		setIsAuthenticated(true);
	};

	const updateUser = (newUserData) => {
		setUser((prev) => ({ ...prev, ...newUserData }));
	};

	const logout = () => {
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

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth deve ser usado dentro de um AuthProvider');
	}
	return context;
};