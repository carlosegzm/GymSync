import api from "./api";

/**
 * Service for group class management. (ADMIN role) 
 *
 * classType enum values (from backend): SPINNING, (others TBD)
 */
const groupClassService = {

	/**
	 * Creates a new group class.
	 * POST /api/group-classes
	 *
	 * @param {Object} payload
	 * @param {string} payload.name
	 * @param {string} payload.classType       - e.g. "SPINNING"
	 * @param {string} payload.startDateTime   - ISO 8601, e.g. "2026-06-22T19:00:00"
	 * @param {number} payload.maxCapacity     - minimum 1
	 * @param {string} payload.trainerId       - Trainer UUID
	 * @returns {Promise<{ id, name, classType, startDateTime, maxCapacity, trainerId }>}
	 */
	async create({ name, classType, startDateTime, maxCapacity, trainerId }) {
		const { data } = await api.post('/api/group-classes', {
			name,
			classType,
			startDateTime,
			maxCapacity,
			trainerId,
		});
		return data;
	},

	/**
	 * Lists all group classes for a specific gym (Calendar/Schedule).
	 * GET /api/group-classes/gym/{gymId}
	 *
	 * @param {string} gymId - Gym UUID
	 * @returns {Promise<Array<{ id, name, classType, startDateTime, maxCapacity, trainerId }>>}
	 */
	async listByGym(gymId) {
		console.log(gymId)
		const { data } = await api.get(`/api/group-classes/gym/${gymId}`);
		return data;
	},

	/**
	 * Lists group classes for the currently logged-in trainer.
	 * GET /api/group-classes/trainer/me
	 *
	 * @returns {Promise<Array<{ id, name, classType, startDateTime, maxCapacity, trainerId }>>}
	 */
	async listMyClassesAsTrainer() {
		const { data } = await api.get('/api/group-classes/trainer/me');
		return data;
	},
};

export default groupClassService;
