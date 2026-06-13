/**
 * Página de Cadastro.
 *
 * @component
 * @description
 * Wrapper visual para o formulário de registro. Centraliza o componente `<RegisterForm />`
 * na tela e aplica o layout padrão de formulários.
 */
export default function Register() {
  return (
    <div className="form-container">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <h2 className="text-center mb-4">Cadastro</h2>
        </div>
      </div>
    </div>
  );
}