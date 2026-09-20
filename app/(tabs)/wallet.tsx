import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { CFSlot } from '../../components/CFSlot';
import { useContentFlow } from '../../providers/ContentFlowProvider';

const { width } = Dimensions.get('window');

export default function WalletScreen() {
  const { trackEvent } = useContentFlow();

  const handleAction = (action: string) => {
    trackEvent('wallet_action', { action, screen: 'wallet' });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wallet</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>SAR 24,580.00</Text>
        <View style={styles.balanceChange}>
          <Text style={styles.changeUp}>↑ 12.5%</Text>
          <Text style={styles.changeText}>from last month</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction('add_money')}>
            <Text style={styles.actionIcon}>+</Text>
            <Text style={styles.actionLabel}>Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]} onPress={() => handleAction('send')}>
            <Text style={[styles.actionIcon, styles.actionIconOutline]}>→</Text>
            <Text style={[styles.actionLabel, styles.actionLabelOutline]}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]} onPress={() => handleAction('withdraw')}>
            <Text style={[styles.actionIcon, styles.actionIconOutline]}>↓</Text>
            <Text style={[styles.actionLabel, styles.actionLabelOutline]}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Wallet Promo Slot */}
      <CFSlot slotId="wallet-promo" style={styles.promoSlot}>
        <View style={styles.promoPlaceholder}>
          <Text style={styles.promoIcon}>💳</Text>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Upgrade to Premium</Text>
            <Text style={styles.promoSubtitle}>Enjoy 0% transfer fees & more</Text>
          </View>
          <View style={styles.promoArrow}><Text style={styles.arrowText}>→</Text></View>
        </View>
      </CFSlot>

      {/* Cards Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Cards</Text>
          <TouchableOpacity><Text style={styles.addNew}>+ Add</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll}>
          <CreditCard type="Visa Platinum" last4="4242" balance="SAR 15,200" color="#1E293B" />
          <CreditCard type="Mastercard Gold" last4="8899" balance="SAR 9,380" color="#7C3AED" />
          <AddCardButton />
        </ScrollView>
      </View>

      {/* Card Offers Slot */}
      <CFSlot slotId="wallet-card-offers" style={styles.cardOffersSlot}>
        <View style={styles.cardOffersPlaceholder}>
          <Text style={styles.cardOffersIcon}>🎯</Text>
          <Text style={styles.cardOffersTitle}>Exclusive Card Offers</Text>
          <Text style={styles.cardOffersSubtitle}>Personalized deals for your cards</Text>
        </View>
      </CFSlot>

      {/* Quick Pay */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Pay</Text>
        <View style={styles.quickPayGrid}>
          <PayContact name="Ahmed" initials="AM" color="#E8F5E9" />
          <PayContact name="Sara" initials="SR" color="#E3F2FD" />
          <PayContact name="Omar" initials="OM" color="#FFF3E0" />
          <PayContact name="Fatima" initials="FA" color="#FCE4EC" />
          <PayContact name="Add" initials="+" color="#F5F5F5" isAdd />
        </View>
      </View>

      {/* Wallet Rewards Slot */}
      <CFSlot slotId="wallet-rewards" style={styles.rewardsSlot}>
        <View style={styles.rewardsPlaceholder}>
          <View style={styles.rewardsLeft}>
            <Text style={styles.rewardsLabel}>Reward Points</Text>
            <Text style={styles.rewardsValue}>4,250 pts</Text>
          </View>
          <TouchableOpacity style={styles.redeemBtn}>
            <Text style={styles.redeemText}>Redeem</Text>
          </TouchableOpacity>
        </View>
      </CFSlot>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity><Text style={styles.viewAll}>View all</Text></TouchableOpacity>
        </View>
        <View style={styles.transactions}>
          <Transaction merchant="SACO" category="Shopping" amount="-SAR 450" date="Today, 2:30 PM" />
          <Transaction merchant="Uber" category="Transport" amount="-SAR 35" date="Today, 10:15 AM" />
          <Transaction merchant="Payroll" category="Income" amount="+SAR 12,000" date="Yesterday" positive />
          <Transaction merchant="Netflix" category="Entertainment" amount="-SAR 45" date="Sep 18" />
          <Transaction merchant="Jarir Bookstore" category="Shopping" amount="-SAR 280" date="Sep 17" />
        </View>
      </View>

      {/* Bottom Banner Slot */}
      <CFSlot slotId="wallet-bottom" style={styles.bottomSlot}>
        <View style={styles.bottomPlaceholder}>
          <Text style={styles.bottomIcon}>📊</Text>
          <Text style={styles.bottomText}>Spending insights coming soon</Text>
        </View>
      </CFSlot>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function CreditCard({ type, last4, balance, color }: { type: string; last4: string; balance: string; color: string }) {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <View style={styles.cardTop}>
        <Text style={styles.cardType}>{type}</Text>
        <Text style={styles.cardChip}>💳</Text>
      </View>
      <Text style={styles.cardNumber}>•••• •••• •••• {last4}</Text>
      <View style={styles.cardBottom}>
        <View>
          <Text style={styles.cardBalanceLabel}>Balance</Text>
          <Text style={styles.cardBalance}>{balance}</Text>
        </View>
        <Text style={styles.cardExpiry}>12/28</Text>
      </View>
    </View>
  );
}

function AddCardButton() {
  return (
    <TouchableOpacity style={styles.addCard}>
      <View style={styles.addCardIcon}><Text style={styles.addCardPlus}>+</Text></View>
      <Text style={styles.addCardText}>Add New Card</Text>
    </TouchableOpacity>
  );
}

function PayContact({ name, initials, color, isAdd }: { name: string; initials: string; color: string; isAdd?: boolean }) {
  return (
    <TouchableOpacity style={styles.payContact}>
      <View style={[styles.payAvatar, { backgroundColor: color }]}>
        <Text style={[styles.payInitials, isAdd && styles.payInitialsAdd]}>{initials}</Text>
      </View>
      <Text style={styles.payName}>{name}</Text>
    </TouchableOpacity>
  );
}

function Transaction({ merchant, category, amount, date, positive }: {
  merchant: string; category: string; amount: string; date: string; positive?: boolean;
}) {
  return (
    <View style={styles.transaction}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionMerchant}>{merchant}</Text>
        <Text style={styles.transactionCategory}>{category}</Text>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[styles.transactionAmount, positive && styles.amountPositive]}>{amount}</Text>
        <Text style={styles.transactionDate}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#1a1a1a' },
  settingsBtn: { width: 44, height: 44, backgroundColor: '#fff', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  settingsIcon: { fontSize: 20 },

  balanceCard: { backgroundColor: '#571FE4', marginHorizontal: 20, borderRadius: 24, padding: 24, marginBottom: 20 },
  balanceLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  balanceAmount: { fontSize: 36, fontWeight: '700', color: '#fff', marginTop: 4 },
  balanceChange: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  changeUp: { fontSize: 14, fontWeight: '600', color: '#86EFAC', marginRight: 6 },
  changeText: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  actionButtons: { flexDirection: 'row', marginTop: 24, gap: 10 },
  actionBtn: { flex: 1, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  actionBtnOutline: { backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  actionIcon: { fontSize: 18, fontWeight: '700', color: '#571FE4', marginRight: 6 },
  actionIconOutline: { color: '#fff' },
  actionLabel: { fontSize: 13, fontWeight: '600', color: '#571FE4' },
  actionLabelOutline: { color: '#fff' },

  promoSlot: { marginHorizontal: 20, height: 72, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  promoPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 16 },
  promoIcon: { fontSize: 28, marginRight: 12 },
  promoContent: { flex: 1 },
  promoTitle: { fontSize: 15, fontWeight: '600', color: '#92400E' },
  promoSubtitle: { fontSize: 12, color: '#B45309', marginTop: 2 },
  promoArrow: { width: 32, height: 32, backgroundColor: '#F59E0B', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  arrowText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a', paddingHorizontal: 20, marginBottom: 14 },
  addNew: { fontSize: 14, color: '#571FE4', fontWeight: '600' },
  viewAll: { fontSize: 14, color: '#571FE4', fontWeight: '500' },

  cardsScroll: { paddingLeft: 20, paddingRight: 8 },
  card: { width: 280, height: 170, borderRadius: 20, padding: 20, marginRight: 12, justifyContent: 'space-between' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardType: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  cardChip: { fontSize: 24 },
  cardNumber: { fontSize: 18, color: '#fff', letterSpacing: 2 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardBalanceLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  cardBalance: { fontSize: 18, fontWeight: '700', color: '#fff', marginTop: 2 },
  cardExpiry: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  addCard: { width: 140, height: 170, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#E5E5E5', borderStyle: 'dashed' },
  addCardIcon: { width: 48, height: 48, backgroundColor: '#F5F5F5', borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  addCardPlus: { fontSize: 24, color: '#888' },
  addCardText: { fontSize: 13, color: '#888' },

  cardOffersSlot: { marginHorizontal: 20, height: 100, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  cardOffersPlaceholder: { flex: 1, backgroundColor: '#EEF2FF', padding: 20, justifyContent: 'center' },
  cardOffersIcon: { fontSize: 24, marginBottom: 4 },
  cardOffersTitle: { fontSize: 15, fontWeight: '600', color: '#4338CA' },
  cardOffersSubtitle: { fontSize: 12, color: '#6366F1', marginTop: 2 },

  quickPayGrid: { flexDirection: 'row', paddingHorizontal: 20, justifyContent: 'space-between' },
  payContact: { alignItems: 'center' },
  payAvatar: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  payInitials: { fontSize: 18, fontWeight: '600', color: '#333' },
  payInitialsAdd: { fontSize: 24, color: '#888' },
  payName: { fontSize: 12, color: '#666' },

  rewardsSlot: { marginHorizontal: 20, height: 80, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  rewardsPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F0FDF4', paddingHorizontal: 20 },
  rewardsLeft: {},
  rewardsLabel: { fontSize: 13, color: '#166534' },
  rewardsValue: { fontSize: 24, fontWeight: '700', color: '#15803D', marginTop: 2 },
  redeemBtn: { backgroundColor: '#22C55E', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  redeemText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  transactions: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16, overflow: 'hidden' },
  transaction: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  transactionInfo: {},
  transactionMerchant: { fontSize: 15, fontWeight: '500', color: '#1a1a1a' },
  transactionCategory: { fontSize: 12, color: '#888', marginTop: 3 },
  transactionRight: { alignItems: 'flex-end' },
  transactionAmount: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  amountPositive: { color: '#22c55e' },
  transactionDate: { fontSize: 12, color: '#888', marginTop: 3 },

  bottomSlot: { marginHorizontal: 20, height: 70, borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  bottomPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5' },
  bottomIcon: { fontSize: 20, marginRight: 10 },
  bottomText: { fontSize: 14, color: '#888' },
});
