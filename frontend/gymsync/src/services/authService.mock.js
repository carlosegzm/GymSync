/**
 * @file authService.mock.js
 * @description Mock do serviço de autenticação.
 * Simula delay de rede e retorna dados compatíveis com o AuthContext.
 *
 * Credenciais de teste:
 *   aluno@gymsync.com     / 123456  → role ALUNO
 *   treinador@gymsync.com / 123456  → role TREINADOR
 *
 * Será substituido pelo authService real quando os endpoints do back estiverem prontos
 */

const MOCK_DELAY = 200; // ms

const MOCK_DB = [
  {
    id: 1,
    nome: 'Carlos Eduardo',
    email: 'aluno@gymsync.com',
    senha: '123456',
    role: 'ALUNO',
    fotoPerfil: null,
    token: 'mock-jwt-aluno-token',
  },
  {
    id: 2,
    nome: 'Vinícius Corbellini',
    email: 'treinador@gymsync.com',
    senha: '123456',
    role: 'TREINADOR',
    fotoPerfil: null,
    token: 'mock-jwt-treinador-token',
  },
];

/** Simula latência de API */
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const authService = {
  /**
   * Autentica o usuário com email e senha.
   * @param {string} email
   * @param {string} senha
   * @returns {Promise<{id, nome, email, role, fotoPerfil, token}>}
   * @throws {Error} Se as credenciais forem inválidas
   */
  async login(email, senha) {
    await delay(MOCK_DELAY);
    const user = MOCK_DB.find(
      (u) => u.email === email && u.senha === senha
    );
    if (!user) throw new Error('Credenciais inválidas.');
    const { senha: _, ...userSemSenha } = user;
    return userSemSenha;
  },

  /**
   * Registra um novo usuário.
   * @param {{ nome: string, email: string, senha: string, role: string }} dados
   * @returns {Promise<{id, nome, email, role, fotoPerfil, token}>}
   * @throws {Error} Se o email já estiver em uso
   */
  async register({ nome, email, senha, role }) {
    await delay(MOCK_DELAY);
    if (MOCK_DB.find((u) => u.email === email)) {
      throw new Error('Este e-mail já está em uso.');
    }
    const novoUser = {
      id: MOCK_DB.length + 1,
      nome,
      email,
      role: role ?? 'ALUNO',
      fotoPerfil: null,
      token: `mock-jwt-${Date.now()}`,
    };
    MOCK_DB.push({ ...novoUser, senha });
    return novoUser;
  },

  /**
   * Valida se o token atual ainda é válido.
   * @returns {Promise<boolean>}
   */
  async validate() {
    await delay(200);
    return true; // mock: token sempre válido
  },
};

export default authService;
