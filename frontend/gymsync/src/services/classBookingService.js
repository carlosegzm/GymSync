import api from "./api";

/**
 * Service for class booking management. (USER role)
 */
const classBookingService = {
	/**
	 * Creates a new class booking.
	 * POST /api/class-bookings
	 *
	 * @param {Object} payload
	 * @param {string} payload.clientId     - Client UUID
	 * @param {number} payload.groupClassId - Group Class ID
	 * @returns {Promise<{ id, bookingDateTime, clientId, groupClassId }>}
	 */
	async create({ clientId, groupClassId }) {
		const { data } = await api.post('/api/class-bookings', {
			clientId,
			groupClassId,
		});
		return data;
	},

	/**
	 * Updates the status of a class booking.
	 * PATCH /api/class-bookings/{bookingId}/status
	 *
	 * @param {number} bookingId - Booking ID (path)
	 * @param {string} status    - Status value (query)
	 * @returns {Promise<void>}
	 */
	async updateStatus(bookingId, status) {
		const { data } = await api.patch(`/api/class-bookings/${bookingId}/status`, null, {
			params: { status },
		});
		return data;
	},

	/**
	 * Cancels a class booking by the client.
	 * DELETE /api/class-bookings/{bookingId}/cancel/client/{clientId}
	 *
	 * @param {number} bookingId - Booking ID (path)
	 * @param {string} clientId  - Client UUID (path)
	 * @returns {Promise<void>}
	 */
	async cancelByClient(bookingId, clientId) {
		const { data } = await api.delete(`/api/class-bookings/${bookingId}/cancel/client/${clientId}`);
		return data;
	},
};

export default classBookingService;