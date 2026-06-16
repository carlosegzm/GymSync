import api from './api';

/**
 * Service for group classes and bookings.
 */
const classService = {
	/**
	 * Fetches all available group classes.
	 * GET /api/group-classes
	 *
	 * @returns {Promise<Array<{ id, name, classType, startDateTime, maxCapacity, trainerName }>>}
	 */
	async listClasses() {
		const { data } = await api.get('/api/group-classes');
		return data;
	},

	/**
	 * Books a group class for a client.
	 * POST /api/class-bookings
	 *
	 * @param {string} clientId  - UUID of the logged-in client
	 * @param {number} groupClassId
	 * @returns {Promise<{ id, bookingDateTime, clientName, groupClassName, status }>}
	 */
	async bookClass(clientId, groupClassId) {
		const { data } = await api.post('/api/class-bookings', {
			clientId,
			groupClassId,
		});
		return data;
	},
};

export default classService;
