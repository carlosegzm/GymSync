import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { useAuth } from '../../hooks/context/AuthContext';

/**
 * Barra de Navegação Principal (Topo).
 *
 * @component
 * @description
 * Componente persistente exibido em todas as páginas.
 * Gerencia a navegação e a exibição do estado da sessão do usuário.
 *
 * Comportamento Condicional:
 * - **Visitante:** 
 * - **Logado:** 
 */
function NavBar() {
	const { isAuthenticated, logout, user } = useAuth();
	const navigate = useNavigate();

	/**
     * Executa o encerramento da sessão.
     * - Limpa os dados do contexto (via `logout()`).
     * - Redireciona o usuário forçadamente para a tela de login.
     */
	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	/**
     * Elemento customizado para o cabeçalho do Dropdown.
     * @type {JSX.Element}
     */
	const userTitle = (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			<span>Olá, {user?.nome || 'Usuário'}</span>
		</div>
	);

	return (
		<Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
			<Container>
				<Navbar.Brand as={Link} to="/">GymSync</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">

					<Nav className="me-auto">
						{/* Só mostra o link do Dashboard se o usuário estiver logado */}
						{isAuthenticated && (
							<Nav.Link as={Link} to="/">Dashboard</Nav.Link>
						)}
					</Nav>

					<Nav>
						{isAuthenticated ? (
							// Menu para usuário LOGADO
							<NavDropdown title={userTitle} id="basic-nav-dropdown">
								{/* TODO profile */}
                                <NavDropdown.Item as={Link} to="/profile"> 
									Perfil
								</NavDropdown.Item>
								
								<NavDropdown.Divider />
								
								<NavDropdown.Item onClick={handleLogout}>
									Sair
								</NavDropdown.Item>
							</NavDropdown>
						) : (
							// Links para usuário DESLOGADO
							<>
								<Nav.Link as={Link} to="/login">Login</Nav.Link>
								<Nav.Link as={Link} to="/register">Cadastrar</Nav.Link>
							</>
						)}
					</Nav>

				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default NavBar;