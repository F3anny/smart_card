import { APP_CONFIG } from '@/config/app-config';
import { useApp } from '@/context/AppContext';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SignupScreen() {
    const router = useRouter();
    const { user } = useApp();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'admin' | 'cashier'>('cashier');
    const [loading, setLoading] = useState(false);

    // Only admins can create new accounts
    if (user?.role !== 'admin') {
        return (
            <View style={styles.gradient}>
                <View style={styles.container}>
                    <Text style={styles.errorText}>Access Denied: Admin Only</Text>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>← Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const validateForm = () => {
        if (!username || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return false;
        }

        if (username.length < 3) {
            Alert.alert('Error', 'Username must be at least 3 characters');
            return false;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return false;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSignup = async () => {
        if (!validateForm()) return;

        // Trim whitespace from inputs
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        setLoading(true);
        try {
            const response = await fetch(`${APP_CONFIG.SERVER_URL}${APP_CONFIG.ENDPOINTS.SIGNUP}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify({
                    username: trimmedUsername,
                    password: trimmedPassword,
                    role,
                    fullName: trimmedUsername,
                }),
            });

            const result = await response.json();

            if (result.success) {
                Alert.alert(
                    'Success',
                    `${role === 'admin' ? 'Admin' : 'Cashier'} account created successfully!`,
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // Clear form
                                setUsername('');
                                setPassword('');
                                setConfirmPassword('');
                                setRole('cashier');
                                router.back();
                            },
                        },
                    ]
                );
            } else {
                Alert.alert('Error', result.error || 'Signup failed');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Connection error');
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
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButtonHeader}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.backText}>← Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Create New Account</Text>
                        <Text style={styles.subtitle}>Add a new user to the system</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Account Details</Text>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Username</Text>
                            <TextInput
                                style={styles.input}
                                value={username}
                                onChangeText={setUsername}
                                placeholder="Enter username (min 3 characters)"
                                placeholderTextColor="#9ca3af"
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="username"
                                textContentType="username"
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Role</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={role}
                                    onValueChange={(value) => setRole(value as 'admin' | 'cashier')}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="👤 Admin - Full Access" value="admin" />
                                    <Picker.Item label="💳 Cashier - Payment Processing" value="cashier" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter password (min 6 characters)"
                                placeholderTextColor="#9ca3af"
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="password"
                                textContentType="password"
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Re-enter password"
                                placeholderTextColor="#9ca3af"
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="password"
                                textContentType="password"
                            />
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={styles.infoTitle}>ℹ️ Account Permissions</Text>
                            <Text style={styles.infoText}>
                                {role === 'admin'
                                    ? '• Can top-up cards\n• Can create new accounts\n• Full system access\n• View all transactions'
                                    : '• Can process payments\n• Can view card balances\n• Limited to cashier functions'}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleSignup}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#0A0A0A" />
                            ) : (
                                <Text style={styles.buttonText}>✓ Create Account</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    },
    scrollContent: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 30,
    },
    backButtonHeader: {
        marginBottom: 16,
    },
    backText: {
        color: '#00D9FF',
        fontSize: 16,
        fontWeight: '600',
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#888888',
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 20,
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
        padding: 14,
        fontSize: 16,
        color: '#FFFFFF',
    },
    pickerContainer: {
        backgroundColor: '#0A0A0A',
        borderWidth: 1,
        borderColor: '#2A2A2A',
        borderRadius: 12,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        color: '#FFFFFF',
    },
    infoBox: {
        backgroundColor: '#0A0A0A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#00D9FF',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 12,
        color: '#888888',
        lineHeight: 18,
    },
    button: {
        backgroundColor: '#00D9FF',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#0A0A0A',
        fontSize: 16,
        fontWeight: '700',
    },
    errorText: {
        color: '#FF4444',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 100,
        marginBottom: 20,
    },
    backButton: {
        alignSelf: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    backButtonText: {
        color: '#00D9FF',
        fontSize: 16,
        fontWeight: '600',
    },
});
