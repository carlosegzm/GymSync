import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, ListGroup, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

// Componentes
// ... 

// Serviços e Hooks
// ...

/**
 * Painel Principal (Feed).
 *
 * @description
 * Componente central da aplicação que gerencia:
 * ... componentes
 */
export default function Dashboard() {

	const { isAuthenticated, logout, user } = useAuth();

	return (
		<div>
			<h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem' }}>
				Dashboard
			</h1>
			<p style={{ color: 'var(--text-secondary)' }}>
				Bem-vindo, {user?.nome}. Role: {user?.role}
			</p>
			<p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
				{user?.role === 'ALUNO' ? '→ Implementar painel do aluno' : '→ Implementar painel do treinador'}
			</p>
		</div>
	)
}