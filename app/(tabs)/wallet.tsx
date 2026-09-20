import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CFSlot } from '../../components/CFSlot';
import { useContentFlow } from '../../providers/ContentFlowProvider';

export default function WalletScreen() {
  const { trackEvent } = useContentFlow();

  const handlePayment = (type: string) => {
    trackEvent('wallet_action', { action: type, screen: 'wallet' });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>$4,285.50</Text>
        <View style={styles.balanceActions}>
          <TouchableOpacity style={styles.balanceBtn} onPress={() => handlePayment('add_money')}>
            <Text style={styles.balanceBtnText}>+ Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.balanceBtn, styles.balanceBtnSecondary]} onPress={() => handlePayment('send')}>
            <Text style={[styles.balanceBtnText, styles.balanceBtnTextSecondary]}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Wallet Promo Slot */}
      <CFSlot slotId="wallet-promo" style={styles.promoSlot}>
        <View style={styles.promoPlaceholder}>
          <Text style={styles.promoEmoji}>💳</Text>
          <Text style={styles.promoText}>Wallet offers load here</Text>
        </View>
      </CFSlot>

      {/* Cards Section */}
      <Text style={styles.sectionTitle}>My Cards</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll}>
        <CreditCard type="Visa" last4="4242" color="#1e3a8a" />
        <CreditCard type="Mastercard" last4="8888" color="#7c3aed" />
        <TouchableOpacity style={styles.addCard}>
          <Text style={styles.addCardIcon}>+</Text>
          <Text style={styles.addCardText}>Add Card</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Quick Pay */}
      <Text style={styles.sectionTitle}>Quick Pay</Text>
      <View style={styles.quickPay}>
        <PayContact name="Sarah" emoji="👩" />
        <PayContact name="John" emoji="👨" />
        <PayContact name="Mom" emoji="👩‍🦳" />
        <PayContact name="Alex" emoji="🧑" />
        <PayContact name="More" emoji="➕" />
      </View>

      {/* Transactions */}
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <View style={styles.transactions}>
        <Transaction merchant="Starbucks" category="Food & Drink" amount="-$5.50" date="Today, 9:30 AM" />
        <Transaction merchant="Uber" category="Transport" amount="-$12.00" date="Today, 8:15 AM" />
        <Transaction merchant="Salary" category="Income" amount="+$3,500.00" date="Yesterday" positive />
        <Transaction merchant="Amazon" category="Shopping" amount="-$89.99" date="Sep 18" />
      </View>

      {/* Bottom Slot */}
      <CFSlot slotId="wallet-bottom" style={styles.bottomSlot} />
    </ScrollView>
  );
}

function CreditCard({ type, last4, color }: { type: string; last4: string; color: string }) {
  return (
    <View style={[styles.creditCard, { backgroundColor: color }]}>
      <Text style={styles.cardType}>{type}</Text>
      <Text style={styles.cardNumber}>•••• •••• •••• {last4}</Text>
      <Text style={styles.cardExpiry}>12/28</Text>
    </View>
  );
}

function PayContact({ name, emoji }: { name: string; emoji: string }) {
  return (
    <TouchableOpacity style={styles.payContact}>
      <View style={styles.payContactAvatar}>
        <Text style={styles.payContactEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.payContactName}>{name}</Text>
    </TouchableOpacity>
  );
}

function Transaction({ merchant, category, amount, date, positive }: {
  merchant: string; category: string; amount: string; date: string; positive?: boolean
}) {
  return (
    <View style={styles.transaction}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionMerchant}>{merchant}</Text>
        <Text style={styles.transactionCategory}>{category}</Text>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[styles.transactionAmount, positive && styles.transactionPositive]}>{amount}</Text>
        <Text style={styles.transactionDate}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  balanceCard: {
    backgroundColor: '#571FE4',
    margin: 16,
    padding: 24,
    borderRadius: 20,
  },
  balanceLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  balanceAmount: { color: '#fff', fontSize: 36, fontWeight: '700', marginVertical: 8 },
  balanceActions: { flexDirection: 'row', marginTop: 16, gap: 12 },
  balanceBtn: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  balanceBtnSecondary: { backgroundColor: 'rgba(255,255,255,0.2)' },
  balanceBtnText: { fontWeight: '600', color: '#571FE4' },
  balanceBtnTextSecondary: { color: '#fff' },
  promoSlot: { height: 100, marginHorizontal: 16, marginBottom: 16, borderRadius: 12, overflow: 'hidden' },
  promoPlaceholder: {
    flex: 1,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a78bfa',
    borderStyle: 'dashed',
  },
  promoEmoji: { fontSize: 32, marginBottom: 8 },
  promoText: { color: '#5b21b6', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginHorizontal: 16, marginBottom: 12, color: '#333' },
  cardsScroll: { paddingLeft: 16, marginBottom: 24 },
  creditCard: {
    width: 280,
    height: 160,
    borderRadius: 16,
    padding: 20,
    marginRight: 12,
    justifyContent: 'space-between',
  },
  cardType: { color: '#fff', fontSize: 18, fontWeight: '600' },
  cardNumber: { color: 'rgba(255,255,255,0.9)', fontSize: 18, letterSpacing: 2 },
  cardExpiry: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  addCard: {
    width: 140,
    height: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    marginRight: 16,
  },
  addCardIcon: { fontSize: 32, color: '#888' },
  addCardText: { color: '#888', marginTop: 8 },
  quickPay: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 24, justifyContent: 'space-between' },
  payContact: { alignItems: 'center' },
  payContactAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  payContactEmoji: { fontSize: 24 },
  payContactName: { fontSize: 12, color: '#666' },
  transactions: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 12, marginBottom: 16 },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionInfo: {},
  transactionMerchant: { fontSize: 15, fontWeight: '500', color: '#333' },
  transactionCategory: { fontSize: 12, color: '#888', marginTop: 4 },
  transactionRight: { alignItems: 'flex-end' },
  transactionAmount: { fontSize: 15, fontWeight: '600', color: '#333' },
  transactionPositive: { color: '#22c55e' },
  transactionDate: { fontSize: 12, color: '#888', marginTop: 4 },
  bottomSlot: { height: 80, margin: 16 },
});
