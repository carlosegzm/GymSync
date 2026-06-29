import api from "./api";

/**
 * Service for managing available trainer time slots.
 */
const availableTimeSlotService = {
	/**
	 * Generates a bulk of time slots for a specific trainer based on query criteria.
	 * POST /api/timeslots/generate
	 *
	 * @param {Object} params
	 * @param {string} params.trainerId       - Trainer UUID
	 * @param {string} params.startDate       - Start date (YYYY-MM-DD)
	 * @param {string} params.endDate         - End date (YYYY-MM-DD)
	 * @param {string} params.startTime       - Slot start time (e.g. "08:00")
	 * @param {string} params.endTime         - Slot end time (e.g. "18:00")
	 * @param {number} params.durationMinutes - Duration of each slot in minutes
	 * @returns {Promise<Array<{ id, date, startTime, endTime, available, trainerId }>>}
	 */
	async generate({ trainerId, startDate, endDate, startTime, endTime, durationMinutes }) {
		const { data } = await api.post('/api/timeslots/generate', null, {
			params: {
				trainerId,
				startDate,
				endDate,
				startTime,
				endTime,
				durationMinutes,
			},
		});
		return data;
	},

	/**
	 * Books a specific time slot for a client.
	 * PATCH /api/timeslots/{slotId}/book/client/{clientId}
	 *
	 * @param {number} slotId   - Time slot ID (path)
	 * @param {string} clientId - Client UUID (path)
	 * @returns {Promise<{ id, date, startTime, endTime, available, trainerId }>}
	 */
	async bookSlot(slotId, clientId) {
		const { data } = await api.patch(`/api/timeslots/${slotId}/book/client/${clientId}`);
		return data;
	},

	/**
	 * Lists all time slots associated with a specific trainer.
	 * GET /api/timeslots/trainer/{trainerId}
	 *
	 * @param {string} trainerId - Trainer UUID (path)
	 * @returns {Promise<Array<{ id, date, startTime, endTime, available, trainerId }>>}
	 */
	async listByTrainer(trainerId) {
		const { data } = await api.get(`/api/timeslots/trainer/${trainerId}`);
		return data;
	},

	/**
	 * Deletes a specific time slot.
	 * DELETE /api/timeslots/{slotId}
	 *
	 * @param {number} slotId - Time slot ID (path)
	 * @returns {Promise<void>}
	 */
	async deleteSlot(slotId) {
		const { data } = await api.delete(`/api/timeslots/${slotId}`);
		return data;
	},

	/**
	 * Fetches all booked slots for the currently logged-in trainer.
	 * GET /api/timeslots/trainer/me/booked
	 *
	 * @returns {Promise<Array<{ id, date, startTime, endTime, available, trainerId }>>}
	 */
	async listMyBookedSlots() {
		const { data } = await api.get('/api/timeslots/trainer/me/booked');
		return data;
	},
};

export default availableTimeSlotService;