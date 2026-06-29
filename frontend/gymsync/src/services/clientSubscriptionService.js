import api from "./api";

/**
 * Service for managing client gym subscriptions and plans.
 */
const clientSubscriptionService = {
	/**
	 * Enrolls a client into a specific subscription plan.
	 * POST /api/subscriptions/enroll
	 *
	 * @param {Object} payload
	 * @param {string} payload.clientId - Client UUID
	 * @param {string} payload.planId   - Plan UUID
	 * @returns {Promise<{ id, clientId, planId, startDate, endDate, status }>}
	 */
	async enroll({ clientId, planId }) {
		const { data } = await api.post('/api/subscriptions/enroll', {
			clientId,
			planId,
		});
		return data;
	},

	/**
	 * Cancels an active client subscription.
	 * PATCH /api/subscriptions/{subscriptionId}/cancel
	 *
	 * @param {string} subscriptionId - Subscription UUID (path)
	 * @returns {Promise<void>}
	 */
	async cancelSubscription(subscriptionId) {
		const { data } = await api.patch(`/api/subscriptions/${subscriptionId}/cancel`);
		return data;
	},

	/**
	 * Fetches the active subscription for the currently logged-in client.
	 * GET /api/subscriptions/client/me
	 *
	 * @returns {Promise<{ id, clientId, planId, startDate, endDate, status }>}
	 */
	async getMySubscription() {
		const { data } = await api.get('/api/subscriptions/client/me');
		return data;
	},

	/**
	 * Lists all subscriptions for a specific gym.
	 * GET /api/subscriptions/gym/{gymId}
	 *
	 * @param {string} gymId - Gym UUID (path)
	 * @returns {Promise<Array<{ id, clientId, planId, startDate, endDate, status }>>}
	 */
	async listByGym(gymId) {
		const { data } = await api.get(`/api/subscriptions/gym/${gymId}`);
		return data;
	},
};

export default clientSubscriptionService;