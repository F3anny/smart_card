import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface CardVisualProps {
    uid: string;
    balance: number;
    isActive: boolean;
}

export default function CardVisual({ uid, balance, isActive }: CardVisualProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        if (isActive) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1.05,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0.6,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isActive]);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim,
                },
            ]}
        >
            <LinearGradient
                colors={['#5e72e4', '#10b981']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <View style={styles.chip} />
                <Text style={styles.cardNumber}>
                    {uid || '**** **** **** ****'}
                </Text>
                <View style={styles.details}>
                    <View>
                        <Text style={styles.label}>CARD UID</Text>
                        <Text style={styles.value}>{uid || '--'}</Text>
                    </View>
                    <View style={styles.balanceGroup}>
                        <Text style={styles.label}>BALANCE</Text>
                        <Text style={styles.value}>${balance.toFixed(2)}</Text>
                    </View>
                </View>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    card: {
        width: 320,
        height: 200,
        borderRadius: 16,
        padding: 24,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.5,
        shadowRadius: 35,
        elevation: 15,
    },
    chip: {
        width: 45,
        height: 35,
        backgroundColor: '#fde047',
        borderRadius: 8,
    },
    cardNumber: {
        fontFamily: 'Courier',
        fontSize: 20,
        letterSpacing: 2,
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    balanceGroup: {
        alignItems: 'flex-end',
    },
    label: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 4,
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
});
