import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useContentFlow } from '../../providers/ContentFlowProvider';
import { CFSlot } from '../../components/CFSlot';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { isReady, userId, trackEvent } = useContentFlow();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.userName}>{userId || 'Guest'}</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Text style={styles.notifIcon}>🔔</Text>
          <View style={styles.notifBadge} />
        </TouchableOpacity>
      </View>

      {/* Hero Banner Slot */}
      <CFSlot slotId="home-hero" style={styles.heroSlot}>
        <View style={styles.heroPlaceholder}>
          <View style={styles.heroGradient}>
            <Text style={styles.heroTitle}>Discover What's New</Text>
            <Text style={styles.heroSubtitle}>Exclusive offers tailored for you</Text>
          </View>
        </View>
      </CFSlot>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <QuickAction icon="💸" label="Send" color="#E8F5E9" onPress={() => trackEvent('quick_action', { action: 'send' })} />
        <QuickAction icon="📥" label="Request" color="#E3F2FD" onPress={() => trackEvent('quick_action', { action: 'request' })} />
        <QuickAction icon="✈️" label="Travel" color="#FFF3E0" onPress={() => trackEvent('quick_action', { action: 'travel' })} />
        <QuickAction icon="🍽️" label="Food" color="#FCE4EC" onPress={() => trackEvent('quick_action', { action: 'food' })} />
      </View>

      {/* Inline Promo Slot */}
      <CFSlot slotId="home-inline-1" style={styles.inlineSlot}>
        <View style={styles.inlinePlaceholder}>
          <Text style={styles.inlineIcon}>✨</Text>
          <View style={styles.inlineContent}>
            <Text style={styles.inlineTitle}>Dynamic content slot</Text>
            <Text style={styles.inlineSubtitle}>Configure in ContentFlow dashboard</Text>
          </View>
        </View>
      </CFSlot>

      {/* Balance Overview */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.balanceAmount}>SAR 12,450.00</Text>
        <View style={styles.balanceStats}>
          <View style={styles.balanceStat}>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={styles.statUp}>+SAR 4,200</Text>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceStat}>
            <Text style={styles.statLabel}>Expenses</Text>
            <Text style={styles.statDown}>-SAR 1,850</Text>
          </View>
        </View>
      </View>

      {/* Mid-Page Promo Slot */}
      <CFSlot slotId="home-promo" style={styles.promoSlot}>
        <View style={styles.promoPlaceholder}>
          <Text style={styles.promoIcon}>🎁</Text>
          <Text style={styles.promoTitle}>Special Offer</Text>
          <Text style={styles.promoSubtitle}>Get 5% cashback on your next purchase</Text>
        </View>
      </CFSlot>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity><Text style={styles.seeAll}>View all</Text></TouchableOpacity>
        </View>
        <View style={styles.transactionList}>
          <TransactionItem icon="☕" name="Starbucks" category="Food & Drink" amount="-SAR 28" />
          <TransactionItem icon="🛒" name="Tamimi Markets" category="Groceries" amount="-SAR 245" />
          <TransactionItem icon="💰" name="Salary Credit" category="Income" amount="+SAR 8,500" positive />
          <TransactionItem icon="⛽" name="SASCO" category="Transport" amount="-SAR 180" />
        </View>
      </View>

      {/* Featured Cards Slot */}
      <CFSlot slotId="home-featured" style={styles.featuredSlot}>
        <View style={styles.featuredPlaceholder}>
          <Text style={styles.featuredIcon}>💳</Text>
          <Text style={styles.featuredTitle}>Featured Cards</Text>
          <Text style={styles.featuredSubtitle}>Discover premium card offers</Text>
        </View>
      </CFSlot>

      {/* Services Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.servicesGrid}>
          <ServiceItem icon="📱" label="Mobile Top-up" />
          <ServiceItem icon="💡" label="Pay Bills" />
          <ServiceItem icon="🎫" label="Events" />
          <ServiceItem icon="🏥" label="Insurance" />
          <ServiceItem icon="🎓" label="Education" />
          <ServiceItem icon="🏠" label="Rent" />
        </View>
      </View>

      {/* Bottom Banner Slot */}
      <CFSlot slotId="home-bottom" style={styles.bottomSlot}>
        <View style={styles.bottomPlaceholder}>
          <Text style={styles.bottomIcon}>📢</Text>
          <Text style={styles.bottomText}>Announcements appear here</Text>
        </View>
      </CFSlot>

      {/* Connection Status */}
      <View style={styles.statusBar}>
        <View style={[styles.statusDot, { backgroundColor: isReady ? '#22c55e' : '#f59e0b' }]} />
        <Text style={styles.statusText}>{isReady ? 'SDK Connected' : 'Connecting...'}</Text>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function QuickAction({ icon, label, color, onPress }: { icon: string; label: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Text style={styles.quickActionEmoji}>{icon}</Text>
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function TransactionItem({ icon, name, category, amount, positive }: { icon: string; name: string; category: string; amount: string; positive?: boolean }) {
  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionName}>{name}</Text>
        <Text style={styles.transactionCategory}>{category}</Text>
      </View>
      <Text style={[styles.transactionAmount, positive && styles.amountPositive]}>{amount}</Text>
    </View>
  );
}

function ServiceItem({ icon, label }: { icon: string; label: string }) {
  return (
    <TouchableOpacity style={styles.serviceItem}>
      <View style={styles.serviceIcon}>
        <Text style={{ fontSize: 24 }}>{icon}</Text>
      </View>
      <Text style={styles.serviceLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  greeting: { fontSize: 14, color: '#666' },
  userName: { fontSize: 22, fontWeight: '700', color: '#1a1a1a', marginTop: 2 },
  notifBtn: { width: 44, height: 44, backgroundColor: '#fff', borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  notifIcon: { fontSize: 20 },
  notifBadge: { position: 'absolute', top: 10, right: 12, width: 8, height: 8, backgroundColor: '#ef4444', borderRadius: 4 },

  heroSlot: { marginHorizontal: 20, height: 160, borderRadius: 20, overflow: 'hidden', marginBottom: 24 },
  heroPlaceholder: { flex: 1, backgroundColor: '#571FE4' },
  heroGradient: { flex: 1, padding: 24, justifyContent: 'flex-end' },
  heroTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 6 },

  quickActions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 24 },
  quickAction: { alignItems: 'center' },
  quickActionIcon: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickActionEmoji: { fontSize: 26 },
  quickActionLabel: { fontSize: 13, color: '#444', fontWeight: '500' },

  inlineSlot: { marginHorizontal: 20, height: 72, borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  inlinePlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0EBFF', paddingHorizontal: 16 },
  inlineIcon: { fontSize: 28, marginRight: 14 },
  inlineContent: { flex: 1 },
  inlineTitle: { fontSize: 15, fontWeight: '600', color: '#571FE4' },
  inlineSubtitle: { fontSize: 12, color: '#8B7CC7', marginTop: 2 },

  balanceCard: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  balanceLabel: { fontSize: 14, color: '#888' },
  seeAll: { fontSize: 13, color: '#571FE4', fontWeight: '500' },
  balanceAmount: { fontSize: 32, fontWeight: '700', color: '#1a1a1a' },
  balanceStats: { flexDirection: 'row', marginTop: 20, backgroundColor: '#FAFAFA', borderRadius: 12, padding: 16 },
  balanceStat: { flex: 1, alignItems: 'center' },
  balanceDivider: { width: 1, backgroundColor: '#E5E5E5' },
  statLabel: { fontSize: 12, color: '#888' },
  statUp: { fontSize: 16, fontWeight: '600', color: '#22c55e', marginTop: 4 },
  statDown: { fontSize: 16, fontWeight: '600', color: '#ef4444', marginTop: 4 },

  promoSlot: { marginHorizontal: 20, height: 100, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  promoPlaceholder: { flex: 1, backgroundColor: '#FFF7ED', paddingHorizontal: 20, justifyContent: 'center' },
  promoIcon: { fontSize: 24, marginBottom: 4 },
  promoTitle: { fontSize: 16, fontWeight: '600', color: '#C2410C' },
  promoSubtitle: { fontSize: 13, color: '#EA580C', marginTop: 2 },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a', paddingHorizontal: 20, marginBottom: 12 },

  transactionList: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16, overflow: 'hidden' },
  transactionItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  transactionIcon: { width: 44, height: 44, backgroundColor: '#F5F5F5', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  transactionInfo: { flex: 1 },
  transactionName: { fontSize: 15, fontWeight: '500', color: '#1a1a1a' },
  transactionCategory: { fontSize: 12, color: '#888', marginTop: 2 },
  transactionAmount: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  amountPositive: { color: '#22c55e' },

  featuredSlot: { marginHorizontal: 20, height: 120, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  featuredPlaceholder: { flex: 1, backgroundColor: '#EEF2FF', paddingHorizontal: 20, justifyContent: 'center' },
  featuredIcon: { fontSize: 28, marginBottom: 4 },
  featuredTitle: { fontSize: 16, fontWeight: '600', color: '#4338CA' },
  featuredSubtitle: { fontSize: 13, color: '#6366F1', marginTop: 2 },

  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  serviceItem: { width: (width - 48) / 3, alignItems: 'center', paddingVertical: 16 },
  serviceIcon: { width: 56, height: 56, backgroundColor: '#fff', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8 },
  serviceLabel: { fontSize: 12, color: '#444', textAlign: 'center' },

  bottomSlot: { marginHorizontal: 20, height: 80, borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  bottomPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5' },
  bottomIcon: { fontSize: 20, marginRight: 10 },
  bottomText: { fontSize: 14, color: '#888' },

  statusBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: 12, color: '#888' },
});
