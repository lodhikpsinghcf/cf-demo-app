import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useContentFlow } from '../../providers/ContentFlowProvider';
import { CFSlot } from '../../components/CFSlot';

export default function HomeScreen() {
  const { isReady, deviceId, consent } = useContentFlow();

  return (
    <ScrollView style={styles.container}>
      {/* Hero Banner Slot */}
      <CFSlot slotId="home-hero" style={styles.heroBanner}>
        <View style={styles.heroPlaceholder}>
          <Text style={styles.heroTitle}>Welcome to CF Demo</Text>
          <Text style={styles.heroSubtitle}>Wallet • Travel • Food</Text>
        </View>
      </CFSlot>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>SDK Status</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Ready:</Text>
          <Text style={[styles.statusValue, { color: isReady ? '#22c55e' : '#ef4444' }]}>
            {isReady ? 'Yes' : 'No'}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Device ID:</Text>
          <Text style={styles.statusValue} numberOfLines={1}>
            {deviceId?.slice(0, 20)}...
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Consent:</Text>
          <Text style={[styles.statusValue, { color: consent ? '#22c55e' : '#f59e0b' }]}>
            {consent ? 'Granted' : 'Pending'}
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <QuickAction icon="💳" title="Pay" subtitle="Send money" />
        <QuickAction icon="✈️" title="Book" subtitle="Flights" />
        <QuickAction icon="🍔" title="Order" subtitle="Food" />
        <QuickAction icon="🎁" title="Rewards" subtitle="Points" />
      </View>

      {/* Promo Slot */}
      <CFSlot slotId="home-promo" style={styles.promoSlot}>
        <View style={styles.promoPlaceholder}>
          <Text style={styles.promoText}>📢 Promo content loads here</Text>
        </View>
      </CFSlot>

      {/* Recent Activity */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activityList}>
        <ActivityItem icon="🛒" title="Coffee Shop" amount="-$4.50" time="Today" />
        <ActivityItem icon="✈️" title="Flight Booking" amount="-$299.00" time="Yesterday" />
        <ActivityItem icon="💰" title="Cashback Reward" amount="+$12.00" time="2 days ago" />
      </View>

      {/* Bottom Slot */}
      <CFSlot slotId="home-bottom" style={styles.bottomSlot} />
    </ScrollView>
  );
}

function QuickAction({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <TouchableOpacity style={styles.quickAction}>
      <Text style={styles.quickActionIcon}>{icon}</Text>
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

function ActivityItem({ icon, title, amount, time }: { icon: string; title: string; amount: string; time: string }) {
  const isPositive = amount.startsWith('+');
  return (
    <View style={styles.activityItem}>
      <Text style={styles.activityIcon}>{icon}</Text>
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
      <Text style={[styles.activityAmount, { color: isPositive ? '#22c55e' : '#333' }]}>
        {amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  heroBanner: { height: 180, margin: 16, borderRadius: 16, overflow: 'hidden' },
  heroPlaceholder: {
    flex: 1,
    backgroundColor: '#571FE4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '700' },
  heroSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 16, marginTop: 8 },
  statusCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#333' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statusLabel: { color: '#666', fontSize: 14 },
  statusValue: { fontSize: 14, fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginHorizontal: 16, marginTop: 8, marginBottom: 12, color: '#333' },
  quickActions: { flexDirection: 'row', paddingHorizontal: 8, marginBottom: 16 },
  quickAction: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: { fontSize: 28, marginBottom: 8 },
  quickActionTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  quickActionSubtitle: { fontSize: 12, color: '#888', marginTop: 2 },
  promoSlot: { height: 100, marginHorizontal: 16, marginBottom: 16, borderRadius: 12, overflow: 'hidden' },
  promoPlaceholder: {
    flex: 1,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
    borderStyle: 'dashed',
  },
  promoText: { color: '#92400e', fontSize: 14 },
  activityList: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: { fontSize: 24, marginRight: 12 },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: 15, fontWeight: '500', color: '#333' },
  activityTime: { fontSize: 12, color: '#888', marginTop: 2 },
  activityAmount: { fontSize: 15, fontWeight: '600' },
  bottomSlot: { height: 80, margin: 16 },
});
