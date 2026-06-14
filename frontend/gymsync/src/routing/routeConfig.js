/**
 * @file routeConfig.js
 * @description Mapa declarativo de rotas por role.
 *
 * Para adicionar um novo role (ex: ADMIN), basta criar uma nova entrada
 * neste objeto. Nenhum outro arquivo precisa ser alterado.
 *
 * Estrutura de cada rota:
 * @property {string}  path       - Caminho da URL
 * @property {string}  label      - Chave i18n para o label do menu
 * @property {string}  icon       - Ícone (emoji ou nome de ícone)
 * @property {boolean} [index]    - Se é a rota index (dashboard) do role
 * @property {boolean} [hideNav]  - Se não aparece na navegação lateral
 */

export const ROLES = {
  ALUNO:     'ALUNO',
  TREINADOR: 'TREINADOR',
  // ADMIN:  'ADMIN',   ← descomente quando precisar
};

/** Rota de fallback para cada role após o login */
export const ROLE_HOME = {
  [ROLES.ALUNO]:     '/aluno/dashboard',
  [ROLES.TREINADOR]: '/treinador/dashboard',
  // [ROLES.ADMIN]:  '/admin/dashboard',
};

/**
 * Definição completa de rotas por role.
 * Lazy imports são feitos aqui para code-splitting automático.
 */
export const ROUTE_CONFIG = {
  [ROLES.ALUNO]: [
    {
      path:      '/aluno/dashboard',
      label:     'nav.dashboard',
      icon:      '⊞',
      index:     true,
      // component: lazy(() => import('../pages/aluno/Dashboard')),
    },
    {
      path:      '/aluno/agenda',
      label:     'nav.agenda',
      icon:      '📅',
      // component: lazy(() => import('../pages/aluno/Agenda')),
    },
    {
      path:      '/aluno/aulas',
      label:     'nav.aulas',
      icon:      '🏋️',
      // component: lazy(() => import('../pages/aluno/Aulas')),
    },
    {
      path:      '/aluno/evolucao',
      label:     'nav.evolucao',
      icon:      '📈',
      // component: lazy(() => import('../pages/aluno/Evolucao')),
    },
  ],

  [ROLES.TREINADOR]: [
    {
      path:      '/treinador/dashboard',
      label:     'nav.dashboard',
      icon:      '⊞',
      index:     true,
      // component: lazy(() => import('../pages/treinador/Dashboard')),
    },
    {
      path:      '/treinador/agenda',
      label:     'nav.agenda',
      icon:      '📅',
      // component: lazy(() => import('../pages/treinador/Agenda')),
    },
    {
      path:      '/treinador/aulas',
      label:     'nav.aulas',
      icon:      '🏋️',
      // component: lazy(() => import('../pages/treinador/Aulas')),
    },
    {
      path:      '/treinador/alunos',
      label:     'nav.alunos',
      icon:      '👥',
      // component: lazy(() => import('../pages/treinador/Alunos')),
    },
    {
      path:      '/treinador/avaliacoes',
      label:     'nav.avaliacoes',
      icon:      '📋',
      // component: lazy(() => import('../pages/treinador/Avaliacoes')),
    },
    {
      path:      '/treinador/relatorios',
      label:     'nav.relatorios',
      icon:      '📊',
      // component: lazy(() => import('../pages/treinador/Relatorios')),
    },
  ],

  // se necessário
  // [ROLES.ADMIN]: [
  //   { path: '/admin/dashboard', label: 'nav.dashboard', icon: '🛡️', index: true },
  //   { path: '/admin/usuarios',  label: 'nav.usuarios',  icon: '👤' },
  //   { path: '/admin/sistema',   label: 'nav.sistema',   icon: '⚙️' },
  // ],
};
