import api from "./api";

/**
 * Service for physical assessment management.
 */
const physicalAssessmentService = {
	/**
	 * Creates a new physical assessment.
	 * POST /api/assessments
	 *
	 * @param {Object} payload
	 * @param {string} payload.assessmentDate    - Date string, e.g. "2026-06-22"
	 * @param {number} payload.weight            - Client's weight
	 * @param {number} payload.height            - Client's height
	 * @param {number} payload.bodyFatPercentage - Client's body fat percentage
	 * @param {string} payload.clientId          - Client UUID
	 * @param {string} payload.trainerId         - Trainer UUID
	 * @returns {Promise<{ id, assessmentDate, weight, height, bodyFatPercentage, clientId, trainerId }>}
	 */
	async create({ assessmentDate, weight, height, bodyFatPercentage, clientId, trainerId }) {
		const { data } = await api.post('/api/assessments', {
			assessmentDate,
			weight,
			height,
			bodyFatPercentage,
			clientId,
			trainerId,
		});
		return data;
	},

	/**
	 * Lists all physical assessments for a specific client.
	 * GET /api/assessments/client/{clientId}
	 *
	 * @param {string} clientId - Client UUID (path)
	 * @returns {Promise<Array<{ id, assessmentDate, weight, height, bodyFatPercentage, clientId, trainerId }>>}
	 */
	async listByClient(clientId) {
		const { data } = await api.get(`/api/assessments/client/${clientId}`);
		return data;
	},
};

export default physicalAssessmentService;