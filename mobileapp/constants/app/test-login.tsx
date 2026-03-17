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

export default function TestLoginScreen() {
    const router = useRouter();
    const { login, user } = useApp();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [serverUrl, setServerUrl] = useState('http://192.168.1.100:3000');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            router.replace('/(tabs)');
        }
    }, [user]);

    const handleLogin = async () => {
        if (!username || !password || !serverUrl) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await login(username, password, serverUrl);
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Login Failed', error.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.gradient}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Smart-Pay</Text>
                        <Text style={styles.subtitle}>RFID Wallet Management System</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Sign In</Text>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Server URL</Text>
                            <TextInput
                                style={styles.input}
                                value={serverUrl}
                                onChangeText={setServerUrl}
                                placeholder="http://192.168.1.100:3000"
                                placeholderTextColor="#9ca3af"
                                autoCapitalize="none"
                                keyboardType="url"
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Username</Text>
                            <TextInput
                                style={styles.input}
                                value={username}
                                onChangeText={setUsername}
                                placeholder="Enter username"
                                placeholderTextColor="#9ca3af"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter password"
                                placeholderTextColor="#9ca3af"
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <View style={styles.buttonGradient}>
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Sign In</Text>
                                )}
                            </View>
                        </TouchableOpacity>

                        <View style={styles.infoBox}>
                            <Text style={styles.infoText}>
                                💡 Default credentials:{'\n'}
                                Admin: admin / admin123{'\n'}
                                Cashier: cashier / cashier123
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.footer}>Team: iot_shield_2026</Text>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    container: {
        flex: 1,
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
        fontSize: 48,
        fontWeight: '700',
        color: '#6366f1',
    },
    subtitle: {
        fontSize: 14,
        color: '#9ca3af',
        marginTop: 8,
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 24,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f9fafb',
        borderWidth: 1.5,
        borderColor: '#d1d5db',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: '#1f2937',
    },
    button: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 8,
        backgroundColor: '#6366f1',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    infoBox: {
        backgroundColor: '#f0f9ff',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    infoText: {
        fontSize: 12,
        color: '#1e40af',
        lineHeight: 18,
    },
    footer: {
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: 12,
        marginTop: 24,
    },
});
