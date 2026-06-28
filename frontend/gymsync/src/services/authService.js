import api from './api';

/**
 * Authentication service.
 * Handles login and registration against the real Spring Boot backend.
 */
const authService = {
	/**
	 * Authenticates a user via JSON body.
	 * POST /api/users/login
	 *
	 * @param {string} email
	 * @param {string} password
	 * @returns {Promise<{ id, name, email, role, token, gymId }>}
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
	 * @returns {Promise<{ id, name, email, role, token, gymId }>}
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

	/**
	 * Get all clients from a specific gym.
	 * GET /api/users/gym/{gymId}/clients
	 *  
	 * hasRole(ADMIN, TRAINER)
	 * 
	 * @param {string} gymId
	 * @returns {Promise<{ id, name, email, role, token, gymId }>}
	 */
	async getClientsByGym(gymId) {
		const { data } = await api.get(`/api/users/gym/${gymId}/clients`);
		return data;
	},

	/**
	 * Get all trainers from a specific gym.
	 * GET /api/users/gym/{gymId}/trainers
	 *
	 * @param {string} gymId
	 * @returns {Promise<{ id, name, email, role, token, gymId }>}
	 */
	async getTrainersByGym(gymId) {
		const { data } = await api.get(`/api/users/gym/${gymId}/trainers`);
		return data;
	},

	/**
	 * Link a user (Trainer or Client) to a Gym.
	 * PATCH /api/users/{userId}/gym/{gymId}
	 * 
	 * hasRole(ADMIN)
	 *  
	 * @param {string} userId
	 * @param {string} gymId
	 * @returns {Promise<{ id, name, email, role, token, gymId }>}
	 */
	async linkUserToGym(userId, gymId) {
		const { data } = await api.patch(`/api/users/${userId}/gym/${gymId}`);
		return data;
	},

	/**
	 * Find user by email.
	 * GET /api/users/email/{email}
	 *
	 * @param {string} email
	 * @returns {Promise<{ id, name, email, role, token, gymId }>}
	 */
	async getUserByEmail(email) {
		const { data } = await api.get(`/api/users/email/${email}`);
		return data;
	},

	/**
	 * 
	 * @returns {Promise<{ id, name, email, role, token, gymId }>}
	 */
	async getMe() {
		const { data } = await api.get('/api/users/me');
		return data;
	},

};

export default authService;
