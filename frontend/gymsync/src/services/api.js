import axios from 'axios';

/**
 * Pre-configured Axios instance for all API calls.
 * The base URL points to the Spring Boot backend.
 * The JWT token is injected automatically on every request via interceptor.
 */
const api = axios.create({
	baseURL: 'http://localhost:8080',
	headers: { 'Content-Type': 'application/json' },
});

// Inject token on every request if it exists in localStorage
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Redirect to login on 401 (expired/invalid token)
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.clear();
			window.location.hash = '#/login';
		}
		return Promise.reject(error);
	}
);

export default api;
