import api from "./api";

/**
 * Service for gym corporate management.
 */
const gymService = {
	/**
	 * Registers a new gym unit.
	 * POST /api/gyms
	 *
	 * @param {Object} payload
	 * @param {string} payload.name - Gym brand or unit name
	 * @param {string} payload.cnpj - Gym corporate tax ID (CNPJ)
	 * @returns {Promise<{ id, name, cnpj }>}
	 */
	async create({ name, cnpj }) {
		const { data } = await api.post('/api/gyms', {
			name,
			cnpj,
		});
		return data;
	},
};

export default gymService;