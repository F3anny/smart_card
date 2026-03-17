import { User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@smartpay_auth';

// Mock users database
const MOCK_USERS = [
    { id: '1', username: 'admin', password: 'admin123', role: 'admin' as const },
    { id: '2', username: 'cashier', password: 'cashier123', role: 'cashier' as const },
];

export const mockAuthService = {
    async login(username: string, password: string): Promise<User> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = MOCK_USERS.find(
            u => u.username === username && u.password === password
        );

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const authUser: User = {
            id: user.id,
            username: user.username,
            role: user.role,
            token: `mock_token_${user.id}_${Date.now()}`,
        };

        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
        return authUser;
    },

    async logout(): Promise<void> {
        await AsyncStorage.removeItem(AUTH_KEY);
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

    async signup(username: string, password: string, role: 'admin' | 'cashier', fullName: string): Promise<User> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if username exists
        if (MOCK_USERS.find(u => u.username === username)) {
            throw new Error('Username already exists');
        }

        const newUser = {
            id: `${MOCK_USERS.length + 1}`,
            username,
            password,
            role,
        };

        MOCK_USERS.push(newUser);

        return {
            id: newUser.id,
            username: newUser.username,
            role: newUser.role,
            token: `mock_token_${newUser.id}_${Date.now()}`,
        };
    },
};
