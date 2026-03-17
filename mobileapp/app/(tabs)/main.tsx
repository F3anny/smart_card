import RFIDCard from '@/components/rfid-card';
import { APP_CONFIG } from '@/config/app-config';
import { useApp } from '@/context/AppContext';
import socketService from '@/services/socket';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DashboardScreen() {
  const { user, currentCard, isConnected, dashboardStats, fetchDashboardStats, refreshCardBalance, transactions, fetchTransactionHistory } = useApp();
  const [topupAmount, setTopupAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === 'admin';

  // Fetch stats when admin logs in
  useEffect(() => {
    if (isAdmin && isConnected) {
      fetchDashboardStats();
    }
  }, [isAdmin, isConnected]);

  // Fetch transaction history when card is scanned
  useEffect(() => {
    if (currentCard?.uid) {
      fetchTransactionHistory(currentCard.uid);
    }
  }, [currentCard?.uid]);

  const simulateCardScan = () => {
    const mockUID = `CARD-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    socketService.emit('card-scanned', { uid: mockUID });
  };

  const handleTopup = async () => {
    const amount = parseFloat(topupAmount);
    if (!currentCard?.uid || !amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${APP_CONFIG.SERVER_URL}${APP_CONFIG.ENDPOINTS.TOPUP}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: currentCard.uid,
          amount: amount,
        }),
      });

      const result = await response.json();
      if (result.success) {
        Alert.alert('Success', `Added $${amount.toFixed(2)} to card`);
        setTopupAmount('');
      } else {
        Alert.alert('Top-up Failed', result.error || 'Unable to process');
      }
    } catch (error: any) {
      Alert.alert('Connection Error', error.message || 'Cannot reach server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>{isAdmin ? 'Admin Dashboard' : 'Cashier Dashboard'}</Text>
              <Text style={styles.subtitle}>{isAdmin ? 'Card Top-Up Management' : 'Status Overview'}</Text>
            </View>
            <View style={[styles.statusBadge, isConnected && styles.statusOnline]}>
              <View style={[styles.statusDot, isConnected && styles.statusDotOnline]} />
              <Text style={styles.statusText}>{isConnected ? 'Online' : 'Offline'}</Text>
            </View>
          </View>
        </View>

        {/* System Statistics (Admin Only) */}
        {isAdmin && dashboardStats && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="chart-box" size={24} color="#00D9FF" />
              <Text style={styles.cardTitle}>System Statistics</Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={fetchDashboardStats}
              >
                <Ionicons name="refresh" size={18} color="#00D9FF" />
              </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{dashboardStats.totalCards}</Text>
                <Text style={styles.statLabel}>Total Cards</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  ${dashboardStats.totalBalance.toFixed(2)}
                </Text>
                <Text style={styles.statLabel}>Total Balance</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {dashboardStats.totalTransactions}
                </Text>
                <Text style={styles.statLabel}>Transactions</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {dashboardStats.topupsCount}
                </Text>
                <Text style={styles.statLabel}>Top-ups</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {dashboardStats.paymentsCount}
                </Text>
                <Text style={styles.statLabel}>Payments</Text>
              </View>

              <View style={[styles.statBox, styles.statBoxHighlight]}>
                <Text style={styles.statValue}>
                  {dashboardStats.topupsCount + dashboardStats.paymentsCount}
                </Text>
                <Text style={styles.statLabel}>Total Activity</Text>
              </View>
            </View>
          </View>
        )}

        {/* Card Section */}
        <View style={styles.cardSection}>
          {!currentCard ? (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="card" size={24} color="#00D9FF" />
                <Text style={styles.cardTitle}>Card Status</Text>
              </View>
              <View style={styles.noCard}>
                <Text style={styles.noCardText}>No card detected</Text>
                <Text style={styles.noCardSubtext}>Scan a card to begin</Text>
                <TouchableOpacity style={styles.scanButton} onPress={simulateCardScan}>
                  <Ionicons name="scan" size={20} color="#0A0A0A" style={{ marginRight: 8 }} />
                  <Text style={styles.scanButtonText}>Scan Card</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Current Card</Text>
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={refreshCardBalance}
                >
                  <Ionicons name="refresh" size={18} color="#00D9FF" />
                </TouchableOpacity>
              </View>
              <View style={styles.cardVisualContainer}>
                <RFIDCard
                  uid={currentCard.uid}
                  balance={currentCard.balance}
                  status={currentCard.status}
                />
              </View>
            </View>
          )}
        </View>

        {/* Admin: Top-up Section */}
        {isAdmin && currentCard && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="account-balance-wallet" size={24} color="#00D9FF" />
              <Text style={styles.cardTitle}>Top-Up Card</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Amount ($)</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.input}
                  value={topupAmount}
                  onChangeText={setTopupAmount}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#666666"
                />
              </View>
            </View>

            <Text style={styles.quickLabel}>Quick Amounts</Text>
            <View style={styles.quickAmounts}>
              {[10, 20, 50, 100].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={styles.quickButton}
                  onPress={() => setTopupAmount(amount.toString())}
                >
                  <Text style={styles.quickButtonText}>${amount}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.button, (!topupAmount || loading) && styles.buttonDisabled]}
              onPress={handleTopup}
              disabled={!topupAmount || loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Processing...' : 'Confirm Top-Up'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Cashier: Status Info */}
        {!isAdmin && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="information" size={24} color="#00D9FF" />
              <Text style={styles.cardTitle}>System Status</Text>
            </View>
            <View style={styles.statusInfo}>
              <View style={styles.statusItem}>
                <Text style={styles.statusItemLabel}>Server Connection</Text>
                <Text style={[styles.statusItemValue, isConnected ? styles.statusOnlineText : styles.statusOfflineText]}>
                  {isConnected ? '● Online' : '○ Offline'}
                </Text>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusItemLabel}>Card Reader</Text>
                <Text style={[styles.statusItemValue, currentCard ? styles.statusOnlineText : styles.statusOfflineText]}>
                  {currentCard ? '● Active' : '○ Inactive'}
                </Text>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusItemLabel}>Role</Text>
                <Text style={styles.statusItemValue}>Cashier</Text>
              </View>
            </View>
            <View style={styles.statusNote}>
              <Ionicons name="information-circle" size={16} color="#888888" style={{ marginRight: 8 }} />
              <Text style={styles.statusNoteText}>
                Go to Shop tab to process payments
              </Text>
            </View>
          </View>
        )}

        {/* Transaction History */}
        {currentCard && transactions.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="history" size={24} color="#00D9FF" />
              <Text style={styles.cardTitle}>Transaction History</Text>
              <View style={styles.transactionBadge}>
                <Text style={styles.transactionBadgeText}>{transactions.length}</Text>
              </View>
            </View>
            <ScrollView style={styles.transactionList} showsVerticalScrollIndicator={false}>
              {transactions.map((tx) => (
                <View key={tx.id} style={styles.transactionItem}>
                  <View style={styles.transactionIcon}>
                    <Ionicons
                      name={tx.type === 'topup' ? 'arrow-down' : 'arrow-up'}
                      size={20}
                      color={tx.type === 'topup' ? '#00FF88' : '#FF4444'}
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionType}>
                      {tx.type === 'topup' ? 'Top-Up' : 'Payment'}
                    </Text>
                    <Text style={styles.transactionTime}>
                      {new Date(tx.timestamp).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.transactionAmounts}>
                    <Text style={[
                      styles.transactionAmount,
                      tx.type === 'topup' ? styles.transactionAmountPositive : styles.transactionAmountNegative
                    ]}>
                      {tx.type === 'topup' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </Text>
                    <Text style={styles.transactionBalance}>
                      Balance: ${tx.balance.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  statusOnline: {
    borderColor: '#00D9FF',
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
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
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
  cardSection: {
    margin: 20,
    marginBottom: 0,
    marginTop: 20,
  },
  cardVisualContainer: {
    alignItems: 'center',
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  noCard: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noCardText: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 8,
  },
  noCardSubtext: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: '#00D9FF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: '700',
  },
  cardContent: {
    gap: 16,
  },
  balanceBox: {
    backgroundColor: '#0A0A0A',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#00D9FF',
  },
  uidBox: {
    backgroundColor: '#0A0A0A',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  uidLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
  },
  uidValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00D9FF',
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888888',
    marginBottom: 12,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickButton: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignItems: 'center',
  },
  quickButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00D9FF',
  },
  button: {
    backgroundColor: '#00D9FF',
    paddingVertical: 16,
    borderRadius: 12,
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
  statusInfo: {
    gap: 16,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  statusItemLabel: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '600',
  },
  statusItemValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statusOnlineText: {
    color: '#00D9FF',
  },
  statusOfflineText: {
    color: '#FF4444',
  },
  statusNote: {
    backgroundColor: '#0A0A0A',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusNoteText: {
    fontSize: 14,
    color: '#888888',
    flex: 1,
  },
  refreshButton: {
    width: 32,
    height: 32,
    backgroundColor: '#0A0A0A',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#0A0A0A',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignItems: 'center',
  },
  statBoxHighlight: {
    borderColor: '#00D9FF',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00D9FF',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#888888',
    textAlign: 'center',
    fontWeight: '600',
  },
  transactionBadge: {
    backgroundColor: '#00D9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  transactionBadgeText: {
    color: '#0A0A0A',
    fontSize: 12,
    fontWeight: '700',
  },
  transactionList: {
    maxHeight: 400,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 12,
    color: '#666666',
  },
  transactionAmounts: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  transactionAmountPositive: {
    color: '#00FF88',
  },
  transactionAmountNegative: {
    color: '#FF4444',
  },
  transactionBalance: {
    fontSize: 12,
    color: '#888888',
  },
});
