import api from './api';

/**
 * Authentication service.
 * Handles login and registration against the real Spring Boot backend.
 */
const authService = {
	/**
	 * Authenticates a user via query params (as required by the backend).
	 * POST /api/users/login?email=...&password=...
	 *
	 * @param {string} email
	 * @param {string} password
	 * @returns {Promise<{ id, name, email, role, token }>}
	 */
	async login(email, password) {
		const { data } = await api.post('/api/users/login', {
			email, 
			password
		});
		return data;
	},

	/**
	 * Registers a new user (CLIENT role) via JSON body.
	 * POST /api/users/register
	 *
	 * @param {{ name, email, password }} payload
	 * @returns {Promise<{ id, name, email, role, token }>}
	 */
	async register({ name, email, password }) {
		const { data } = await api.post('/api/users/register', {
			name,
			email,
			password,
			role: 'CLIENT'
		});
		return data;
	},

	/**
	 * Validates the current JWT token.
	 * GET /api/auth/validate
	 * 
	 * @returns {Promise<{ valid: boolean, subject: string }>}
	 */
	async validateToken() {
		const { data } = await api.get('/api/users/validate');
		return data;
	},

};

export default authService;
