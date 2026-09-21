import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { CFSlot } from '../../components/CFSlot';
import { useContentFlow } from '../../providers/ContentFlowProvider';

const { width } = Dimensions.get('window');

export default function TravelScreen() {
  const { engagement, commerce, sync } = useContentFlow();
  const [from, setFrom] = useState('Riyadh (RUH)');
  const [to, setTo] = useState('Dubai (DXB)');
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await sync();
    setRefreshing(false);
  }, [sync]);

  const handleSearch = () => {
    engagement({
      action: 'search',
      query: `${from}-${to}`,
      screen: 'travel',
      custom: { from, to, tripType },
    });
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
        <Text style={styles.headerTitle}>Travel</Text>
        <TouchableOpacity style={styles.historyBtn}>
          <Text style={styles.historyIcon}>📜</Text>
        </TouchableOpacity>
      </View>

      {/* Search Card */}
      <View style={styles.searchCard}>
        <View style={styles.tripTypeRow}>
          <TouchableOpacity
            style={[styles.tripTypeBtn, tripType === 'roundtrip' && styles.tripTypeBtnActive]}
            onPress={() => setTripType('roundtrip')}
          >
            <Text style={[styles.tripTypeText, tripType === 'roundtrip' && styles.tripTypeTextActive]}>Round Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tripTypeBtn, tripType === 'oneway' && styles.tripTypeBtnActive]}
            onPress={() => setTripType('oneway')}
          >
            <Text style={[styles.tripTypeText, tripType === 'oneway' && styles.tripTypeTextActive]}>One Way</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.routeInput}>
            <Text style={styles.routeLabel}>From</Text>
            <TextInput style={styles.routeValue} value={from} onChangeText={setFrom} />
          </View>
          <TouchableOpacity style={styles.swapBtn}>
            <Text style={styles.swapIcon}>⇄</Text>
          </TouchableOpacity>
          <View style={styles.routeInput}>
            <Text style={styles.routeLabel}>To</Text>
            <TextInput style={styles.routeValue} value={to} onChangeText={setTo} />
          </View>
        </View>

        <View style={styles.dateRow}>
          <TouchableOpacity style={styles.dateInput}>
            <Text style={styles.dateLabel}>Departure</Text>
            <Text style={styles.dateValue}>Sep 25, 2026</Text>
          </TouchableOpacity>
          {tripType === 'roundtrip' && (
            <TouchableOpacity style={styles.dateInput}>
              <Text style={styles.dateLabel}>Return</Text>
              <Text style={styles.dateValue}>Sep 30, 2026</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.passengersRow}>
          <TouchableOpacity style={styles.passengersBtn}>
            <Text style={styles.passengersLabel}>Passengers</Text>
            <Text style={styles.passengersValue}>1 Adult</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.classBtn}>
            <Text style={styles.passengersLabel}>Class</Text>
            <Text style={styles.passengersValue}>Economy</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <LinearGradient colors={['#571FE4', '#7C3AED']} style={styles.searchBtnGradient}>
            <Text style={styles.searchBtnText}>Search Flights</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Flash Deal Slot */}
      <CFSlot slotId="travel-flash" style={styles.flashSlot}>
        <LinearGradient colors={['#7C3AED', '#EC4899']} style={styles.flashPlaceholder}>
          <View style={styles.flashBadge}>
            <Text style={styles.flashBadgeText}>⚡ FLASH DEAL</Text>
          </View>
          <View style={styles.flashContent}>
            <Text style={styles.flashTitle}>Dubai from SAR 299</Text>
            <Text style={styles.flashSubtitle}>Book in next 2 hours</Text>
          </View>
          <View style={styles.flashCta}>
            <Text style={styles.flashCtaText}>Book</Text>
          </View>
        </LinearGradient>
      </CFSlot>

      {/* Travel Deals Slot */}
      <CFSlot slotId="travel-hero" style={styles.dealsSlot}>
        <LinearGradient colors={['#DBEAFE', '#BFDBFE']} style={styles.dealsPlaceholder}>
          <Text style={styles.dealsIcon}>✈️</Text>
          <View style={styles.dealsContent}>
            <Text style={styles.dealsTitle}>Exclusive Flight Deals</Text>
            <Text style={styles.dealsSubtitle}>Save up to 40% on selected routes</Text>
          </View>
          <View style={styles.dealsArrow}>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </LinearGradient>
      </CFSlot>

      {/* Popular Destinations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          <TouchableOpacity><Text style={styles.viewAll}>See all</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.destinationsScroll}>
          <DestinationCard city="Dubai" country="UAE" price="SAR 499" colors={['#F0F9FF', '#E0F2FE']} emoji="🏙️" />
          <DestinationCard city="Cairo" country="Egypt" price="SAR 599" colors={['#FEF3C7', '#FDE68A']} emoji="🏛️" />
          <DestinationCard city="Istanbul" country="Turkey" price="SAR 799" colors={['#FCE7F3', '#FBCFE8']} emoji="🕌" />
          <DestinationCard city="London" country="UK" price="SAR 1,499" colors={['#F0FDF4', '#DCFCE7']} emoji="🎡" />
        </ScrollView>
      </View>

      {/* Destination Spotlight Slot */}
      <CFSlot slotId="travel-spotlight" style={styles.spotlightSlot}>
        <View style={styles.spotlightPlaceholder}>
          <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.spotlightImage}>
            <Text style={styles.spotlightEmoji}>🏝️</Text>
          </LinearGradient>
          <View style={styles.spotlightContent}>
            <View style={styles.spotlightBadge}>
              <Text style={styles.spotlightBadgeText}>TRENDING</Text>
            </View>
            <Text style={styles.spotlightTitle}>Maldives Getaway</Text>
            <Text style={styles.spotlightSubtitle}>All-inclusive packages from SAR 2,999</Text>
            <Text style={styles.spotlightCta}>Explore →</Text>
          </View>
        </View>
      </CFSlot>

      {/* Destination Promo Slot */}
      <CFSlot slotId="travel-promo" style={styles.promoSlot}>
        <LinearGradient colors={['#FEF3C7', '#FDE68A']} style={styles.promoPlaceholder}>
          <Text style={styles.promoIcon}>🎫</Text>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Weekend Getaway Special</Text>
            <Text style={styles.promoSubtitle}>Book by Friday for extra discounts</Text>
          </View>
          <View style={styles.promoCta}>
            <Text style={styles.promoCtaText}>View</Text>
          </View>
        </LinearGradient>
      </CFSlot>

      {/* Upcoming Trips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitlePadded}>Upcoming Trips</Text>
        <View style={styles.tripCard}>
          <View style={styles.tripHeader}>
            <View style={styles.tripRoute}>
              <Text style={styles.tripCity}>RUH</Text>
              <View style={styles.tripLine}>
                <Text style={styles.tripPlane}>✈️</Text>
              </View>
              <Text style={styles.tripCity}>DXB</Text>
            </View>
            <View style={styles.tripBadge}><Text style={styles.tripBadgeText}>Confirmed</Text></View>
          </View>
          <View style={styles.tripDetails}>
            <View style={styles.tripDetail}>
              <Text style={styles.tripDetailLabel}>Date</Text>
              <Text style={styles.tripDetailValue}>Sep 25, 2026</Text>
            </View>
            <View style={styles.tripDetail}>
              <Text style={styles.tripDetailLabel}>Flight</Text>
              <Text style={styles.tripDetailValue}>SV 502</Text>
            </View>
            <View style={styles.tripDetail}>
              <Text style={styles.tripDetailLabel}>Time</Text>
              <Text style={styles.tripDetailValue}>10:30 AM</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.boardingBtn}>
            <Text style={styles.boardingBtnText}>View Boarding Pass</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Last Minute Deals Slot */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Last Minute Deals</Text>
          <TouchableOpacity><Text style={styles.viewAll}>See all</Text></TouchableOpacity>
        </View>
      </View>
      <CFSlot slotId="travel-lastminute" style={styles.lastMinuteSlot}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lastMinuteScroll}>
          <LastMinuteCard destination="Bahrain" price="SAR 199" departure="Tomorrow" colors={['#EEF2FF', '#E0E7FF']} />
          <LastMinuteCard destination="Jeddah" price="SAR 149" departure="Tonight" colors={['#FEF3C7', '#FDE68A']} />
          <LastMinuteCard destination="Kuwait" price="SAR 249" departure="Tomorrow" colors={['#FCE7F3', '#FBCFE8']} />
        </ScrollView>
      </CFSlot>

      {/* Hotels Slot */}
      <CFSlot slotId="travel-hotels" style={styles.hotelsSlot}>
        <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={styles.hotelsPlaceholder}>
          <Text style={styles.hotelsIcon}>🏨</Text>
          <View style={styles.hotelsContent}>
            <Text style={styles.hotelsTitle}>Hotel Recommendations</Text>
            <Text style={styles.hotelsSubtitle}>Best rates for your destination</Text>
          </View>
          <View style={styles.hotelsArrow}><Text style={styles.arrowText}>→</Text></View>
        </LinearGradient>
      </CFSlot>

      {/* Travel Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitlePadded}>Travel Services</Text>
        <View style={styles.servicesGrid}>
          <ServiceItem icon="🏨" label="Hotels" />
          <ServiceItem icon="🚗" label="Car Rental" />
          <ServiceItem icon="🎡" label="Activities" />
          <ServiceItem icon="🛡️" label="Insurance" />
          <ServiceItem icon="💼" label="Business" />
          <ServiceItem icon="🎒" label="Packages" />
        </View>
      </View>

      {/* Miles Slot */}
      <CFSlot slotId="travel-miles" style={styles.milesSlot}>
        <LinearGradient colors={['#1E293B', '#334155']} style={styles.milesPlaceholder}>
          <View style={styles.milesLeft}>
            <Text style={styles.milesIcon}>🛫</Text>
            <View>
              <Text style={styles.milesLabel}>Travel Miles</Text>
              <Text style={styles.milesValue}>12,450</Text>
            </View>
          </View>
          <View style={styles.milesCta}>
            <Text style={styles.milesCtaText}>Redeem</Text>
          </View>
        </LinearGradient>
      </CFSlot>

      {/* Bottom Slot */}
      <CFSlot slotId="travel-bottom" style={styles.bottomSlot}>
        <LinearGradient colors={['#F5F5F5', '#E5E5E5']} style={styles.bottomPlaceholder}>
          <Text style={styles.bottomIcon}>🌍</Text>
          <Text style={styles.bottomText}>Travel tips & guides</Text>
        </LinearGradient>
      </CFSlot>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function DestinationCard({ city, country, price, colors, emoji }: { city: string; country: string; price: string; colors: readonly [string, string]; emoji: string }) {
  return (
    <TouchableOpacity style={styles.destCard}>
      <LinearGradient colors={colors as any} style={styles.destImage}>
        <Text style={styles.destEmoji}>{emoji}</Text>
      </LinearGradient>
      <View style={styles.destInfo}>
        <Text style={styles.destCity}>{city}</Text>
        <Text style={styles.destCountry}>{country}</Text>
        <Text style={styles.destPrice}>from {price}</Text>
      </View>
    </TouchableOpacity>
  );
}

function LastMinuteCard({ destination, price, departure, colors }: { destination: string; price: string; departure: string; colors: readonly [string, string] }) {
  return (
    <TouchableOpacity style={styles.lastMinuteCard}>
      <LinearGradient colors={colors as any} style={styles.lastMinuteGradient}>
        <View style={styles.lastMinuteBadge}>
          <Text style={styles.lastMinuteBadgeText}>{departure}</Text>
        </View>
        <Text style={styles.lastMinuteCity}>{destination}</Text>
        <Text style={styles.lastMinutePrice}>{price}</Text>
      </LinearGradient>
    </TouchableOpacity>
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
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#1a1a1a' },
  historyBtn: { width: 44, height: 44, backgroundColor: '#fff', borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  historyIcon: { fontSize: 20 },

  searchCard: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 24, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 16 },
  tripTypeRow: { flexDirection: 'row', backgroundColor: '#F5F5F5', borderRadius: 12, padding: 4, marginBottom: 20 },
  tripTypeBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tripTypeBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4 },
  tripTypeText: { fontSize: 14, fontWeight: '500', color: '#888' },
  tripTypeTextActive: { color: '#1a1a1a' },

  routeContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  routeInput: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14 },
  routeLabel: { fontSize: 11, color: '#888', marginBottom: 4 },
  routeValue: { fontSize: 16, fontWeight: '500', color: '#1a1a1a' },
  swapBtn: { width: 40, height: 40, backgroundColor: '#571FE4', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginHorizontal: 8 },
  swapIcon: { color: '#fff', fontSize: 16, fontWeight: '600' },

  dateRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  dateInput: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14 },
  dateLabel: { fontSize: 11, color: '#888', marginBottom: 4 },
  dateValue: { fontSize: 15, fontWeight: '500', color: '#1a1a1a' },

  passengersRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  passengersBtn: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14 },
  classBtn: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14 },
  passengersLabel: { fontSize: 11, color: '#888', marginBottom: 4 },
  passengersValue: { fontSize: 15, fontWeight: '500', color: '#1a1a1a' },

  searchBtn: { borderRadius: 14, overflow: 'hidden' },
  searchBtnGradient: { paddingVertical: 16, alignItems: 'center' },
  searchBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // Flash deal
  flashSlot: { marginHorizontal: 20, height: 80, borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  flashPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  flashBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginRight: 12 },
  flashBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  flashContent: { flex: 1 },
  flashTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  flashSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  flashCta: { backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  flashCtaText: { color: '#7C3AED', fontWeight: '600', fontSize: 14 },

  dealsSlot: { marginHorizontal: 20, height: 80, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  dealsPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  dealsIcon: { fontSize: 32, marginRight: 14 },
  dealsContent: { flex: 1 },
  dealsTitle: { fontSize: 15, fontWeight: '600', color: '#1E40AF' },
  dealsSubtitle: { fontSize: 12, color: '#3B82F6', marginTop: 2 },
  dealsArrow: { width: 36, height: 36, backgroundColor: '#3B82F6', borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  arrowText: { color: '#fff', fontSize: 18, fontWeight: '600' },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },
  sectionTitlePadded: { fontSize: 18, fontWeight: '600', color: '#1a1a1a', paddingHorizontal: 20, marginBottom: 14 },
  viewAll: { fontSize: 14, color: '#571FE4', fontWeight: '500' },

  destinationsScroll: { paddingLeft: 20, paddingRight: 8 },
  destCard: { width: 160, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginRight: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8 },
  destImage: { height: 100, justifyContent: 'center', alignItems: 'center' },
  destEmoji: { fontSize: 48 },
  destInfo: { padding: 14 },
  destCity: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  destCountry: { fontSize: 12, color: '#888', marginTop: 2 },
  destPrice: { fontSize: 14, fontWeight: '600', color: '#571FE4', marginTop: 8 },

  // Spotlight
  spotlightSlot: { marginHorizontal: 20, height: 140, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  spotlightPlaceholder: { flex: 1, flexDirection: 'row', backgroundColor: '#fff' },
  spotlightImage: { width: 140, justifyContent: 'center', alignItems: 'center' },
  spotlightEmoji: { fontSize: 56 },
  spotlightContent: { flex: 1, padding: 16, justifyContent: 'center' },
  spotlightBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 6 },
  spotlightBadgeText: { fontSize: 10, fontWeight: '600', color: '#92400E', letterSpacing: 0.5 },
  spotlightTitle: { fontSize: 17, fontWeight: '600', color: '#1a1a1a' },
  spotlightSubtitle: { fontSize: 13, color: '#666', marginTop: 4, lineHeight: 18 },
  spotlightCta: { fontSize: 14, fontWeight: '600', color: '#571FE4', marginTop: 8 },

  promoSlot: { marginHorizontal: 20, height: 80, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  promoPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  promoIcon: { fontSize: 28, marginRight: 14 },
  promoContent: { flex: 1 },
  promoTitle: { fontSize: 15, fontWeight: '600', color: '#92400E' },
  promoSubtitle: { fontSize: 12, color: '#B45309', marginTop: 2 },
  promoCta: { backgroundColor: '#F59E0B', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  promoCtaText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  tripCard: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 20, padding: 20 },
  tripHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  tripRoute: { flexDirection: 'row', alignItems: 'center' },
  tripCity: { fontSize: 24, fontWeight: '700', color: '#1a1a1a' },
  tripLine: { width: 60, height: 2, backgroundColor: '#E5E5E5', marginHorizontal: 12, justifyContent: 'center', alignItems: 'center' },
  tripPlane: { fontSize: 16 },
  tripBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  tripBadgeText: { fontSize: 12, fontWeight: '600', color: '#166534' },
  tripDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  tripDetail: {},
  tripDetailLabel: { fontSize: 11, color: '#888' },
  tripDetailValue: { fontSize: 15, fontWeight: '500', color: '#1a1a1a', marginTop: 4 },
  boardingBtn: { backgroundColor: '#F5F5F5', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  boardingBtnText: { color: '#571FE4', fontWeight: '600', fontSize: 14 },

  // Last minute
  lastMinuteSlot: { height: 130, marginBottom: 24 },
  lastMinuteScroll: { paddingHorizontal: 14 },
  lastMinuteCard: { marginHorizontal: 6, borderRadius: 16, overflow: 'hidden' },
  lastMinuteGradient: { width: 140, height: 130, padding: 14, justifyContent: 'space-between' },
  lastMinuteBadge: { backgroundColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start' },
  lastMinuteBadgeText: { fontSize: 10, fontWeight: '600', color: '#1a1a1a' },
  lastMinuteCity: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  lastMinutePrice: { fontSize: 16, fontWeight: '600', color: '#571FE4' },

  hotelsSlot: { marginHorizontal: 20, height: 72, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  hotelsPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  hotelsIcon: { fontSize: 28, marginRight: 12 },
  hotelsContent: { flex: 1 },
  hotelsTitle: { fontSize: 15, fontWeight: '600', color: '#166534' },
  hotelsSubtitle: { fontSize: 12, color: '#22C55E', marginTop: 2 },
  hotelsArrow: { width: 36, height: 36, backgroundColor: '#22C55E', borderRadius: 18, justifyContent: 'center', alignItems: 'center' },

  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  serviceItem: { width: (width - 48) / 3, alignItems: 'center', paddingVertical: 16 },
  serviceIcon: { width: 56, height: 56, backgroundColor: '#fff', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8 },
  serviceLabel: { fontSize: 12, color: '#444', textAlign: 'center' },

  // Miles
  milesSlot: { marginHorizontal: 20, height: 80, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  milesPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  milesLeft: { flexDirection: 'row', alignItems: 'center' },
  milesIcon: { fontSize: 32, marginRight: 14 },
  milesLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  milesValue: { fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 2 },
  milesCta: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  milesCtaText: { color: '#1E293B', fontWeight: '600', fontSize: 14 },

  bottomSlot: { marginHorizontal: 20, height: 70, borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  bottomPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  bottomIcon: { fontSize: 24, marginRight: 12 },
  bottomText: { fontSize: 15, color: '#888' },
});
