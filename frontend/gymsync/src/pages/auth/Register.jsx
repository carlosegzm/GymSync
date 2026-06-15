import RegisterForm from '../../components/forms/auth/RegisterForm';
import styles from './AuthPage.module.css';

/**
 * Página de Cadastro.
 *
 * @component
 * @description
 * Wrapper visual idêntico ao Login, trocando apenas o componente de formulário.
 * Toda a lógica de registro reside em {@link RegisterForm}.
 */
export default function Register() {
  return (
    <div className={styles.page}>
      {/* Lado esquerdo — branding */}
      <div className={styles.brand}>
        <div className={styles.brandContent}>
          <p className={styles.brandEyebrow}>Sistema de Gestão</p>
          <h1 className={styles.brandLogo}>
            <span className={styles.brandAccent}>GYM</span>SYNC
          </h1>
          <p className={styles.brandTagline}>
            Comece hoje. Acompanhe cada avanço da sua jornada.
          </p>

          <ul className={styles.brandFeatures}>
            <li><span className={styles.featureDot} />Perfil de aluno ou treinador</li>
            <li><span className={styles.featureDot} />Histórico completo de avaliações</li>
            <li><span className={styles.featureDot} />Gráficos de evolução mensal</li>
          </ul>
        </div>

        <div className={styles.brandDecor} aria-hidden="true">
          <div className={styles.brandCircle} />
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className={styles.formSide}>
        <div className={styles.formBox}>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
