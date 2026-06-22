import api from "./api";

/**
 * Service for group class management. (ADMIN role) 
 *
 * classType enum values (from backend): SPINNING, (others TBD)
 */
const groupClassService = {
	/**
	 * Lists all available group classes.
	 * GET /api/group-classes
	 *
	 * @returns {Promise<Array<{ id, name, classType, startDateTime, maxCapacity, trainerId }>>}
	 */
	async listAll() {
		const { data } = await api.get('/api/group-classes');
		return data;
	},

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
};

export default groupClassService;
