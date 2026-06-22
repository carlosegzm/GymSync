import api from "./api";

/**
 * Service for managing gym financial transactions (Income / Expenses).
 */
const financialTransactionService = {
	/**
	 * Creates a new financial transaction record.
	 * POST /api/finances
	 *
	 * @param {Object} payload
	 * @param {string} payload.description     - Transaction description
	 * @param {number} payload.amount          - Monetary value
	 * @param {string} payload.type            - e.g. "INCOME", "EXPENSE"
	 * @param {string} payload.category        - e.g. "SALARY", "MAINTENANCE"
	 * @param {string} payload.transactionDate - Date string (YYYY-MM-DD)
	 * @param {string} payload.gymId           - Gym UUID
	 * @returns {Promise<{ id, description, amount, type, category, transactionDate, gymId }>}
	 */
	async create({ description, amount, type, category, transactionDate, gymId }) {
		const { data } = await api.post('/api/finances', {
			description,
			amount,
			type,
			category,
			transactionDate,
			gymId,
		});
		return data;
	},

	/**
	 * Retrieves the current financial balance for a specific gym.
	 * GET /api/finances/gym/{gymId}/balance
	 *
	 * @param {string} gymId - Gym UUID (path)
	 * @returns {Promise<number>} Current balance value (BigDecimal)
	 */
	async getBalance(gymId) {
		const { data } = await api.get(`/api/finances/gym/${gymId}/balance`);
		return data;
	},
};

export default financialTransactionService;