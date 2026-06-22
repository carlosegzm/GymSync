import api from "./api";

/**
 * Service for generating and downloading gym reports.
 */
const reportService = {
	/**
	 * Fetches the financial report for a specific gym.
	 * GET /api/reports/finance/{gymId}
	 *
	 * @param {string} gymId - Gym UUID (path)
	 * @returns {Promise<Blob>} PDF file data as a Blob
	 */
	async getFinanceReport(gymId) {
		const { data } = await api.get(`/api/reports/finance/${gymId}`, {
			responseType: 'blob',
		});
		return data;
	},

	/**
	 * Fetches the occupancy report for a specific class.
	 * GET /api/reports/class-occupancy/{classId}
	 *
	 * @param {number} classId - Class ID (path)
	 * @returns {Promise<Blob>} PDF file data as a Blob
	 */
	async getClassOccupancyReport(classId) {
		const { data } = await api.get(`/api/reports/class-occupancy/${classId}`, {
			responseType: 'blob',
		});
		return data;
	},

	/**
	 * Fetches the physical assessment report for a specific client.
	 * GET /api/reports/assessment/{clientId}
	 *
	 * @param {string} clientId - Client UUID (path)
	 * @returns {Promise<Blob>} PDF file data as a Blob
	 */
	async getAssessmentReport(clientId) {
		const { data } = await api.get(`/api/reports/assessment/${clientId}`, {
			responseType: 'blob',
		});
		return data;
	},
};

export default reportService;