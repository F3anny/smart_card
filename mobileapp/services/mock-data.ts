import { CardData, Product } from '@/types';

// Mock products
export const MOCK_PRODUCTS: Product[] = [
    { _id: '1', name: 'Coffee', price: 3.50, description: 'Hot coffee' },
    { _id: '2', name: 'Tea', price: 2.50, description: 'Hot tea' },
    { _id: '3', name: 'Sandwich', price: 5.99, description: 'Ham sandwich' },
    { _id: '4', name: 'Salad', price: 6.99, description: 'Fresh salad' },
    { _id: '5', name: 'Juice', price: 3.00, description: 'Orange juice' },
    { _id: '6', name: 'Water', price: 1.50, description: 'Bottled water' },
];

// Mock cards database
const MOCK_CARDS: { [uid: string]: CardData } = {
    'A1B2C3D4': { uid: 'A1B2C3D4', balance: 50.00, status: 'active' },
    '12345678': { uid: '12345678', balance: 25.50, status: 'active' },
    'ABCD1234': { uid: 'ABCD1234', balance: 100.00, status: 'active' },
};

export const mockDataService = {
    getProducts(): Product[] {
        return MOCK_PRODUCTS;
    },

    getCard(uid: string): CardData | null {
        return MOCK_CARDS[uid] || null;
    },

    createCard(uid: string): CardData {
        const card: CardData = {
            uid,
            balance: 0,
            status: 'active',
        };
        MOCK_CARDS[uid] = card;
        return card;
    },

    topup(uid: string, amount: number): { success: boolean; newBalance: number } {
        let card = MOCK_CARDS[uid];
        if (!card) {
            card = this.createCard(uid);
        }
        card.balance += amount;
        return { success: true, newBalance: card.balance };
    },

    pay(uid: string, amount: number): { success: boolean; newBalance?: number; reason?: string } {
        const card = MOCK_CARDS[uid];
        if (!card) {
            return { success: false, reason: 'Card not found' };
        }
        if (card.balance < amount) {
            return {
                success: false,
                reason: `Insufficient balance. Required: $${amount.toFixed(2)}, Available: $${card.balance.toFixed(2)}`
            };
        }
        card.balance -= amount;
        return { success: true, newBalance: card.balance };
    },

    // Simulate card scanning
    simulateCardScan(): string {
        const uids = Object.keys(MOCK_CARDS);
        if (uids.length === 0) {
            return 'A1B2C3D4'; // Default card
        }
        return uids[Math.floor(Math.random() * uids.length)];
    },
};
