import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      {/* Lado esquerdo — branding */}
      <div className={styles.brand}>
        <div className={styles.brandContent}>
          <p className={styles.brandEyebrow}>{t('auth.systemManagement')}</p>
          <h1 className={styles.brandLogo}>
            <span className={styles.brandAccent}>GYM</span>SYNC
          </h1>
          <p className={styles.brandTagline}>
            {t('auth.register.tagline')}
          </p>

          <ul className={styles.brandFeatures}>
            <li><span className={styles.featureDot} />{t('auth.register.feature1')}</li>
            <li><span className={styles.featureDot} />{t('auth.register.feature2')}</li>
            <li><span className={styles.featureDot} />{t('auth.register.feature3')}</li>
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
