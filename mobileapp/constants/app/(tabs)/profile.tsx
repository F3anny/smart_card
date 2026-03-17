import { APP_CONFIG } from '@/config/app-config';
import { useApp } from '@/context/AppContext';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
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
        Alert.alert('Logout', 'Are you sure you want to logout?', [
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
                    <Text style={styles.title}>Profile</Text>
                    <Text style={styles.subtitle}>Account & Settings</Text>
                </View>

                {/* User Info Card */}
                <View style={styles.card}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {user?.username.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <Text style={styles.username}>{user?.username}</Text>
                        <View style={styles.roleBadge}>
                            {user?.role === 'admin' ? (
                                <MaterialCommunityIcons name="crown" size={16} color="#00D9FF" style={{ marginRight: 6 }} />
                            ) : (
                                <Ionicons name="briefcase" size={16} color="#00D9FF" style={{ marginRight: 6 }} />
                            )}
                            <Text style={styles.roleText}>
                                {user?.role === 'admin' ? 'Administrator' : 'Cashier'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Connection Info */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="wifi" size={20} color="#00D9FF" />
                        <Text style={styles.cardTitle}>Connection</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Server</Text>
                        <Text style={styles.infoValue} numberOfLines={1}>
                            {APP_CONFIG.SERVER_URL.replace('http://', '')}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Status</Text>
                        <View style={styles.statusContainer}>
                            <View style={[styles.statusDot, isConnected && styles.statusDotOnline]} />
                            <Text style={[styles.infoValue, isConnected ? styles.statusOnline : styles.statusOffline]}>
                                {isConnected ? 'Connected' : 'Disconnected'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="flash" size={20} color="#00D9FF" />
                        <Text style={styles.cardTitle}>Quick Actions</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('/transactions')}
                    >
                        <View style={styles.actionLeft}>
                            <MaterialCommunityIcons name="format-list-bulleted" size={20} color="#00D9FF" />
                            <Text style={styles.actionText}>Transaction History</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#00D9FF" />
                    </TouchableOpacity>

                    {user?.role === 'admin' && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.actionButtonSpacing]}
                            onPress={() => router.push('/signup')}
                        >
                            <View style={styles.actionLeft}>
                                <Ionicons name="person-add" size={20} color="#00D9FF" />
                                <Text style={styles.actionText}>Create New Account</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#00D9FF" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Permissions */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialIcons name="security" size={20} color="#00D9FF" />
                        <Text style={styles.cardTitle}>Permissions</Text>
                    </View>
                    {user?.role === 'admin' ? (
                        <View>
                            <View style={styles.permissionItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#00D9FF" />
                                <Text style={styles.permissionText}>Top-up cards</Text>
                            </View>
                            <View style={styles.permissionItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#00D9FF" />
                                <Text style={styles.permissionText}>Create user accounts</Text>
                            </View>
                            <View style={styles.permissionItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#00D9FF" />
                                <Text style={styles.permissionText}>View all transactions</Text>
                            </View>
                            <View style={styles.permissionItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#00D9FF" />
                                <Text style={styles.permissionText}>Full system access</Text>
                            </View>
                        </View>
                    ) : (
                        <View>
                            <View style={styles.permissionItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#00D9FF" />
                                <Text style={styles.permissionText}>Process payments</Text>
                            </View>
                            <View style={styles.permissionItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#00D9FF" />
                                <Text style={styles.permissionText}>View card balances</Text>
                            </View>
                            <View style={styles.permissionItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#00D9FF" />
                                <Text style={styles.permissionText}>Manage shopping cart</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
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
        backgroundColor: '#0A0A0A',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        backgroundColor: '#1A1A1A',
        padding: 20,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#888888',
    },
    card: {
        backgroundColor: '#1A1A1A',
        margin: 20,
        marginBottom: 0,
        marginTop: 20,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    avatarContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#00D9FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: '700',
        color: '#0A0A0A',
    },
    username: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    roleBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        borderWidth: 1,
        borderColor: '#00D9FF',
        flexDirection: 'row',
        alignItems: 'center',
    },
    roleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#00D9FF',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    infoLabel: {
        fontSize: 14,
        color: '#888888',
        fontWeight: '600',
    },
    infoValue: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
        marginLeft: 12,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF4444',
        marginRight: 8,
    },
    statusDotOnline: {
        backgroundColor: '#00D9FF',
    },
    statusOnline: {
        color: '#00D9FF',
    },
    statusOffline: {
        color: '#FF4444',
    },
    actionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#0A0A0A',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    actionButtonSpacing: {
        marginTop: 12,
    },
    actionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    permissionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        gap: 12,
    },
    permissionText: {
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    logoutButton: {
        backgroundColor: '#FF4444',
        marginHorizontal: 20,
        marginTop: 20,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    logoutText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    footer: {
        textAlign: 'center',
        color: '#666666',
        fontSize: 12,
        marginTop: 24,
    },
});
