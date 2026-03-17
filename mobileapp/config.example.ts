/**
 * Smart-Pay Configuration Example
 * 
 * Copy this file to config.ts and update with your backend server details
 */

export const CONFIG = {
    // Backend server URL - Update with your server IP address
    DEFAULT_SERVER_URL: 'http://192.168.1.100:3000',

    // Socket.IO configuration
    SOCKET_CONFIG: {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
    },

    // API endpoints
    ENDPOINTS: {
        LOGIN: '/auth/login',
        TOPUP: '/topup',
        PAYMENT: '/pay',
    },

    // Default credentials (for development only)
    DEFAULT_CREDENTIALS: {
        admin: {
            username: 'admin',
            password: 'admin123',
        },
        cashier: {
            username: 'cashier',
            password: 'cashier123',
        },
    },

    // Transaction log settings
    MAX_TRANSACTIONS: 30,

    // UI settings
    ANIMATION_DURATION: 300,
    CARD_ANIMATION_SCALE: 1.05,
};

export default CONFIG;
