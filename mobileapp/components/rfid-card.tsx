import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface RFIDCardProps {
    uid?: string;
    balance?: number;
    status?: 'active' | 'inactive';
}

export default function RFIDCard({ uid, balance, status = 'active' }: RFIDCardProps) {
    return (
        <LinearGradient
            colors={['#1A1A1A', '#2A2A2A', '#1A1A1A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
        >
            {/* Card Background Pattern */}
            <View style={styles.pattern}>
                <View style={[styles.circle, styles.circleLeft]} />
                <View style={[styles.circle, styles.circleRight]} />
            </View>

            {/* Card Content */}
            <View style={styles.content}>
                {/* Top Section */}
                <View style={styles.topSection}>
                    <View style={styles.chipContainer}>
                        <View style={styles.chip}>
                            <View style={styles.chipLine} />
                            <View style={[styles.chipLine, styles.chipLineVertical]} />
                        </View>
                    </View>
                    <View style={styles.logoContainer}>
                        <View style={styles.mastercardCircle1} />
                        <View style={styles.mastercardCircle2} />
                    </View>
                </View>

                {/* Middle Section - Balance */}
                <View style={styles.middleSection}>
                    <Text style={styles.balanceLabel}>Balance</Text>
                    <Text style={styles.balanceAmount}>
                        ${balance !== undefined ? balance.toFixed(2) : '0.00'}
                    </Text>
                </View>

                {/* Bottom Section - UID */}
                <View style={styles.bottomSection}>
                    <View style={styles.uidContainer}>
                        <Text style={styles.uidLabel}>Card UID</Text>
                        <Text style={styles.uidValue} numberOfLines={1}>
                            {uid || '•••• •••• •••• ••••'}
                        </Text>
                    </View>
                    <View style={[styles.statusDot, status === 'active' && styles.statusActive]} />
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 380,
        height: 240, // Increased from 340x214 to 380x240
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#00D9FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    pattern: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    circle: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        opacity: 0.1,
    },
    circleLeft: {
        backgroundColor: '#00D9FF',
        top: -40,
        left: -40,
    },
    circleRight: {
        backgroundColor: '#00D9FF',
        bottom: -40,
        right: -40,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    chipContainer: {
        width: 45,
        height: 35,
        backgroundColor: '#FFD700',
        borderRadius: 6,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chip: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    chipLine: {
        position: 'absolute',
        width: '100%',
        height: 2,
        backgroundColor: '#DAA520',
        top: '30%',
    },
    chipLineVertical: {
        width: 2,
        height: '100%',
        left: '30%',
        top: 0,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mastercardCircle1: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#EB001B',
        opacity: 0.9,
    },
    mastercardCircle2: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F79E1B',
        marginLeft: -14,
        opacity: 0.9,
    },
    middleSection: {
        marginTop: 8,
    },
    balanceLabel: {
        fontSize: 11,
        color: '#888888',
        fontWeight: '600',
        marginBottom: 4,
    },
    balanceAmount: {
        fontSize: 32,
        fontWeight: '700',
        color: '#00D9FF',
        letterSpacing: 1,
    },
    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    uidContainer: {
        flex: 1,
    },
    uidLabel: {
        fontSize: 9,
        color: '#666666',
        fontWeight: '600',
        marginBottom: 4,
    },
    uidValue: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '600',
        letterSpacing: 1,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FF4444',
        marginLeft: 12,
    },
    statusActive: {
        backgroundColor: '#00FF88',
    },
});
