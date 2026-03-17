import { useApp } from '@/context/AppContext';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const { login, user, checkBackend } = useApp();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
    const [isCheckingUser, setIsCheckingUser] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            setIsCheckingUser(true);
            if (user) {
                router.replace('/(tabs)');
            }
            setIsCheckingUser(false);
        };

        checkUser();
        checkServerStatus();
    }, [user]);

    const checkServerStatus = async () => {
        setBackendStatus('checking');
        const isOnline = await checkBackend();
        setBackendStatus(isOnline ? 'online' : 'offline');
    };

    const handleLogin = async () => {
        // Trim whitespace from inputs
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        if (!trimmedUsername || !trimmedPassword) {
            Alert.alert('Missing Information', 'Please enter username and password');
            return;
        }

        if (backendStatus === 'offline') {
            Alert.alert('Server Offline', 'Cannot connect to server');
            return;
        }

        setLoading(true);
        try {
            console.log('Login attempt:', trimmedUsername);
            await login(trimmedUsername, trimmedPassword);
            console.log('Login successful, navigating to tabs');
            // Don't use router.replace here - let the useEffect handle navigation
        } catch (error: any) {
            console.error('Login failed:', error);
            Alert.alert('Login Failed', error.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    // Show loading while checking user
    if (isCheckingUser) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#00D9FF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>SmartPay</Text>
                    <Text style={styles.subtitle}>RFID Wallet System</Text>

                    <View style={[
                        styles.serverStatus,
                        backendStatus === 'online' && styles.serverOnline,
                        backendStatus === 'offline' && styles.serverOffline,
                    ]}>
                        <View style={[
                            styles.serverDot,
                            backendStatus === 'online' && styles.serverDotOnline,
                            backendStatus === 'offline' && styles.serverDotOffline,
                        ]} />
                        <Text style={styles.serverText}>
                            {backendStatus === 'checking' && 'Checking server...'}
                            {backendStatus === 'online' && 'Server Online'}
                            {backendStatus === 'offline' && 'Server Offline'}
                        </Text>
                        {backendStatus === 'offline' && (
                            <TouchableOpacity onPress={checkServerStatus} style={styles.retryButton}>
                                <Text style={styles.retryText}>↻</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Login Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Sign In</Text>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Enter username"
                            placeholderTextColor="#666666"
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoComplete="username"
                            textContentType="username"
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter password"
                            placeholderTextColor="#666666"
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoComplete="password"
                            textContentType="password"
                            editable={!loading}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, (loading || backendStatus === 'offline') && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading || backendStatus === 'offline'}
                    >
                        {loading ? (
                            <ActivityIndicator color="#0A0A0A" />
                        ) : (
                            <Text style={styles.buttonText}>Sign In →</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <Text style={styles.footer}>Team: iot_shield_2026</Text>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 42,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        color: '#888888',
        marginTop: 8,
    },
    serverStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    serverOnline: {
        borderColor: '#00D9FF',
    },
    serverOffline: {
        borderColor: '#FF4444',
    },
    serverDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#666666',
        marginRight: 8,
    },
    serverDotOnline: {
        backgroundColor: '#00D9FF',
    },
    serverDotOffline: {
        backgroundColor: '#FF4444',
    },
    serverText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
    retryButton: {
        marginLeft: 8,
        padding: 4,
    },
    retryText: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    card: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 28,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    cardTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 28,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#0A0A0A',
        borderWidth: 1,
        borderColor: '#2A2A2A',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#FFFFFF',
    },
    button: {
        backgroundColor: '#00D9FF',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#0A0A0A',
        fontSize: 18,
        fontWeight: '700',
    },
    footer: {
        textAlign: 'center',
        color: '#666666',
        fontSize: 13,
        marginTop: 32,
        fontWeight: '600',
    },
});
