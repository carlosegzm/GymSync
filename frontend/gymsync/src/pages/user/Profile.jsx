import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// context
import { useAuth } from '../../context/AuthContext';

// components
import Button from '../../components/commom/Button';

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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">

                    {/* Card do Perfil estilo Protótipo */}
                    <div className="card shadow-sm border-0" style={{ borderRadius: '15px', backgroundColor: '#fdfdf5' }}> {/* Cor do fundo do seu desenho */}
                        <div className="card-body text-center p-5 mb-6">

                            {/* Pfp */}
                            <div className="mb-4 position-relative d-inline-block">
                                <img
                                    src={user.fotoPerfil}
                                    alt="Foto de Perfil"
                                    className="rounded-circle border border-3 border-white shadow-sm"
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        objectFit: 'cover',
                                        backgroundColor: '#eee'
                                    }}
                                />
                            </div>

                            {/* Info Cadastrais */}
                            <div className="bg-white p-4 rounded-3 shadow-sm mb-4 text-start">
                                <h5 className="mb-3 text-secondary border-bottom pb-2">Informações Cadastrais</h5>

                                <div className="mb-3">
                                    <label className="small text-muted fw-bold">NOME</label>
                                    <p className="m-0 lead">{user.nome}</p>
                                </div>

                                <div className="mb-3">
                                    <label className="small text-muted fw-bold">EMAIL</label>
                                    <p className="m-0">{user.email}</p>
                                </div>

                                <div className="mb-3">
                                    <label className="small text-muted fw-bold">ROLE</label>
                                    <p className="m-0">{user.role}</p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-3 shadow-sm mb-4 text-start">
                                <h5 className="mb-3 text-secondary border-bottom pb-2">Implementar Página de perfil</h5>
                            </div>
                            

                        </div>
                    </div>
                
                </div>
            </div>
        </div>
    );
}