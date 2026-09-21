import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useContentFlow } from '../../providers/ContentFlowProvider';
import { CFSlot } from '../../components/CFSlot';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { isReady, userId, trackEvent, sync } = useContentFlow();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await sync();
    setRefreshing(false);
  }, [sync]);

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
        <View>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.userName}>{userId || 'Guest'}</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Text style={styles.notifIcon}>🔔</Text>
          <View style={styles.notifBadge} />
        </TouchableOpacity>
      </View>

      {/* Stories Slot - Instagram-style */}
      <CFSlot slotId="home-stories" style={styles.storiesSlot}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesScroll}>
          <StoryItem label="Offers" emoji="🎁" hasNew />
          <StoryItem label="Travel" emoji="✈️" hasNew />
          <StoryItem label="Food" emoji="🍔" />
          <StoryItem label="Rewards" emoji="⭐" hasNew />
          <StoryItem label="Tips" emoji="💡" />
          <StoryItem label="Events" emoji="🎪" />
        </ScrollView>
      </CFSlot>

      {/* Hero Banner Slot */}
      <CFSlot slotId="home-hero" style={styles.heroSlot}>
        <LinearGradient colors={['#571FE4', '#7C3AED']} style={styles.heroPlaceholder}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>NEW</Text>
          </View>
          <Text style={styles.heroTitle}>Discover What's New</Text>
          <Text style={styles.heroSubtitle}>Exclusive offers tailored for you</Text>
          <View style={styles.heroCta}>
            <Text style={styles.heroCtaText}>Explore</Text>
          </View>
        </LinearGradient>
      </CFSlot>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <QuickAction icon="💸" label="Send" color="#E8F5E9" onPress={() => trackEvent('quick_action', { action: 'send' })} />
        <QuickAction icon="📥" label="Request" color="#E3F2FD" onPress={() => trackEvent('quick_action', { action: 'request' })} />
        <QuickAction icon="✈️" label="Travel" color="#FFF3E0" onPress={() => trackEvent('quick_action', { action: 'travel' })} />
        <QuickAction icon="🍽️" label="Food" color="#FCE4EC" onPress={() => trackEvent('quick_action', { action: 'food' })} />
      </View>

      {/* Inline Promo Slot 1 */}
      <CFSlot slotId="home-inline-1" style={styles.inlineSlot}>
        <LinearGradient colors={['#F0EBFF', '#E9E3FF']} style={styles.inlinePlaceholder}>
          <Text style={styles.inlineIcon}>✨</Text>
          <View style={styles.inlineContent}>
            <Text style={styles.inlineTitle}>Dynamic content slot</Text>
            <Text style={styles.inlineSubtitle}>Configure in ContentFlow dashboard</Text>
          </View>
          <View style={styles.inlineArrow}>
            <Text style={styles.inlineArrowText}>→</Text>
          </View>
        </LinearGradient>
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
        <LinearGradient colors={['#FFF7ED', '#FFEDD5']} style={styles.promoPlaceholder}>
          <Text style={styles.promoIcon}>🎁</Text>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Special Offer</Text>
            <Text style={styles.promoSubtitle}>Get 5% cashback on your next purchase</Text>
          </View>
          <View style={styles.promoCta}>
            <Text style={styles.promoCtaText}>Claim</Text>
          </View>
        </LinearGradient>
      </CFSlot>

      {/* Countdown Deal Slot */}
      <CFSlot slotId="home-countdown" style={styles.countdownSlot}>
        <LinearGradient colors={['#7C3AED', '#EC4899']} style={styles.countdownPlaceholder}>
          <View style={styles.countdownContent}>
            <Text style={styles.countdownIcon}>⏰</Text>
            <View style={styles.countdownText}>
              <Text style={styles.countdownTitle}>Flash Sale</Text>
              <Text style={styles.countdownSubtitle}>Ends in:</Text>
            </View>
          </View>
          <View style={styles.timerContainer}>
            <TimerBlock value="02" label="HRS" />
            <Text style={styles.timerSep}>:</Text>
            <TimerBlock value="45" label="MIN" />
            <Text style={styles.timerSep}>:</Text>
            <TimerBlock value="30" label="SEC" />
          </View>
        </LinearGradient>
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

      {/* Inline Promo Slot 2 */}
      <CFSlot slotId="home-inline-2" style={styles.inlineSlot}>
        <LinearGradient colors={['#DBEAFE', '#BFDBFE']} style={styles.inlinePlaceholder}>
          <Text style={styles.inlineIcon}>🎯</Text>
          <View style={styles.inlineContent}>
            <Text style={[styles.inlineTitle, { color: '#1E40AF' }]}>Personalized for you</Text>
            <Text style={[styles.inlineSubtitle, { color: '#3B82F6' }]}>Based on your spending habits</Text>
          </View>
          <View style={[styles.inlineArrow, { backgroundColor: '#3B82F6' }]}>
            <Text style={styles.inlineArrowText}>→</Text>
          </View>
        </LinearGradient>
      </CFSlot>

      {/* Featured Cards Slot */}
      <CFSlot slotId="home-featured" style={styles.featuredSlot}>
        <LinearGradient colors={['#EEF2FF', '#E0E7FF']} style={styles.featuredPlaceholder}>
          <Text style={styles.featuredIcon}>💳</Text>
          <Text style={styles.featuredTitle}>Featured Cards</Text>
          <Text style={styles.featuredSubtitle}>Discover premium card offers</Text>
          <View style={styles.featuredCta}>
            <Text style={styles.featuredCtaText}>View Cards</Text>
          </View>
        </LinearGradient>
      </CFSlot>

      {/* Services Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitlePadded}>Services</Text>
        <View style={styles.servicesGrid}>
          <ServiceItem icon="📱" label="Mobile Top-up" />
          <ServiceItem icon="💡" label="Pay Bills" />
          <ServiceItem icon="🎫" label="Events" />
          <ServiceItem icon="🏥" label="Insurance" />
          <ServiceItem icon="🎓" label="Education" />
          <ServiceItem icon="🏠" label="Rent" />
        </View>
      </View>

      {/* Services Promo Slot */}
      <CFSlot slotId="home-services-promo" style={styles.servicesPromoSlot}>
        <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={styles.servicesPromoPlaceholder}>
          <View style={styles.servicesPromoLeft}>
            <Text style={styles.servicesPromoIcon}>🏦</Text>
            <View>
              <Text style={styles.servicesPromoTitle}>Bill Pay Rewards</Text>
              <Text style={styles.servicesPromoSubtitle}>Earn points on every bill</Text>
            </View>
          </View>
          <View style={styles.servicesPromoCta}>
            <Text style={styles.servicesPromoCtaText}>Start</Text>
          </View>
        </LinearGradient>
      </CFSlot>

      {/* Carousel Slot */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
      </View>
      <CFSlot slotId="home-carousel" style={styles.carouselSlot}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselScroll}>
          <CarouselCard title="Save More" subtitle="High-yield savings" colors={['#F0F9FF', '#E0F2FE']} emoji="💰" />
          <CarouselCard title="Invest" subtitle="Start with SAR 100" colors={['#FEF3C7', '#FDE68A']} emoji="📈" />
          <CarouselCard title="Insurance" subtitle="Protect what matters" colors={['#FCE7F3', '#FBCFE8']} emoji="🛡️" />
          <CarouselCard title="Goals" subtitle="Track your progress" colors={['#F0FDF4', '#DCFCE7']} emoji="🎯" />
        </ScrollView>
      </CFSlot>

      {/* Fullwidth Banner Slot */}
      <CFSlot slotId="home-fullwidth" style={styles.fullwidthSlot}>
        <LinearGradient colors={['#1E293B', '#334155']} style={styles.fullwidthPlaceholder}>
          <View style={styles.fullwidthBadge}>
            <Text style={styles.fullwidthBadgeText}>EXCLUSIVE</Text>
          </View>
          <Text style={styles.fullwidthTitle}>Premium Membership</Text>
          <Text style={styles.fullwidthSubtitle}>Unlock exclusive benefits and rewards</Text>
          <View style={styles.fullwidthCta}>
            <Text style={styles.fullwidthCtaText}>Upgrade Now</Text>
          </View>
        </LinearGradient>
      </CFSlot>

      {/* Bottom Banner Slot */}
      <CFSlot slotId="home-bottom" style={styles.bottomSlot}>
        <LinearGradient colors={['#F5F5F5', '#E5E5E5']} style={styles.bottomPlaceholder}>
          <Text style={styles.bottomIcon}>📢</Text>
          <Text style={styles.bottomText}>Announcements appear here</Text>
        </LinearGradient>
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

function StoryItem({ label, emoji, hasNew }: { label: string; emoji: string; hasNew?: boolean }) {
  return (
    <TouchableOpacity style={styles.storyItem}>
      <LinearGradient
        colors={hasNew ? ['#E11D48', '#EC4899', '#F59E0B'] : ['#E5E5E5', '#D4D4D4']}
        style={styles.storyRing}
      >
        <View style={styles.storyInner}>
          <Text style={styles.storyEmoji}>{emoji}</Text>
        </View>
      </LinearGradient>
      <Text style={styles.storyLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function TimerBlock({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.timerBlock}>
      <Text style={styles.timerValue}>{value}</Text>
      <Text style={styles.timerLabel}>{label}</Text>
    </View>
  );
}

function CarouselCard({ title, subtitle, colors, emoji }: { title: string; subtitle: string; colors: readonly [string, string]; emoji: string }) {
  return (
    <TouchableOpacity style={styles.carouselCard}>
      <LinearGradient colors={colors as any} style={styles.carouselCardBg}>
        <Text style={styles.carouselEmoji}>{emoji}</Text>
        <Text style={styles.carouselTitle}>{title}</Text>
        <Text style={styles.carouselSubtitle}>{subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
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

  // Stories
  storiesSlot: { height: 100, marginBottom: 16 },
  storiesScroll: { paddingHorizontal: 12 },
  storyItem: { alignItems: 'center', marginHorizontal: 8, width: 68 },
  storyRing: { width: 68, height: 68, borderRadius: 34, padding: 3, justifyContent: 'center', alignItems: 'center' },
  storyInner: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  storyEmoji: { fontSize: 26 },
  storyLabel: { fontSize: 11, color: '#444', marginTop: 6, textAlign: 'center' },

  heroSlot: { marginHorizontal: 20, height: 180, borderRadius: 20, overflow: 'hidden', marginBottom: 24 },
  heroPlaceholder: { flex: 1, padding: 24, justifyContent: 'flex-end' },
  heroBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 8 },
  heroBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  heroTitle: { fontSize: 24, fontWeight: '700', color: '#fff' },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 6 },
  heroCta: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, alignSelf: 'flex-start', marginTop: 16 },
  heroCtaText: { color: '#571FE4', fontWeight: '600', fontSize: 14 },

  quickActions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 24 },
  quickAction: { alignItems: 'center' },
  quickActionIcon: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickActionEmoji: { fontSize: 26 },
  quickActionLabel: { fontSize: 13, color: '#444', fontWeight: '500' },

  inlineSlot: { marginHorizontal: 20, height: 72, borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  inlinePlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  inlineIcon: { fontSize: 28, marginRight: 14 },
  inlineContent: { flex: 1 },
  inlineTitle: { fontSize: 15, fontWeight: '600', color: '#571FE4' },
  inlineSubtitle: { fontSize: 12, color: '#8B7CC7', marginTop: 2 },
  inlineArrow: { width: 36, height: 36, backgroundColor: '#571FE4', borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  inlineArrowText: { color: '#fff', fontSize: 18, fontWeight: '600' },

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

  promoSlot: { marginHorizontal: 20, height: 80, borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  promoPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  promoIcon: { fontSize: 32, marginRight: 14 },
  promoContent: { flex: 1 },
  promoTitle: { fontSize: 16, fontWeight: '600', color: '#C2410C' },
  promoSubtitle: { fontSize: 13, color: '#EA580C', marginTop: 2 },
  promoCta: { backgroundColor: '#F59E0B', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  promoCtaText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  // Countdown
  countdownSlot: { marginHorizontal: 20, height: 80, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  countdownPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  countdownContent: { flexDirection: 'row', alignItems: 'center' },
  countdownIcon: { fontSize: 28, marginRight: 12 },
  countdownText: {},
  countdownTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  countdownSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  timerContainer: { flexDirection: 'row', alignItems: 'center' },
  timerBlock: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, minWidth: 42 },
  timerValue: { fontSize: 18, fontWeight: '700', color: '#fff' },
  timerLabel: { fontSize: 9, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  timerSep: { fontSize: 18, fontWeight: '700', color: '#fff', marginHorizontal: 4 },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },
  sectionTitlePadded: { fontSize: 18, fontWeight: '600', color: '#1a1a1a', paddingHorizontal: 20, marginBottom: 12 },

  transactionList: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16, overflow: 'hidden' },
  transactionItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  transactionIcon: { width: 44, height: 44, backgroundColor: '#F5F5F5', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  transactionInfo: { flex: 1 },
  transactionName: { fontSize: 15, fontWeight: '500', color: '#1a1a1a' },
  transactionCategory: { fontSize: 12, color: '#888', marginTop: 2 },
  transactionAmount: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  amountPositive: { color: '#22c55e' },

  featuredSlot: { marginHorizontal: 20, height: 140, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  featuredPlaceholder: { flex: 1, padding: 20, justifyContent: 'center' },
  featuredIcon: { fontSize: 32, marginBottom: 8 },
  featuredTitle: { fontSize: 18, fontWeight: '700', color: '#4338CA' },
  featuredSubtitle: { fontSize: 14, color: '#6366F1', marginTop: 4 },
  featuredCta: { backgroundColor: '#4338CA', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, alignSelf: 'flex-start', marginTop: 12 },
  featuredCtaText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  serviceItem: { width: (width - 48) / 3, alignItems: 'center', paddingVertical: 16 },
  serviceIcon: { width: 56, height: 56, backgroundColor: '#fff', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8 },
  serviceLabel: { fontSize: 12, color: '#444', textAlign: 'center' },

  // Services promo
  servicesPromoSlot: { marginHorizontal: 20, height: 72, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  servicesPromoPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  servicesPromoLeft: { flexDirection: 'row', alignItems: 'center' },
  servicesPromoIcon: { fontSize: 28, marginRight: 14 },
  servicesPromoTitle: { fontSize: 15, fontWeight: '600', color: '#166534' },
  servicesPromoSubtitle: { fontSize: 12, color: '#22C55E', marginTop: 2 },
  servicesPromoCta: { backgroundColor: '#22C55E', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  servicesPromoCtaText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  // Carousel
  carouselSlot: { height: 140, marginBottom: 24 },
  carouselScroll: { paddingHorizontal: 14 },
  carouselCard: { marginHorizontal: 6, borderRadius: 16, overflow: 'hidden' },
  carouselCardBg: { width: 140, height: 140, padding: 16, justifyContent: 'flex-end' },
  carouselEmoji: { fontSize: 36, marginBottom: 8 },
  carouselTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  carouselSubtitle: { fontSize: 12, color: '#666', marginTop: 2 },

  // Fullwidth
  fullwidthSlot: { marginHorizontal: 20, height: 180, borderRadius: 20, overflow: 'hidden', marginBottom: 24 },
  fullwidthPlaceholder: { flex: 1, padding: 24, justifyContent: 'flex-end' },
  fullwidthBadge: { backgroundColor: '#EF4444', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 8 },
  fullwidthBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  fullwidthTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  fullwidthSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 6 },
  fullwidthCta: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, alignSelf: 'flex-start', marginTop: 16 },
  fullwidthCtaText: { color: '#1a1a1a', fontWeight: '600', fontSize: 14 },

  bottomSlot: { marginHorizontal: 20, height: 80, borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  bottomPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  bottomIcon: { fontSize: 24, marginRight: 12 },
  bottomText: { fontSize: 15, color: '#888' },

  statusBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: 12, color: '#888' },
});
