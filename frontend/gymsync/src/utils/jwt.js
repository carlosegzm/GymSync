/**
 * Decodes the payload of a JWT without verifying its signature.
 * Used only for reading non-sensitive display data (e.g. role, subject).
 * Actual authorization is always enforced server-side.
 *
 * @param {string} token
 * @returns {Object|null} Decoded payload, or null if invalid
 */
export function decodeJwt(token) {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
}

/**
 * Extracts the role claim from the stored JWT.
 * Falls back to null if token is missing or malformed.
 *
 * @returns {string|null}
 */
export function getRoleFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = decodeJwt(token);
    return payload?.role ?? null;
}