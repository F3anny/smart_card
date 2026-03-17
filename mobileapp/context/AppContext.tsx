import { APP_CONFIG, checkBackendConnection } from '@/config/app-config';
import { authService } from '@/services/auth';
import socketService from '@/services/socket';
import { CardData, DashboardStats, Product, Transaction, User } from '@/types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AppContextType {
    user: User | null;
    isConnected: boolean;
    currentCard: CardData | null;
    products: Product[];
    transactions: Transaction[];
    backendReachable: boolean;
    dashboardStats: DashboardStats | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setCurrentCard: (card: CardData | null) => void;
    addTransaction: (transaction: Transaction) => void;
    checkBackend: () => Promise<boolean>;
    fetchDashboardStats: () => Promise<void>;
    refreshCardBalance: () => void;
    fetchTransactionHistory: (uid: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [currentCard, setCurrentCard] = useState<CardData | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [backendReachable, setBackendReachable] = useState(false);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        initializeAuth();
        checkBackend();
    }, []);

    useEffect(() => {
        if (user && backendReachable) {
            connectSocket();
        }
        return () => {
            socketService.disconnect();
        };
    }, [user, backendReachable]);

    const initializeAuth = async () => {
        const savedUser = await authService.getUser();
        if (savedUser) {
            setUser(savedUser);
        }
    };

    const checkBackend = async (): Promise<boolean> => {
        const reachable = await checkBackendConnection();
        setBackendReachable(reachable);
        return reachable;
    };

    const connectSocket = () => {
        const socket = socketService.connect(APP_CONFIG.SERVER_URL);

        socket.on('connect', () => {
            setIsConnected(true);
            socketService.emit('request-products');
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('products-response', (data: any) => {
            if (data.success) {
                setProducts(data.products);
            }
        });

        socket.on('card-scanned', (data: any) => {
            console.log('Card scanned:', data.uid);
            setCurrentCard({
                uid: data.uid,
                balance: data.deviceBalance || 0,
                status: 'active',
            });
            // Request balance from database
            socketService.emit('request-balance', { uid: data.uid });
            // Fetch transaction history
            fetchTransactionHistory(data.uid);
        });

        socket.on('balance-response', (data: any) => {
            console.log('Balance response:', data);
            if (data.success) {
                setCurrentCard(prev => {
                    // Only update if it's the same card or if we don't have a card yet
                    if (!prev || prev.uid === data.uid) {
                        return {
                            uid: data.uid,
                            balance: data.balance,
                            status: 'active',
                        };
                    }
                    return prev;
                });
            }
        });

        socket.on('topup-success', (data: any) => {
            if (currentCard?.uid === data.uid) {
                setCurrentCard(prev => prev ? { ...prev, balance: data.newBalance } : null);
            }
            addTransaction({
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                type: 'topup',
                amount: data.amount,
                uid: data.uid,
                balance: data.newBalance,
            });
        });

        socket.on('payment-success', (data: any) => {
            if (currentCard?.uid === data.uid) {
                setCurrentCard(prev => prev ? { ...prev, balance: data.newBalance } : null);
            }
            addTransaction({
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                type: 'payment',
                amount: data.amount,
                uid: data.uid,
                balance: data.newBalance,
            });
        });

        socket.on('history-response', (data: any) => {
            if (data.success && data.transactions) {
                const formattedTransactions = data.transactions.map((tx: any) => ({
                    id: tx._id || tx.id,
                    timestamp: tx.createdAt || tx.timestamp,
                    type: tx.type.toLowerCase(),
                    amount: tx.amount,
                    uid: tx.cardUid || data.uid,
                    balance: tx.newBalance,
                }));
                setTransactions(formattedTransactions);
                console.log('Received', formattedTransactions.length, 'transactions via socket');
            }
        });

        socket.on('stats-response', (data: any) => {
            if (data.success) {
                setDashboardStats(data.stats);
            }
        });
    };

    const login = async (username: string, password: string) => {
        // Clear any existing state first
        setUser(null);
        setCurrentCard(null);
        setProducts([]);
        setTransactions([]);
        setDashboardStats(null);

        // Check backend first
        const reachable = await checkBackend();
        if (!reachable) {
            throw new Error('Backend server is not reachable. Please check your connection.');
        }

        const loggedInUser = await authService.login(username, password);
        setUser(loggedInUser);
    };

    const logout = async () => {
        // Disconnect socket first
        socketService.disconnect();

        // Clear auth storage
        await authService.logout();

        // Reset all state completely
        setUser(null);
        setIsConnected(false);
        setCurrentCard(null);
        setProducts([]);
        setTransactions([]);
        setDashboardStats(null);

        // Force a small delay to ensure state is cleared
        await new Promise(resolve => setTimeout(resolve, 100));
    };

    const addTransaction = (transaction: Transaction) => {
        setTransactions(prev => [transaction, ...prev].slice(0, 30));
    };

    const refreshCardBalance = () => {
        if (currentCard?.uid) {
            console.log('Refreshing balance for card:', currentCard.uid);
            socketService.emit('request-balance', { uid: currentCard.uid });
        }
    };

    // Periodic balance refresh when card is present
    useEffect(() => {
        if (currentCard?.uid && isConnected) {
            // Refresh balance every 5 seconds
            const interval = setInterval(() => {
                refreshCardBalance();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [currentCard?.uid, isConnected]);

    const fetchDashboardStats = async () => {
        if (!user || user.role !== 'admin') return;

        try {
            // Try Socket.IO first
            socketService.emit('request-stats');

            // Also try REST API as fallback
            const response = await fetch(
                `${APP_CONFIG.SERVER_URL}${APP_CONFIG.ENDPOINTS.STATS}`,
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                }
            );

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const result = await response.json();
                if (result.success) {
                    setDashboardStats(result.stats);
                }
            } else {
                // Backend endpoint not implemented yet - use mock data
                console.log('Stats endpoint not available, using mock data');
                setDashboardStats({
                    totalCards: 0,
                    totalBalance: 0,
                    totalTransactions: 0,
                    topupsCount: 0,
                    paymentsCount: 0,
                });
            }
        } catch (error) {
            // Silently fail - stats endpoint may not be implemented yet
            console.log('Stats fetch failed (endpoint may not exist yet)');
            setDashboardStats({
                totalCards: 0,
                totalBalance: 0,
                totalTransactions: 0,
                topupsCount: 0,
                paymentsCount: 0,
            });
        }
    };

    const fetchTransactionHistory = async (uid: string) => {
        if (!user) return;

        try {
            console.log('Fetching transaction history for:', uid);

            // Try Socket.IO first
            socketService.emit('request-history', { uid, limit: 50 });

            // Also try REST API
            const response = await fetch(
                `${APP_CONFIG.SERVER_URL}/transactions/${uid}?limit=50`,
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                }
            );

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.transactions) {
                    const formattedTransactions = result.transactions.map((tx: any) => ({
                        id: tx._id || tx.id,
                        timestamp: tx.createdAt || tx.timestamp,
                        type: tx.type.toLowerCase(),
                        amount: tx.amount,
                        uid: tx.cardUid || uid,
                        balance: tx.newBalance,
                    }));
                    setTransactions(formattedTransactions);
                    console.log('Loaded', formattedTransactions.length, 'transactions');
                }
            }
        } catch (error) {
            console.log('Transaction history fetch failed:', error);
        }
    };

    return (
        <AppContext.Provider
            value={{
                user,
                isConnected,
                currentCard,
                products,
                transactions,
                backendReachable,
                dashboardStats,
                login,
                logout,
                setCurrentCard,
                addTransaction,
                checkBackend,
                fetchDashboardStats,
                refreshCardBalance,
                fetchTransactionHistory,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};
