import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { CFSlot } from '../../components/CFSlot';
import { useContentFlow } from '../../providers/ContentFlowProvider';

export default function TravelScreen() {
  const { trackEvent } = useContentFlow();
  const [from, setFrom] = useState('Riyadh (RUH)');
  const [to, setTo] = useState('Dubai (DXB)');

  const handleSearch = () => {
    trackEvent('flight_search', { from, to, screen: 'travel' });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Travel Hero Slot */}
      <CFSlot slotId="travel-hero" style={styles.heroSlot}>
        <View style={styles.heroPlaceholder}>
          <Text style={styles.heroEmoji}>✈️</Text>
          <Text style={styles.heroText}>Travel deals appear here</Text>
        </View>
      </CFSlot>

      {/* Search Card */}
      <View style={styles.searchCard}>
        <Text style={styles.searchTitle}>Book a Flight</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>From</Text>
          <TextInput
            style={styles.input}
            value={from}
            onChangeText={setFrom}
            placeholder="Departure city"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>To</Text>
          <TextInput
            style={styles.input}
            value={to}
            onChangeText={setTo}
            placeholder="Destination city"
          />
        </View>

        <View style={styles.dateRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>Depart</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Text style={styles.dateText}>Sep 25, 2026</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.inputLabel}>Return</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Text style={styles.dateText}>Sep 30, 2026</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Search Flights</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Destinations */}
      <Text style={styles.sectionTitle}>Popular Destinations</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.destinationsScroll}>
        <DestinationCard city="Dubai" country="UAE" price="$199" emoji="🏙️" />
        <DestinationCard city="Cairo" country="Egypt" price="$249" emoji="🏛️" />
        <DestinationCard city="Istanbul" country="Turkey" price="$299" emoji="🕌" />
        <DestinationCard city="London" country="UK" price="$499" emoji="🎡" />
      </ScrollView>

      {/* Travel Promo Slot */}
      <CFSlot slotId="travel-promo" style={styles.promoSlot}>
        <View style={styles.promoPlaceholder}>
          <Text style={styles.promoText}>🎫 Exclusive travel offers</Text>
        </View>
      </CFSlot>

      {/* Upcoming Trips */}
      <Text style={styles.sectionTitle}>Upcoming Trips</Text>
      <View style={styles.tripCard}>
        <View style={styles.tripHeader}>
          <Text style={styles.tripRoute}>RUH → DXB</Text>
          <Text style={styles.tripStatus}>Confirmed</Text>
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
        <TouchableOpacity style={styles.tripBtn}>
          <Text style={styles.tripBtnText}>View Boarding Pass</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Slot */}
      <CFSlot slotId="travel-bottom" style={styles.bottomSlot} />
    </ScrollView>
  );
}

function DestinationCard({ city, country, price, emoji }: { city: string; country: string; price: string; emoji: string }) {
  return (
    <TouchableOpacity style={styles.destCard}>
      <Text style={styles.destEmoji}>{emoji}</Text>
      <Text style={styles.destCity}>{city}</Text>
      <Text style={styles.destCountry}>{country}</Text>
      <Text style={styles.destPrice}>from {price}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  heroSlot: { height: 150, margin: 16, borderRadius: 16, overflow: 'hidden' },
  heroPlaceholder: {
    flex: 1,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderStyle: 'dashed',
  },
  heroEmoji: { fontSize: 48, marginBottom: 8 },
  heroText: { color: '#1e40af', fontSize: 14 },
  searchCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchTitle: { fontSize: 20, fontWeight: '600', marginBottom: 20, color: '#333' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 12, color: '#666', marginBottom: 6, fontWeight: '500' },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#333',
  },
  dateRow: { flexDirection: 'row' },
  dateInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 14,
  },
  dateText: { fontSize: 16, color: '#333' },
  searchBtn: {
    backgroundColor: '#571FE4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  searchBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginHorizontal: 16, marginBottom: 12, color: '#333' },
  destinationsScroll: { paddingLeft: 16, marginBottom: 24 },
  destCard: {
    backgroundColor: '#fff',
    width: 140,
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  destEmoji: { fontSize: 36, marginBottom: 8 },
  destCity: { fontSize: 16, fontWeight: '600', color: '#333' },
  destCountry: { fontSize: 12, color: '#888', marginTop: 2 },
  destPrice: { fontSize: 14, fontWeight: '600', color: '#571FE4', marginTop: 8 },
  promoSlot: { height: 80, marginHorizontal: 16, marginBottom: 24, borderRadius: 12, overflow: 'hidden' },
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
  tripCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  tripHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  tripRoute: { fontSize: 20, fontWeight: '700', color: '#333' },
  tripStatus: { backgroundColor: '#dcfce7', color: '#166534', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: '600' },
  tripDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  tripDetail: {},
  tripDetailLabel: { fontSize: 12, color: '#888' },
  tripDetailValue: { fontSize: 14, fontWeight: '500', color: '#333', marginTop: 4 },
  tripBtn: { backgroundColor: '#f5f5f5', padding: 14, borderRadius: 12, alignItems: 'center' },
  tripBtnText: { color: '#571FE4', fontWeight: '600' },
  bottomSlot: { height: 80, margin: 16 },
});
