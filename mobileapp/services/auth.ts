import { APP_CONFIG } from '@/config/app-config';
import { User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@smartpay_auth';

export const authService = {
    async login(username: string, password: string): Promise<User> {
        try {
            console.log('=== LOGIN START ===');
            console.log('Attempting login for:', username);

            // Clear any cached data first
            await AsyncStorage.removeItem(AUTH_KEY);
            console.log('Cleared cached auth data');

            const response = await fetch(`${APP_CONFIG.SERVER_URL}${APP_CONFIG.ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({ username, password }),
            });

            console.log('Login response status:', response.status);

            const data = await response.json();
            console.log('Login response data:', JSON.stringify(data));

            if (!data.success) {
                throw new Error(data.error || 'Login failed');
            }

            const user: User = {
                id: data.user.id,
                username: data.user.username,
                role: data.user.role,
                token: data.token,
            };

            await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
            console.log('User saved to AsyncStorage:', user.username, 'Role:', user.role);
            console.log('=== LOGIN SUCCESS ===');

            return user;
        } catch (error: any) {
            console.error('=== LOGIN ERROR ===');
            console.error('Login error:', error);
            throw new Error(error.message || 'Network error - Check if backend is running');
        }
    },

    async logout(): Promise<void> {
        console.log('=== LOGOUT START ===');
        console.log('Clearing AsyncStorage auth key');
        await AsyncStorage.removeItem(AUTH_KEY);

        // Verify it's cleared
        const check = await AsyncStorage.getItem(AUTH_KEY);
        console.log('AsyncStorage after logout:', check === null ? 'CLEARED' : 'STILL HAS DATA');
        console.log('=== LOGOUT COMPLETE ===');
    },

    async getUser(): Promise<User | null> {
        try {
            const userData = await AsyncStorage.getItem(AUTH_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch {
            return null;
        }
    },

    async isAuthenticated(): Promise<boolean> {
        const user = await this.getUser();
        return !!user;
    },

    async signup(username: string, password: string, role: 'admin' | 'cashier', fullName: string, adminToken: string): Promise<User> {
        try {
            const response = await fetch(`${APP_CONFIG.SERVER_URL}${APP_CONFIG.ENDPOINTS.SIGNUP}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`,
                },
                body: JSON.stringify({ username, password, role, fullName }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Signup failed');
            }

            return {
                id: data.user.id,
                username: data.user.username,
                role: data.user.role,
                token: `mock_token_${data.user.id}`,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Network error');
        }
    },
};
