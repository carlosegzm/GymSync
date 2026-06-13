import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

/**
 * Layout Principal da Aplicação.
 *
 * @component
 * @description
 * Define a estrutura base visível em todas as rotas (exceto 404).
 * Funciona como um "wrapper" que contém:
 * 1. <NavBar />: O menu superior persistente.
 * 2. <Outlet />: Um placeholder especial do React Router onde as
 * páginas filhas (Dashboard, Login, Profile) são renderizadas.
 *
 * Essa estrutura evita repetir a NavBar em cada arquivo de página individual.
 */
function AppLayout() {
	return (
		<>
			<NavBar />
			<main className="container mt-4">
				<Outlet /> {/* As pages filhas (Dashboard, Profile) serao renderizadas aqui */}
			</main>
		</>
	);
};
export default AppLayout;