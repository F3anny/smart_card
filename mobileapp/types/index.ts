export interface User {
    id: string;
    username: string;
    role: 'admin' | 'cashier';
    token: string;
}

export interface CardData {
    uid: string;
    balance: number;
    status: 'active' | 'inactive';
}

export interface Product {
    _id: string;
    name: string;
    price: number;
    description?: string;
}

export interface Transaction {
    id: string;
    timestamp: string;
    type: 'topup' | 'payment';
    amount: number;
    uid: string;
    balance: number;
}

export interface DashboardStats {
    totalCards: number;
    totalBalance: number;
    totalTransactions: number;
    topupsCount: number;
    paymentsCount: number;
}

export interface SocketEvents {
    'card-scanned': (data: { uid: string; deviceBalance: number }) => void;
    'topup-success': (data: { uid: string; amount: number; newBalance: number }) => void;
    'payment-success': (data: { uid: string; amount: number; newBalance: number }) => void;
    'payment-declined': (data: { uid: string; reason: string; required: number; available: number }) => void;
    'products-response': (data: { success: boolean; products: Product[] }) => void;
    'balance-response': (data: { success: boolean; uid: string; balance: number }) => void;
    'stats-response': (data: { success: boolean; stats: DashboardStats }) => void;
}
