// Smart-Pay App Configuration
// Update the SERVER_URL with your backend server IP address

export const APP_CONFIG = {
    // Backend server URL - VPS server (no trailing slash)
    SERVER_URL: 'http://157.173.101.159:9201',

    // Connection timeout in milliseconds
    CONNECTION_TIMEOUT: 5000,

    // Socket.IO configuration
    SOCKET_CONFIG: {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 5000,
    },

    // API endpoints
    ENDPOINTS: {
        LOGIN: '/api/login',
        SIGNUP: '/api/register',
        TOPUP: '/topup',
        PAYMENT: '/pay',
        STATS: '/api/dashboard/stats',
    },
};

// Helper function to check if backend is reachable
export async function checkBackendConnection(url: string = APP_CONFIG.SERVER_URL): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.CONNECTION_TIMEOUT);

        // Try to reach the root endpoint or any endpoint that exists
        const response = await fetch(`${url}/`, {
            method: 'GET',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        // Accept any response (even 404) as long as server responds
        return true;
    } catch (error) {
        console.log('Backend connection check failed:', error);
        return false;
    }
}
