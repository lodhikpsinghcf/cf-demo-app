import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { useState } from 'react';
import { CFSlot } from '../../components/CFSlot';
import { useContentFlow } from '../../providers/ContentFlowProvider';

const { width } = Dimensions.get('window');

export default function TravelScreen() {
  const { trackEvent } = useContentFlow();
  const [from, setFrom] = useState('Riyadh (RUH)');
  const [to, setTo] = useState('Dubai (DXB)');
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');

  const handleSearch = () => {
    trackEvent('flight_search', { from, to, tripType, screen: 'travel' });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
          <Text style={styles.searchBtnText}>Search Flights</Text>
        </TouchableOpacity>
      </View>

      {/* Travel Deals Slot - BELOW the search */}
      <CFSlot slotId="travel-hero" style={styles.dealsSlot}>
        <View style={styles.dealsPlaceholder}>
          <Text style={styles.dealsIcon}>✈️</Text>
          <View style={styles.dealsContent}>
            <Text style={styles.dealsTitle}>Exclusive Flight Deals</Text>
            <Text style={styles.dealsSubtitle}>Save up to 40% on selected routes</Text>
          </View>
        </View>
      </CFSlot>

      {/* Popular Destinations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          <TouchableOpacity><Text style={styles.viewAll}>See all</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.destinationsScroll}>
          <DestinationCard city="Dubai" country="UAE" price="SAR 499" image="🏙️" />
          <DestinationCard city="Cairo" country="Egypt" price="SAR 599" image="🏛️" />
          <DestinationCard city="Istanbul" country="Turkey" price="SAR 799" image="🕌" />
          <DestinationCard city="London" country="UK" price="SAR 1,499" image="🎡" />
        </ScrollView>
      </View>

      {/* Destination Promo Slot */}
      <CFSlot slotId="travel-promo" style={styles.promoSlot}>
        <View style={styles.promoPlaceholder}>
          <Text style={styles.promoIcon}>🎫</Text>
          <Text style={styles.promoTitle}>Weekend Getaway Special</Text>
          <Text style={styles.promoSubtitle}>Book by Friday for extra discounts</Text>
        </View>
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

      {/* Hotels Slot */}
      <CFSlot slotId="travel-hotels" style={styles.hotelsSlot}>
        <View style={styles.hotelsPlaceholder}>
          <Text style={styles.hotelsIcon}>🏨</Text>
          <View style={styles.hotelsContent}>
            <Text style={styles.hotelsTitle}>Hotel Recommendations</Text>
            <Text style={styles.hotelsSubtitle}>Best rates for your destination</Text>
          </View>
          <View style={styles.hotelsArrow}><Text style={styles.arrowText}>→</Text></View>
        </View>
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

      {/* Bottom Slot */}
      <CFSlot slotId="travel-bottom" style={styles.bottomSlot}>
        <View style={styles.bottomPlaceholder}>
          <Text style={styles.bottomIcon}>🌍</Text>
          <Text style={styles.bottomText}>Travel tips & guides</Text>
        </View>
      </CFSlot>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function DestinationCard({ city, country, price, image }: { city: string; country: string; price: string; image: string }) {
  return (
    <TouchableOpacity style={styles.destCard}>
      <View style={styles.destImage}>
        <Text style={styles.destEmoji}>{image}</Text>
      </View>
      <View style={styles.destInfo}>
        <Text style={styles.destCity}>{city}</Text>
        <Text style={styles.destCountry}>{country}</Text>
        <Text style={styles.destPrice}>from {price}</Text>
      </View>
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
  historyBtn: { width: 44, height: 44, backgroundColor: '#fff', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
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

  searchBtn: { backgroundColor: '#571FE4', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  searchBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  dealsSlot: { marginHorizontal: 20, height: 80, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  dealsPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#DBEAFE', paddingHorizontal: 16 },
  dealsIcon: { fontSize: 32, marginRight: 14 },
  dealsContent: { flex: 1 },
  dealsTitle: { fontSize: 15, fontWeight: '600', color: '#1E40AF' },
  dealsSubtitle: { fontSize: 12, color: '#3B82F6', marginTop: 2 },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },
  sectionTitlePadded: { fontSize: 18, fontWeight: '600', color: '#1a1a1a', paddingHorizontal: 20, marginBottom: 14 },
  viewAll: { fontSize: 14, color: '#571FE4', fontWeight: '500' },

  destinationsScroll: { paddingLeft: 20, paddingRight: 8 },
  destCard: { width: 160, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginRight: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8 },
  destImage: { height: 100, backgroundColor: '#F0F9FF', justifyContent: 'center', alignItems: 'center' },
  destEmoji: { fontSize: 48 },
  destInfo: { padding: 14 },
  destCity: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  destCountry: { fontSize: 12, color: '#888', marginTop: 2 },
  destPrice: { fontSize: 14, fontWeight: '600', color: '#571FE4', marginTop: 8 },

  promoSlot: { marginHorizontal: 20, height: 100, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  promoPlaceholder: { flex: 1, backgroundColor: '#FEF3C7', padding: 20, justifyContent: 'center' },
  promoIcon: { fontSize: 24, marginBottom: 4 },
  promoTitle: { fontSize: 15, fontWeight: '600', color: '#92400E' },
  promoSubtitle: { fontSize: 12, color: '#B45309', marginTop: 2 },

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

  hotelsSlot: { marginHorizontal: 20, height: 72, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  hotelsPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 16 },
  hotelsIcon: { fontSize: 28, marginRight: 12 },
  hotelsContent: { flex: 1 },
  hotelsTitle: { fontSize: 15, fontWeight: '600', color: '#166534' },
  hotelsSubtitle: { fontSize: 12, color: '#22C55E', marginTop: 2 },
  hotelsArrow: { width: 32, height: 32, backgroundColor: '#22C55E', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  arrowText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  serviceItem: { width: (width - 48) / 3, alignItems: 'center', paddingVertical: 16 },
  serviceIcon: { width: 56, height: 56, backgroundColor: '#fff', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8 },
  serviceLabel: { fontSize: 12, color: '#444', textAlign: 'center' },

  bottomSlot: { marginHorizontal: 20, height: 70, borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  bottomPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5' },
  bottomIcon: { fontSize: 20, marginRight: 10 },
  bottomText: { fontSize: 14, color: '#888' },
});
