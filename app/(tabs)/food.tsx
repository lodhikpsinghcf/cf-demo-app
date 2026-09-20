import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { CFSlot } from '../../components/CFSlot';
import { useContentFlow } from '../../providers/ContentFlowProvider';

export default function FoodScreen() {
  const { trackEvent } = useContentFlow();
  const [search, setSearch] = useState('');

  const handleRestaurantTap = (name: string) => {
    trackEvent('restaurant_tap', { restaurant: name, screen: 'food' });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants, cuisines..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#888"
        />
      </View>

      {/* Food Hero Slot */}
      <CFSlot slotId="food-hero" style={styles.heroSlot}>
        <View style={styles.heroPlaceholder}>
          <Text style={styles.heroEmoji}>🍔</Text>
          <Text style={styles.heroText}>Food promotions appear here</Text>
        </View>
      </CFSlot>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        <CategoryPill emoji="🍕" label="Pizza" active />
        <CategoryPill emoji="🍔" label="Burgers" />
        <CategoryPill emoji="🍣" label="Sushi" />
        <CategoryPill emoji="🌮" label="Mexican" />
        <CategoryPill emoji="🍜" label="Asian" />
        <CategoryPill emoji="🥗" label="Healthy" />
        <CategoryPill emoji="☕" label="Coffee" />
      </ScrollView>

      {/* Featured Restaurants */}
      <Text style={styles.sectionTitle}>Featured Restaurants</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
        <FeaturedRestaurant
          name="Burger Palace"
          cuisine="American"
          rating={4.8}
          time="20-30 min"
          emoji="🍔"
          onTap={() => handleRestaurantTap('Burger Palace')}
        />
        <FeaturedRestaurant
          name="Sushi Master"
          cuisine="Japanese"
          rating={4.9}
          time="25-35 min"
          emoji="🍣"
          onTap={() => handleRestaurantTap('Sushi Master')}
        />
        <FeaturedRestaurant
          name="Pizza Roma"
          cuisine="Italian"
          rating={4.7}
          time="30-40 min"
          emoji="🍕"
          onTap={() => handleRestaurantTap('Pizza Roma')}
        />
      </ScrollView>

      {/* Food Promo Slot */}
      <CFSlot slotId="food-promo" style={styles.promoSlot}>
        <View style={styles.promoPlaceholder}>
          <Text style={styles.promoText}>🎁 Special offers & discounts</Text>
        </View>
      </CFSlot>

      {/* Nearby Restaurants */}
      <Text style={styles.sectionTitle}>Nearby You</Text>
      <View style={styles.restaurantList}>
        <RestaurantRow
          name="Al Baik"
          cuisine="Fast Food • Chicken"
          rating={4.6}
          time="15-20 min"
          price="$"
          emoji="🍗"
          onTap={() => handleRestaurantTap('Al Baik')}
        />
        <RestaurantRow
          name="Shawarma House"
          cuisine="Middle Eastern"
          rating={4.5}
          time="20-25 min"
          price="$$"
          emoji="🥙"
          onTap={() => handleRestaurantTap('Shawarma House')}
        />
        <RestaurantRow
          name="Kudu Coffee"
          cuisine="Cafe • Breakfast"
          rating={4.4}
          time="10-15 min"
          price="$$"
          emoji="☕"
          onTap={() => handleRestaurantTap('Kudu Coffee')}
        />
        <RestaurantRow
          name="Nando's"
          cuisine="Portuguese • Chicken"
          rating={4.3}
          time="25-30 min"
          price="$$"
          emoji="🔥"
          onTap={() => handleRestaurantTap("Nando's")}
        />
      </View>

      {/* Active Order */}
      <Text style={styles.sectionTitle}>Active Order</Text>
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderRestaurant}>Burger Palace</Text>
            <Text style={styles.orderItems}>2x Cheeseburger, 1x Fries</Text>
          </View>
          <View style={styles.orderStatus}>
            <Text style={styles.orderStatusText}>Preparing</Text>
          </View>
        </View>
        <View style={styles.orderProgress}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '40%' }]} />
          </View>
          <Text style={styles.orderEta}>Arrives in ~15 min</Text>
        </View>
        <TouchableOpacity style={styles.trackBtn}>
          <Text style={styles.trackBtnText}>Track Order</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Slot */}
      <CFSlot slotId="food-bottom" style={styles.bottomSlot} />
    </ScrollView>
  );
}

function CategoryPill({ emoji, label, active }: { emoji: string; label: string; active?: boolean }) {
  return (
    <TouchableOpacity style={[styles.categoryPill, active && styles.categoryPillActive]}>
      <Text style={styles.categoryEmoji}>{emoji}</Text>
      <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function FeaturedRestaurant({ name, cuisine, rating, time, emoji, onTap }: {
  name: string; cuisine: string; rating: number; time: string; emoji: string; onTap: () => void;
}) {
  return (
    <TouchableOpacity style={styles.featuredCard} onPress={onTap}>
      <View style={styles.featuredImage}>
        <Text style={styles.featuredEmoji}>{emoji}</Text>
      </View>
      <View style={styles.featuredInfo}>
        <Text style={styles.featuredName}>{name}</Text>
        <Text style={styles.featuredCuisine}>{cuisine}</Text>
        <View style={styles.featuredMeta}>
          <Text style={styles.featuredRating}>⭐ {rating}</Text>
          <Text style={styles.featuredTime}>{time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function RestaurantRow({ name, cuisine, rating, time, price, emoji, onTap }: {
  name: string; cuisine: string; rating: number; time: string; price: string; emoji: string; onTap: () => void;
}) {
  return (
    <TouchableOpacity style={styles.restaurantRow} onPress={onTap}>
      <View style={styles.restaurantEmoji}>
        <Text style={{ fontSize: 28 }}>{emoji}</Text>
      </View>
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{name}</Text>
        <Text style={styles.restaurantCuisine}>{cuisine}</Text>
        <View style={styles.restaurantMeta}>
          <Text style={styles.restaurantRating}>⭐ {rating}</Text>
          <Text style={styles.restaurantTime}>{time}</Text>
          <Text style={styles.restaurantPrice}>{price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  heroSlot: { height: 120, marginHorizontal: 16, marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
  heroPlaceholder: {
    flex: 1,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f87171',
    borderStyle: 'dashed',
  },
  heroEmoji: { fontSize: 40, marginBottom: 8 },
  heroText: { color: '#b91c1c', fontSize: 14 },
  categoriesScroll: { paddingLeft: 16, marginBottom: 24 },
  categoryPill: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoryPillActive: { backgroundColor: '#571FE4', borderColor: '#571FE4' },
  categoryEmoji: { fontSize: 16, marginRight: 6 },
  categoryLabel: { fontSize: 14, color: '#333', fontWeight: '500' },
  categoryLabelActive: { color: '#fff' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginHorizontal: 16, marginBottom: 12, color: '#333' },
  featuredScroll: { paddingLeft: 16, marginBottom: 24 },
  featuredCard: {
    backgroundColor: '#fff',
    width: 200,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredImage: {
    height: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredEmoji: { fontSize: 48 },
  featuredInfo: { padding: 12 },
  featuredName: { fontSize: 16, fontWeight: '600', color: '#333' },
  featuredCuisine: { fontSize: 12, color: '#888', marginTop: 2 },
  featuredMeta: { flexDirection: 'row', marginTop: 8, gap: 12 },
  featuredRating: { fontSize: 12, color: '#333' },
  featuredTime: { fontSize: 12, color: '#888' },
  promoSlot: { height: 70, marginHorizontal: 16, marginBottom: 24, borderRadius: 12, overflow: 'hidden' },
  promoPlaceholder: {
    flex: 1,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#22c55e',
    borderStyle: 'dashed',
  },
  promoText: { color: '#166534', fontSize: 14 },
  restaurantList: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, marginBottom: 24 },
  restaurantRow: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  restaurantEmoji: {
    width: 56,
    height: 56,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  restaurantInfo: { flex: 1 },
  restaurantName: { fontSize: 16, fontWeight: '600', color: '#333' },
  restaurantCuisine: { fontSize: 12, color: '#888', marginTop: 2 },
  restaurantMeta: { flexDirection: 'row', marginTop: 6, gap: 12 },
  restaurantRating: { fontSize: 12, color: '#333' },
  restaurantTime: { fontSize: 12, color: '#888' },
  restaurantPrice: { fontSize: 12, color: '#22c55e', fontWeight: '500' },
  orderCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderRestaurant: { fontSize: 16, fontWeight: '600', color: '#333' },
  orderItems: { fontSize: 13, color: '#888', marginTop: 4 },
  orderStatus: { backgroundColor: '#fef3c7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  orderStatusText: { color: '#92400e', fontSize: 12, fontWeight: '600' },
  orderProgress: { marginTop: 16 },
  progressBar: { height: 6, backgroundColor: '#f0f0f0', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#571FE4', borderRadius: 3 },
  orderEta: { fontSize: 12, color: '#888', marginTop: 8, textAlign: 'center' },
  trackBtn: { backgroundColor: '#571FE4', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  trackBtnText: { color: '#fff', fontWeight: '600' },
  bottomSlot: { height: 80, margin: 16 },
});
