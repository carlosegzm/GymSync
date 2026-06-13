// TODO
// import LoginForm from '../components/forms/LoginForm';

/**
 * Página de Login.
 *
 * @component
 * @description
 * Responsável apenas pela estrutura visual (container/grid) que envolve o formulário.
 * A lógica de autenticação e validação reside no componente filho `<LoginForm />`.
 */
export default function Login() {
  return (
    <div className="form-container">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <h2 className="text-center mb-4">Login</h2>
        </div>
      </div>
    </div>
  );
}