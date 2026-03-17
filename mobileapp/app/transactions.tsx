import { useApp } from '@/context/AppContext';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function TransactionsScreen() {
    const router = useRouter();
    const { transactions, isConnected } = useApp();

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <View style={styles.gradient}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Transaction Log</Text>
                    <View style={styles.statusBadge}>
                        <View style={[styles.statusDot, isConnected && styles.statusDotOnline]} />
                        <Text style={styles.statusText}>
                            {isConnected ? 'Live' : 'Offline'}
                        </Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📋 Recent Transactions</Text>
                    <ScrollView style={styles.logContainer}>
                        {transactions.length === 0 ? (
                            <Text style={styles.emptyText}>No transactions yet</Text>
                        ) : (
                            transactions.map((transaction) => (
                                <View key={transaction.id} style={styles.logItem}>
                                    <View style={styles.logHeader}>
                                        <Text style={styles.logTime}>[{formatTime(transaction.timestamp)}]</Text>
                                        <Text
                                            style={[
                                                styles.logAmount,
                                                transaction.type === 'topup' ? styles.topup : styles.payment,
                                            ]}
                                        >
                                            {transaction.type === 'topup' ? '+' : '-'}$
                                            {transaction.amount.toFixed(2)}
                                        </Text>
                                    </View>
                                    <Text style={styles.logDetails}>
                                        {transaction.type === 'topup' ? '✓ Top-up' : '💰 Payment'} | UID:{' '}
                                        {transaction.uid} | Balance: ${transaction.balance.toFixed(2)}
                                    </Text>
                                </View>
                            ))
                        )}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },
    header: {
        marginBottom: 30,
    },
    backButton: {
        marginBottom: 16,
    },
    backText: {
        color: '#00D9FF',
        fontSize: 16,
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FF4444',
        marginRight: 6,
    },
    statusDotOnline: {
        backgroundColor: '#00D9FF',
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
    },
    card: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    logContainer: {
        flex: 1,
    },
    emptyText: {
        textAlign: 'center',
        color: '#666666',
        fontStyle: 'italic',
        paddingVertical: 40,
    },
    logItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    logTime: {
        fontSize: 11,
        color: '#888888',
        fontFamily: 'Courier',
    },
    logAmount: {
        fontSize: 16,
        fontWeight: '700',
    },
    topup: {
        color: '#00D9FF',
    },
    payment: {
        color: '#FF4444',
    },
    logDetails: {
        fontSize: 12,
        color: '#888888',
        fontFamily: 'Courier',
    },
});
