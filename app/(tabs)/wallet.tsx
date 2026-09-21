import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { CFSlot } from '../../components/CFSlot';
import { useContentFlow } from '../../providers/ContentFlowProvider';

const { width } = Dimensions.get('window');

export default function WalletScreen() {
  const { commerce, account, engagement, sync } = useContentFlow();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await sync();
    setRefreshing(false);
  }, [sync]);

  const handleAction = (action: string) => {
    if (action === 'add_money') {
      commerce({ action: 'top_up', currency: 'SAR', status: 'initiated' });
    } else if (action === 'send') {
      commerce({ action: 'transfer', currency: 'SAR', transferType: 'internal', status: 'initiated' });
    } else if (action === 'withdraw') {
      commerce({ action: 'withdraw', currency: 'SAR', status: 'initiated' });
    } else {
      engagement({ action: 'click', element: `wallet_${action}`, screen: 'wallet' });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#571FE4" />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wallet</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <LinearGradient colors={['#571FE4', '#7C3AED']} style={styles.balanceCard}>
        <View style={styles.balanceTop}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <View style={styles.eyeBtn}>
            <Text style={styles.eyeIcon}>👁️</Text>
          </View>
        </View>
        <Text style={styles.balanceAmount}>SAR 24,580.00</Text>
        <View style={styles.balanceChange}>
          <View style={styles.changeTag}>
            <Text style={styles.changeUp}>↑ 12.5%</Text>
          </View>
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
      </LinearGradient>

      {/* Wallet Promo Slot */}
      <CFSlot blockKey="wallet-promo" style={styles.promoSlot}>
        <LinearGradient colors={['#FEF3C7', '#FDE68A']} style={styles.promoPlaceholder}>
          <Text style={styles.promoIcon}>💳</Text>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Upgrade to Premium</Text>
            <Text style={styles.promoSubtitle}>Enjoy 0% transfer fees & more</Text>
          </View>
          <View style={styles.promoArrow}><Text style={styles.arrowText}>→</Text></View>
        </LinearGradient>
      </CFSlot>

      {/* Upgrade Banner Slot */}
      <CFSlot blockKey="wallet-upgrade" style={styles.upgradeSlot}>
        <LinearGradient colors={['#1E293B', '#334155']} style={styles.upgradePlaceholder}>
          <View style={styles.upgradeBadge}>
            <Text style={styles.upgradeBadgeText}>PREMIUM</Text>
          </View>
          <View style={styles.upgradeContent}>
            <Text style={styles.upgradeTitle}>Go Premium Today</Text>
            <Text style={styles.upgradeSubtitle}>Unlimited transfers • Priority support • Exclusive rewards</Text>
          </View>
          <View style={styles.upgradeCta}>
            <Text style={styles.upgradeCtaText}>Upgrade</Text>
          </View>
        </LinearGradient>
      </CFSlot>

      {/* Cards Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Cards</Text>
          <TouchableOpacity><Text style={styles.addNew}>+ Add</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll}>
          <CreditCard type="Visa Platinum" last4="4242" balance="SAR 15,200" colors={['#1E293B', '#475569']} />
          <CreditCard type="Mastercard Gold" last4="8899" balance="SAR 9,380" colors={['#7C3AED', '#A855F7']} />
          <AddCardButton />
        </ScrollView>
      </View>

      {/* Card Offers Slot */}
      <CFSlot blockKey="wallet-card-offers" style={styles.cardOffersSlot}>
        <LinearGradient colors={['#EEF2FF', '#E0E7FF']} style={styles.cardOffersPlaceholder}>
          <Text style={styles.cardOffersIcon}>🎯</Text>
          <Text style={styles.cardOffersTitle}>Exclusive Card Offers</Text>
          <Text style={styles.cardOffersSubtitle}>Personalized deals for your cards</Text>
          <View style={styles.cardOffersCta}>
            <Text style={styles.cardOffersCtaText}>View Offers</Text>
          </View>
        </LinearGradient>
      </CFSlot>

      {/* Quick Pay */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Pay</Text>
          <TouchableOpacity><Text style={styles.viewAll}>Manage</Text></TouchableOpacity>
        </View>
        <View style={styles.quickPayGrid}>
          <PayContact name="Ahmed" initials="AM" color="#E8F5E9" />
          <PayContact name="Sara" initials="SR" color="#E3F2FD" />
          <PayContact name="Omar" initials="OM" color="#FFF3E0" />
          <PayContact name="Fatima" initials="FA" color="#FCE4EC" />
          <PayContact name="Add" initials="+" color="#F5F5F5" isAdd />
        </View>
      </View>

      {/* Spending Insights Slot */}
      <CFSlot blockKey="wallet-insights" style={styles.insightsSlot}>
        <View style={styles.insightsPlaceholder}>
          <View style={styles.insightsHeader}>
            <Text style={styles.insightsIcon}>📊</Text>
            <Text style={styles.insightsTitle}>Spending Insights</Text>
          </View>
          <View style={styles.insightsContent}>
            <View style={styles.insightItem}>
              <View style={[styles.insightBar, { backgroundColor: '#22C55E', width: '80%' }]} />
              <Text style={styles.insightLabel}>Food & Dining</Text>
              <Text style={styles.insightValue}>SAR 1,240</Text>
            </View>
            <View style={styles.insightItem}>
              <View style={[styles.insightBar, { backgroundColor: '#3B82F6', width: '60%' }]} />
              <Text style={styles.insightLabel}>Shopping</Text>
              <Text style={styles.insightValue}>SAR 890</Text>
            </View>
            <View style={styles.insightItem}>
              <View style={[styles.insightBar, { backgroundColor: '#F59E0B', width: '40%' }]} />
              <Text style={styles.insightLabel}>Transport</Text>
              <Text style={styles.insightValue}>SAR 450</Text>
            </View>
          </View>
        </View>
      </CFSlot>

      {/* Wallet Rewards Slot */}
      <CFSlot blockKey="wallet-rewards" style={styles.rewardsSlot}>
        <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={styles.rewardsPlaceholder}>
          <View style={styles.rewardsLeft}>
            <Text style={styles.rewardsIcon}>🏆</Text>
            <View>
              <Text style={styles.rewardsLabel}>Reward Points</Text>
              <Text style={styles.rewardsValue}>4,250 pts</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.redeemBtn}>
            <Text style={styles.redeemText}>Redeem</Text>
          </TouchableOpacity>
        </LinearGradient>
      </CFSlot>

      {/* Cashback Slot */}
      <CFSlot blockKey="wallet-cashback" style={styles.cashbackSlot}>
        <LinearGradient colors={['#FEF3C7', '#FDE68A']} style={styles.cashbackPlaceholder}>
          <Text style={styles.cashbackIcon}>💰</Text>
          <View style={styles.cashbackContent}>
            <Text style={styles.cashbackTitle}>Cashback Earned</Text>
            <Text style={styles.cashbackValue}>SAR 156.50</Text>
          </View>
          <View style={styles.cashbackCta}>
            <Text style={styles.cashbackCtaText}>Withdraw</Text>
          </View>
        </LinearGradient>
      </CFSlot>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity><Text style={styles.viewAll}>View all</Text></TouchableOpacity>
        </View>
        <View style={styles.transactions}>
          <Transaction merchant="SACO" category="Shopping" amount="-SAR 450" date="Today, 2:30 PM" icon="🛒" />
          <Transaction merchant="Uber" category="Transport" amount="-SAR 35" date="Today, 10:15 AM" icon="🚗" />
          <Transaction merchant="Payroll" category="Income" amount="+SAR 12,000" date="Yesterday" positive icon="💰" />
          <Transaction merchant="Netflix" category="Entertainment" amount="-SAR 45" date="Sep 18" icon="🎬" />
          <Transaction merchant="Jarir Bookstore" category="Shopping" amount="-SAR 280" date="Sep 17" icon="📚" />
        </View>
      </View>

      {/* Goals Slot */}
      <CFSlot blockKey="wallet-goals" style={styles.goalsSlot}>
        <View style={styles.goalsPlaceholder}>
          <View style={styles.goalsHeader}>
            <Text style={styles.goalsIcon}>🎯</Text>
            <View style={styles.goalsInfo}>
              <Text style={styles.goalsTitle}>Vacation Fund</Text>
              <Text style={styles.goalsSubtitle}>SAR 3,500 of SAR 10,000</Text>
            </View>
            <Text style={styles.goalsPercent}>35%</Text>
          </View>
          <View style={styles.goalsProgress}>
            <View style={[styles.goalsProgressFill, { width: '35%' }]} />
          </View>
        </View>
      </CFSlot>

      {/* Bottom Banner Slot */}
      <CFSlot blockKey="wallet-bottom" style={styles.bottomSlot}>
        <LinearGradient colors={['#F5F5F5', '#E5E5E5']} style={styles.bottomPlaceholder}>
          <Text style={styles.bottomIcon}>🔒</Text>
          <Text style={styles.bottomText}>Your money is secure with bank-grade encryption</Text>
        </LinearGradient>
      </CFSlot>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function CreditCard({ type, last4, balance, colors }: { type: string; last4: string; balance: string; colors: readonly [string, string] }) {
  return (
    <LinearGradient colors={colors as any} style={styles.card}>
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
    </LinearGradient>
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

function Transaction({ merchant, category, amount, date, positive, icon }: {
  merchant: string; category: string; amount: string; date: string; positive?: boolean; icon: string;
}) {
  return (
    <View style={styles.transaction}>
      <View style={styles.transactionIconContainer}>
        <Text style={styles.transactionEmoji}>{icon}</Text>
      </View>
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
  settingsBtn: { width: 44, height: 44, backgroundColor: '#fff', borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  settingsIcon: { fontSize: 20 },

  balanceCard: { marginHorizontal: 20, borderRadius: 24, padding: 24, marginBottom: 20 },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  eyeBtn: { padding: 4 },
  eyeIcon: { fontSize: 18 },
  balanceAmount: { fontSize: 36, fontWeight: '700', color: '#fff', marginTop: 8 },
  balanceChange: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  changeTag: { backgroundColor: 'rgba(134, 239, 172, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 8 },
  changeUp: { fontSize: 14, fontWeight: '600', color: '#86EFAC' },
  changeText: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  actionButtons: { flexDirection: 'row', marginTop: 24, gap: 10 },
  actionBtn: { flex: 1, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  actionBtnOutline: { backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  actionIcon: { fontSize: 18, fontWeight: '700', color: '#571FE4', marginRight: 6 },
  actionIconOutline: { color: '#fff' },
  actionLabel: { fontSize: 13, fontWeight: '600', color: '#571FE4' },
  actionLabelOutline: { color: '#fff' },

  promoSlot: { marginHorizontal: 20, height: 72, borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  promoPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  promoIcon: { fontSize: 28, marginRight: 12 },
  promoContent: { flex: 1 },
  promoTitle: { fontSize: 15, fontWeight: '600', color: '#92400E' },
  promoSubtitle: { fontSize: 12, color: '#B45309', marginTop: 2 },
  promoArrow: { width: 36, height: 36, backgroundColor: '#F59E0B', borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  arrowText: { color: '#fff', fontSize: 18, fontWeight: '600' },

  // Upgrade slot
  upgradeSlot: { marginHorizontal: 20, height: 100, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  upgradePlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  upgradeBadge: { backgroundColor: '#F59E0B', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginRight: 14 },
  upgradeBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  upgradeContent: { flex: 1 },
  upgradeTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  upgradeSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  upgradeCta: { backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  upgradeCtaText: { color: '#1E293B', fontWeight: '600', fontSize: 14 },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },
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

  cardOffersSlot: { marginHorizontal: 20, height: 120, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  cardOffersPlaceholder: { flex: 1, padding: 20, justifyContent: 'center' },
  cardOffersIcon: { fontSize: 28, marginBottom: 4 },
  cardOffersTitle: { fontSize: 16, fontWeight: '600', color: '#4338CA' },
  cardOffersSubtitle: { fontSize: 13, color: '#6366F1', marginTop: 2 },
  cardOffersCta: { backgroundColor: '#4338CA', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, alignSelf: 'flex-start', marginTop: 10 },
  cardOffersCtaText: { color: '#fff', fontWeight: '600', fontSize: 12 },

  quickPayGrid: { flexDirection: 'row', paddingHorizontal: 20, justifyContent: 'space-between' },
  payContact: { alignItems: 'center' },
  payAvatar: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  payInitials: { fontSize: 18, fontWeight: '600', color: '#333' },
  payInitialsAdd: { fontSize: 24, color: '#888' },
  payName: { fontSize: 12, color: '#666' },

  // Insights
  insightsSlot: { marginHorizontal: 20, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  insightsPlaceholder: { backgroundColor: '#fff', padding: 20 },
  insightsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  insightsIcon: { fontSize: 24, marginRight: 10 },
  insightsTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  insightsContent: {},
  insightItem: { marginBottom: 12 },
  insightBar: { height: 6, borderRadius: 3, marginBottom: 6 },
  insightLabel: { fontSize: 13, color: '#666' },
  insightValue: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', position: 'absolute', right: 0, top: 12 },

  rewardsSlot: { marginHorizontal: 20, height: 80, borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  rewardsPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  rewardsLeft: { flexDirection: 'row', alignItems: 'center' },
  rewardsIcon: { fontSize: 32, marginRight: 14 },
  rewardsLabel: { fontSize: 13, color: '#166534' },
  rewardsValue: { fontSize: 24, fontWeight: '700', color: '#15803D', marginTop: 2 },
  redeemBtn: { backgroundColor: '#22C55E', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  redeemText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  // Cashback
  cashbackSlot: { marginHorizontal: 20, height: 80, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  cashbackPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  cashbackIcon: { fontSize: 32, marginRight: 14 },
  cashbackContent: { flex: 1 },
  cashbackTitle: { fontSize: 13, color: '#92400E' },
  cashbackValue: { fontSize: 22, fontWeight: '700', color: '#B45309', marginTop: 2 },
  cashbackCta: { backgroundColor: '#F59E0B', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  cashbackCtaText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  transactions: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16, overflow: 'hidden' },
  transaction: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  transactionIconContainer: { width: 44, height: 44, backgroundColor: '#F5F5F5', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  transactionEmoji: { fontSize: 20 },
  transactionInfo: { flex: 1 },
  transactionMerchant: { fontSize: 15, fontWeight: '500', color: '#1a1a1a' },
  transactionCategory: { fontSize: 12, color: '#888', marginTop: 3 },
  transactionRight: { alignItems: 'flex-end' },
  transactionAmount: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  amountPositive: { color: '#22c55e' },
  transactionDate: { fontSize: 12, color: '#888', marginTop: 3 },

  // Goals
  goalsSlot: { marginHorizontal: 20, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  goalsPlaceholder: { backgroundColor: '#fff', padding: 20 },
  goalsHeader: { flexDirection: 'row', alignItems: 'center' },
  goalsIcon: { fontSize: 32, marginRight: 14 },
  goalsInfo: { flex: 1 },
  goalsTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  goalsSubtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  goalsPercent: { fontSize: 18, fontWeight: '700', color: '#571FE4' },
  goalsProgress: { height: 8, backgroundColor: '#F0EBFF', borderRadius: 4, marginTop: 16 },
  goalsProgressFill: { height: '100%', backgroundColor: '#571FE4', borderRadius: 4 },

  bottomSlot: { marginHorizontal: 20, height: 70, borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  bottomPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  bottomIcon: { fontSize: 20, marginRight: 10 },
  bottomText: { fontSize: 14, color: '#888', flex: 1 },
});
