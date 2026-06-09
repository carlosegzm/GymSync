import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// context
import { useAuth } from '../context/AuthContext';

// commons
// ...

// components
// ...

// services and hooks
// ...

/**
 * Tela de Perfil do Usuário.
 *
 * @description
 * Centraliza o gerenciamento da conta e conteúdo do usuário. Permite:
 * 1. Visualizar dados cadastrais.
 * 2. Editar perfil ou Excluir a conta permanentemente.
 * 3. Gerenciar Evolução física
 */
export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return <p>Carregando...</p>;

    return (
        <div>
            <p>TODO</p>
        </div>
    );
}