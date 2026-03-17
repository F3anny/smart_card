import { APP_CONFIG } from '@/config/app-config';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, isConnected, logout } = useApp();

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await logout();
                    router.replace('/login');
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Profile</Text>
                </View>

                {/* User Info */}
                <View style={styles.card}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {user?.username.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <Text style={styles.username}>{user?.username}</Text>
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>
                                {user?.role === 'admin' ? 'Administrator' : 'Cashier'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Connection Info */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Connection</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Server</Text>
                        <Text style={styles.infoValue} numberOfLines={1}>{APP_CONFIG.SERVER_URL}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Status</Text>
                        <Text style={[styles.infoValue, isConnected ? styles.statusOnline : styles.statusOffline]}>
                            {isConnected ? '● Connected' : '○ Disconnected'}
                        </Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Quick Actions</Text>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('/transactions')}
                    >
                        <Text style={styles.actionText}>Transaction History</Text>
                        <Text style={styles.actionArrow}>→</Text>
                    </TouchableOpacity>

                    {user?.role === 'admin' && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.actionButtonSpacing]}
                            onPress={() => router.push('/signup')}
                        >
                            <Text style={styles.actionText}>Create Account</Text>
                            <Text style={styles.actionArrow}>→</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Permissions */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Permissions</Text>
                    {user?.role === 'admin' ? (
                        <View>
                            <View style={styles.permissionItem}>
                                <Text style={styles.permissionText}>✓ Top-up cards</Text>
                            </View>
                            <View style={styles.permissionItem}>
                                <Text style={styles.permissionText}>✓ Create accounts</Text>
                            </View>
                            <View style={styles.permissionItem}>
                                <Text style={styles.permissionText}>✓ View transactions</Text>
                            </View>
                            <View style={styles.permissionItem}>
                                <Text style={styles.permissionText}>✓ Full access</Text>
                            </View>
                        </View>
                    ) : (
                        <View>
                            <View style={styles.permissionItem}>
                                <Text style={styles.permissionText}>✓ Process payments</Text>
                            </View>
                            <View style={styles.permissionItem}>
                                <Text style={styles.permissionText}>✓ View balances</Text>
                            </View>
                            <View style={styles.permissionItem}>
                                <Text style={styles.permissionText}>✓ Manage cart</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <Text style={styles.footer}>Team: iot_shield_2026</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 24,
    },
    backButton: {
        marginBottom: 12,
    },
    backText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#000000',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    avatarContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    username: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 12,
    },
    roleBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    roleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666666',
        fontWeight: '600',
    },
    infoValue: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
        marginLeft: 12,
    },
    statusOnline: {
        color: '#4CAF50',
    },
    statusOffline: {
        color: '#F44336',
    },
    actionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#F5F5F5',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    actionButtonSpacing: {
        marginTop: 12,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    actionArrow: {
        fontSize: 18,
        color: '#000000',
        fontWeight: '700',
    },
    permissionItem: {
        paddingVertical: 8,
    },
    permissionText: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '500',
    },
    logoutButton: {
        backgroundColor: '#000000',
        paddingVertical: 14,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 24,
    },
    logoutText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    footer: {
        textAlign: 'center',
        color: '#999999',
        fontSize: 12,
        marginTop: 24,
    },
});
