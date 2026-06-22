import api from "./api";

/**
 * Service for fetching gym dashboard metrics and analytics.
 */
const dashboardService = {
	/**
	 * Retrieves high-level business metrics for a specific gym dashboard.
	 * GET /api/dashboard/{gymId}/metrics
	 *
	 * @param {string} gymId - Gym UUID (path)
	 * @returns {Promise<{ gymId, activeMembers, membersExpiringIn30Days, netFinancialBalance }>}
	 */
	async getMetrics(gymId) {
		const { data } = await api.get(`/api/dashboard/${gymId}/metrics`);
		return data;
	},
};

export default dashboardService;