import api from "./api";

/**
 * Service for managing gym membership plans.
 */
const membershipPlanService = {
	/**
	 * Creates a new membership plan.
	 * POST /api/plans
	 *
	 * @param {Object} payload
	 * @param {string} payload.name             - Plan name
	 * @param {number} payload.price            - Cost of the plan
	 * @param {number} payload.durationInMonths - Duration of the contract in months
	 * @param {string} payload.gymId            - Gym UUID
	 * @returns {Promise<{ id, name, price, durationInMonths, gymId }>}
	 */
	async create({ name, price, durationInMonths, gymId }) {
		const { data } = await api.post('/api/plans', {
			name,
			price,
			durationInMonths,
			gymId,
		});
		return data;
	},

	/**
	 * Lists all membership plans for a specific gym.
	 * GET /api/plans/gym/{gymId}
	 *
	 * @param {string} gymId - Gym UUID (path)
	 * @returns {Promise<Array<{ id, name, price, durationInMonths, gymId }>>}
	 */
	async listByGym(gymId) {
		const { data } = await api.get(`/api/plans/gym/${gymId}`);
		return data;
	},
};

export default membershipPlanService;