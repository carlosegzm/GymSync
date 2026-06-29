import { useTranslation } from "react-i18next";

import LoginForm from "../../components/forms/auth/LoginForm";

import styles from './AuthPage.module.css';

/**
 * Página de Login.
 *
 * @component
 * @description
 * Responsável apenas pelo layout split-screen (branding + formulário).
 * Toda a lógica de autenticação e validação reside em {@link LoginForm}.
 */
export default function Login() {
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
            {t('auth.login.tagline')}
          </p>

          <ul className={styles.brandFeatures}>
            <li><span className={styles.featureDot} />{t('auth.login.feature1')}</li>
            <li><span className={styles.featureDot} />{t('auth.login.feature2')}</li>
            <li><span className={styles.featureDot} />{t('auth.login.feature3')}</li>
          </ul>
        </div>

        {/* Decoração de fundo */}
        <div className={styles.brandDecor} aria-hidden="true">
          <div className={styles.brandCircle} />
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className={styles.formSide}>
        <div className={styles.formBox}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
