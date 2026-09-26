import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { CFSlot } from '../../components/CFSlot';
import { useContentFlow } from '../../providers/ContentFlowProvider';

const { width } = Dimensions.get('window');

export default function FoodScreen() {
  const { engagement, commerce, sync } = useContentFlow();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await sync();
    setRefreshing(false);
  }, [sync]);

  const handleRestaurantTap = (name: string) => {
    engagement({
      action: 'view',
      contentType: 'restaurant',
      contentId: name.toLowerCase().replace(/\s+/g, '_'),
      screen: 'food',
      custom: { restaurant: name },
    });
  };

  const handleSearch = (query: string) => {
    if (query.length > 2) {
      engagement({
        action: 'search',
        query,
        screen: 'food',
        custom: { category: selectedCategory },
      });
    }
  };

  const categories = [
    { id: 'all', icon: '🍽️', label: 'All' },
    { id: 'pizza', icon: '🍕', label: 'Pizza' },
    { id: 'burger', icon: '🍔', label: 'Burgers' },
    { id: 'sushi', icon: '🍣', label: 'Sushi' },
    { id: 'arabic', icon: '🥙', label: 'Arabic' },
    { id: 'asian', icon: '🍜', label: 'Asian' },
    { id: 'healthy', icon: '🥗', label: 'Healthy' },
  ];

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
          <Text style={styles.deliverTo}>Deliver to</Text>
          <TouchableOpacity style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.location}>King Fahd Road, Riyadh</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.cartBtn}>
          <Text style={styles.cartIcon}>🛒</Text>
          <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>2</Text></View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
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
        <TouchableOpacity style={styles.filterBtn}>
          <LinearGradient colors={['#571FE4', '#7C3AED']} style={styles.filterBtnGradient}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryPill, selectedCategory === cat.id && styles.categoryPillActive]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text style={styles.categoryEmoji}>{cat.icon}</Text>
            <Text style={[styles.categoryLabel, selectedCategory === cat.id && styles.categoryLabelActive]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Flash Deal Slot */}
      <CFSlot blockKey="food_flash" style={styles.flashSlot}>
        <LinearGradient colors={['#EF4444', '#F97316']} style={styles.flashPlaceholder}>
          <View style={styles.flashContent}>
            <View style={styles.flashBadge}>
              <Text style={styles.flashBadgeText}>⚡ FLASH</Text>
            </View>
            <Text style={styles.flashTitle}>50% Off Next Hour</Text>
            <Text style={styles.flashSubtitle}>On selected restaurants</Text>
          </View>
          <View style={styles.flashTimer}>
            <Text style={styles.flashTimerText}>59:45</Text>
          </View>
        </LinearGradient>
      </CFSlot>

      {/* Food Promo Slot - contextual, after categories */}
      <CFSlot blockKey="food_hero" style={styles.heroSlot}>
        <LinearGradient colors={['#571FE4', '#7C3AED']} style={styles.heroPlaceholder}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Free Delivery</Text>
            <Text style={styles.heroSubtitle}>On orders above SAR 50</Text>
          </View>
          <Text style={styles.heroEmoji}>🚀</Text>
        </LinearGradient>
      </CFSlot>

      {/* Featured Restaurants */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Near You</Text>
          <TouchableOpacity><Text style={styles.viewAll}>See all</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
          <FeaturedCard name="Al Baik" cuisine="Fried Chicken" rating={4.8} time="15-25" price="$" colors={['#FEF3C7', '#FDE68A']} emoji="🍗" onTap={() => handleRestaurantTap('Al Baik')} />
          <FeaturedCard name="The Butcher Shop" cuisine="Steakhouse" rating={4.7} time="30-40" price="$$$" colors={['#FCE7F3', '#FBCFE8']} emoji="🥩" onTap={() => handleRestaurantTap('The Butcher Shop')} />
          <FeaturedCard name="Pizza Hut" cuisine="Pizza" rating={4.5} time="25-35" price="$$" colors={['#FEE2E2', '#FECACA']} emoji="🍕" onTap={() => handleRestaurantTap('Pizza Hut')} />
        </ScrollView>
      </View>

      {/* Restaurant Promo Slot */}
      <CFSlot blockKey="food_promo" style={styles.promoSlot}>
        <LinearGradient colors={['#FEF2F2', '#FEE2E2']} style={styles.promoPlaceholder}>
          <Text style={styles.promoIcon}>🎁</Text>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>50% Off Your First Order</Text>
            <Text style={styles.promoSubtitle}>Use code: FIRST50</Text>
          </View>
          <View style={styles.promoCta}>
            <Text style={styles.promoCtaText}>Copy</Text>
          </View>
        </LinearGradient>
      </CFSlot>

      {/* Recommended Slot */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <TouchableOpacity><Text style={styles.viewAll}>See all</Text></TouchableOpacity>
        </View>
      </View>
      <CFSlot blockKey="food_recommended" style={styles.recommendedSlot}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendedScroll}>
          <RecommendedCard name="Shawarma Combo" restaurant="Shawarma House" price="SAR 35" colors={['#F0FDF4', '#DCFCE7']} emoji="🥙" />
          <RecommendedCard name="Chicken Meal" restaurant="Al Baik" price="SAR 25" colors={['#FEF3C7', '#FDE68A']} emoji="🍗" />
          <RecommendedCard name="Sushi Platter" restaurant="Sushi Yoshi" price="SAR 89" colors={['#FDF4FF', '#FAE8FF']} emoji="🍣" />
        </ScrollView>
      </CFSlot>

      {/* Nearby Restaurants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitlePadded}>Popular Restaurants</Text>
        <View style={styles.restaurantList}>
          <RestaurantRow name="Shawarma House" cuisine="Middle Eastern • Arabic" rating={4.6} time="20-30" price="$" emoji="🥙" onTap={() => handleRestaurantTap('Shawarma House')} />
          <RestaurantRow name="Kudu" cuisine="Fast Food • Breakfast" rating={4.4} time="10-20" price="$" emoji="☕" onTap={() => handleRestaurantTap('Kudu')} />
          <RestaurantRow name="Maestro Pizza" cuisine="Italian • Pizza" rating={4.5} time="25-35" price="$$" emoji="🍕" onTap={() => handleRestaurantTap('Maestro Pizza')} />
          <RestaurantRow name="Nando's" cuisine="Portuguese • Chicken" rating={4.3} time="30-40" price="$$" emoji="🔥" onTap={() => handleRestaurantTap("Nando's")} />
        </View>
      </View>

      {/* Cuisines Slot */}
      <CFSlot blockKey="food_cuisines" style={styles.cuisinesSlot}>
        <LinearGradient colors={['#EEF2FF', '#E0E7FF']} style={styles.cuisinesPlaceholder}>
          <Text style={styles.cuisinesIcon}>🌍</Text>
          <View style={styles.cuisinesContent}>
            <Text style={styles.cuisinesTitle}>Explore World Cuisines</Text>
            <Text style={styles.cuisinesSubtitle}>Japanese, Italian, Indian & more</Text>
          </View>
          <View style={styles.cuisinesArrow}><Text style={styles.arrowText}>→</Text></View>
        </LinearGradient>
      </CFSlot>

      {/* Cuisine Grid Slot */}
      <View style={styles.section}>
        <Text style={styles.sectionTitlePadded}>Browse by Cuisine</Text>
      </View>
      <CFSlot blockKey="food_cuisine_grid" style={styles.cuisineGridSlot}>
        <View style={styles.cuisineGrid}>
          <CuisineItem emoji="🍕" label="Italian" color="#FEE2E2" />
          <CuisineItem emoji="🍣" label="Japanese" color="#FDF4FF" />
          <CuisineItem emoji="🥘" label="Indian" color="#FEF3C7" />
          <CuisineItem emoji="🌮" label="Mexican" color="#F0FDF4" />
          <CuisineItem emoji="🍜" label="Chinese" color="#FEF2F2" />
          <CuisineItem emoji="🥙" label="Arabic" color="#EEF2FF" />
        </View>
      </CFSlot>

      {/* Active Order */}
      <View style={styles.section}>
        <Text style={styles.sectionTitlePadded}>Active Order</Text>
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderRestaurant}>Al Baik</Text>
              <Text style={styles.orderItems}>2x Chicken Meal, 1x Shrimp</Text>
            </View>
            <View style={styles.orderStatus}><Text style={styles.orderStatusText}>Preparing</Text></View>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient colors={['#571FE4', '#7C3AED']} style={[styles.progressFill, { width: '45%' }]} />
            </View>
            <View style={styles.progressSteps}>
              <View style={styles.progressStep}>
                <View style={[styles.stepDot, styles.stepDotComplete]} />
                <Text style={styles.stepLabel}>Confirmed</Text>
              </View>
              <View style={styles.progressStep}>
                <View style={[styles.stepDot, styles.stepDotActive]} />
                <Text style={styles.stepLabel}>Preparing</Text>
              </View>
              <View style={styles.progressStep}>
                <View style={styles.stepDot} />
                <Text style={styles.stepLabel}>On the way</Text>
              </View>
              <View style={styles.progressStep}>
                <View style={styles.stepDot} />
                <Text style={styles.stepLabel}>Delivered</Text>
              </View>
            </View>
          </View>
          <View style={styles.orderFooter}>
            <Text style={styles.orderEta}>Arriving in ~18 min</Text>
            <TouchableOpacity style={styles.trackBtn}>
              <LinearGradient colors={['#571FE4', '#7C3AED']} style={styles.trackBtnGradient}>
                <Text style={styles.trackBtnText}>Track Order</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Rewards Slot */}
      <CFSlot blockKey="food_rewards" style={styles.rewardsSlot}>
        <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={styles.rewardsPlaceholder}>
          <Text style={styles.rewardsIcon}>🏆</Text>
          <View style={styles.rewardsContent}>
            <Text style={styles.rewardsTitle}>Food Rewards</Text>
            <Text style={styles.rewardsSubtitle}>325 points to next free meal</Text>
          </View>
          <View style={styles.rewardsProgress}>
            <View style={styles.rewardsProgressFill} />
          </View>
        </LinearGradient>
      </CFSlot>

      {/* Bottom Slot */}
      <CFSlot blockKey="food_bottom" style={styles.bottomSlot}>
        <LinearGradient colors={['#F5F5F5', '#E5E5E5']} style={styles.bottomPlaceholder}>
          <Text style={styles.bottomIcon}>⭐</Text>
          <Text style={styles.bottomText}>Loyalty rewards & perks</Text>
        </LinearGradient>
      </CFSlot>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function FeaturedCard({ name, cuisine, rating, time, price, colors, emoji, onTap }: {
  name: string; cuisine: string; rating: number; time: string; price: string; colors: readonly [string, string]; emoji: string; onTap: () => void;
}) {
  return (
    <TouchableOpacity style={styles.featuredCard} onPress={onTap}>
      <LinearGradient colors={colors as any} style={styles.featuredImage}>
        <Text style={styles.featuredEmoji}>{emoji}</Text>
        <View style={styles.featuredRating}>
          <Text style={styles.ratingText}>⭐ {rating}</Text>
        </View>
      </LinearGradient>
      <View style={styles.featuredInfo}>
        <Text style={styles.featuredName}>{name}</Text>
        <Text style={styles.featuredCuisine}>{cuisine}</Text>
        <View style={styles.featuredMeta}>
          <Text style={styles.metaText}>{time} min</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaPrice}>{price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function RecommendedCard({ name, restaurant, price, colors, emoji }: {
  name: string; restaurant: string; price: string; colors: readonly [string, string]; emoji: string;
}) {
  return (
    <TouchableOpacity style={styles.recommendedCard}>
      <LinearGradient colors={colors as any} style={styles.recommendedImage}>
        <Text style={styles.recommendedEmoji}>{emoji}</Text>
      </LinearGradient>
      <View style={styles.recommendedInfo}>
        <Text style={styles.recommendedName}>{name}</Text>
        <Text style={styles.recommendedRestaurant}>{restaurant}</Text>
        <Text style={styles.recommendedPrice}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
}

function CuisineItem({ emoji, label, color }: { emoji: string; label: string; color: string }) {
  return (
    <TouchableOpacity style={styles.cuisineItem}>
      <View style={[styles.cuisineIcon, { backgroundColor: color }]}>
        <Text style={styles.cuisineEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.cuisineLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function RestaurantRow({ name, cuisine, rating, time, price, emoji, onTap }: {
  name: string; cuisine: string; rating: number; time: string; price: string; emoji: string; onTap: () => void;
}) {
  return (
    <TouchableOpacity style={styles.restaurantRow} onPress={onTap}>
      <View style={styles.restaurantImage}>
        <Text style={styles.restaurantEmoji}>{emoji}</Text>
      </View>
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{name}</Text>
        <Text style={styles.restaurantCuisine}>{cuisine}</Text>
        <View style={styles.restaurantMeta}>
          <Text style={styles.metaText}>⭐ {rating}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{time} min</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaPrice}>{price}</Text>
        </View>
      </View>
      <Text style={styles.restaurantArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  deliverTo: { fontSize: 12, color: '#888' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationIcon: { fontSize: 14, marginRight: 4 },
  location: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  dropdownIcon: { fontSize: 10, color: '#888', marginLeft: 6 },
  cartBtn: { width: 48, height: 48, backgroundColor: '#fff', borderRadius: 24, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  cartIcon: { fontSize: 22 },
  cartBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#EF4444', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  searchContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14, height: 50, marginRight: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8 },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#1a1a1a' },
  filterBtn: { borderRadius: 14, overflow: 'hidden' },
  filterBtnGradient: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
  filterIcon: { fontSize: 20 },

  categoriesScroll: { paddingLeft: 20, paddingRight: 8, marginBottom: 20 },
  categoryPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, marginRight: 10, borderWidth: 1, borderColor: '#E5E5E5' },
  categoryPillActive: { backgroundColor: '#571FE4', borderColor: '#571FE4' },
  categoryEmoji: { fontSize: 16, marginRight: 6 },
  categoryLabel: { fontSize: 14, fontWeight: '500', color: '#444' },
  categoryLabelActive: { color: '#fff' },

  // Flash
  flashSlot: { marginHorizontal: 20, height: 80, borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  flashPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  flashContent: {},
  flashBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 4 },
  flashBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  flashTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  flashSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  flashTimer: { backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  flashTimerText: { color: '#fff', fontSize: 20, fontWeight: '700' },

  heroSlot: { marginHorizontal: 20, height: 100, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  heroPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 },
  heroContent: {},
  heroTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  heroEmoji: { fontSize: 56 },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },
  sectionTitlePadded: { fontSize: 18, fontWeight: '600', color: '#1a1a1a', paddingHorizontal: 20, marginBottom: 14 },
  viewAll: { fontSize: 14, color: '#571FE4', fontWeight: '500' },

  featuredScroll: { paddingLeft: 20, paddingRight: 8 },
  featuredCard: { width: 200, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginRight: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8 },
  featuredImage: { height: 120, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  featuredEmoji: { fontSize: 56 },
  featuredRating: { position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingText: { fontSize: 12, fontWeight: '600', color: '#1a1a1a' },
  featuredInfo: { padding: 14 },
  featuredName: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  featuredCuisine: { fontSize: 13, color: '#888', marginTop: 2 },
  featuredMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  metaText: { fontSize: 12, color: '#666' },
  metaDot: { fontSize: 12, color: '#CCC', marginHorizontal: 6 },
  metaPrice: { fontSize: 12, fontWeight: '600', color: '#22C55E' },

  promoSlot: { marginHorizontal: 20, height: 80, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  promoPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  promoIcon: { fontSize: 32, marginRight: 14 },
  promoContent: { flex: 1 },
  promoTitle: { fontSize: 15, fontWeight: '600', color: '#B91C1C' },
  promoSubtitle: { fontSize: 13, color: '#EF4444', marginTop: 2 },
  promoCta: { backgroundColor: '#EF4444', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  promoCtaText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  // Recommended
  recommendedSlot: { height: 180, marginBottom: 24 },
  recommendedScroll: { paddingHorizontal: 14 },
  recommendedCard: { width: 150, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginHorizontal: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8 },
  recommendedImage: { height: 100, justifyContent: 'center', alignItems: 'center' },
  recommendedEmoji: { fontSize: 48 },
  recommendedInfo: { padding: 12 },
  recommendedName: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  recommendedRestaurant: { fontSize: 11, color: '#888', marginTop: 2 },
  recommendedPrice: { fontSize: 14, fontWeight: '600', color: '#571FE4', marginTop: 6 },

  restaurantList: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16, overflow: 'hidden' },
  restaurantRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  restaurantImage: { width: 60, height: 60, backgroundColor: '#F5F5F5', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  restaurantEmoji: { fontSize: 32 },
  restaurantInfo: { flex: 1 },
  restaurantName: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  restaurantCuisine: { fontSize: 13, color: '#888', marginTop: 2 },
  restaurantMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  restaurantArrow: { fontSize: 24, color: '#CCC' },

  cuisinesSlot: { marginHorizontal: 20, height: 72, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  cuisinesPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  cuisinesIcon: { fontSize: 28, marginRight: 12 },
  cuisinesContent: { flex: 1 },
  cuisinesTitle: { fontSize: 15, fontWeight: '600', color: '#4338CA' },
  cuisinesSubtitle: { fontSize: 12, color: '#6366F1', marginTop: 2 },
  cuisinesArrow: { width: 36, height: 36, backgroundColor: '#6366F1', borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  arrowText: { color: '#fff', fontSize: 18, fontWeight: '600' },

  // Cuisine grid
  cuisineGridSlot: { marginHorizontal: 20, marginBottom: 24 },
  cuisineGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cuisineItem: { width: (width - 60) / 3, alignItems: 'center', marginBottom: 16 },
  cuisineIcon: { width: 70, height: 70, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  cuisineEmoji: { fontSize: 32 },
  cuisineLabel: { fontSize: 13, fontWeight: '500', color: '#444' },

  orderCard: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 20, padding: 20 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  orderInfo: {},
  orderRestaurant: { fontSize: 17, fontWeight: '600', color: '#1a1a1a' },
  orderItems: { fontSize: 13, color: '#888', marginTop: 4 },
  orderStatus: { backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  orderStatusText: { fontSize: 12, fontWeight: '600', color: '#92400E' },
  progressContainer: { marginBottom: 20 },
  progressBar: { height: 4, backgroundColor: '#E5E5E5', borderRadius: 2, marginBottom: 16, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  progressSteps: { flexDirection: 'row', justifyContent: 'space-between' },
  progressStep: { alignItems: 'center', width: 70 },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E5E5E5', marginBottom: 6 },
  stepDotComplete: { backgroundColor: '#22C55E' },
  stepDotActive: { backgroundColor: '#571FE4' },
  stepLabel: { fontSize: 10, color: '#888', textAlign: 'center' },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderEta: { fontSize: 14, fontWeight: '500', color: '#1a1a1a' },
  trackBtn: { borderRadius: 12, overflow: 'hidden' },
  trackBtnGradient: { paddingHorizontal: 20, paddingVertical: 12 },
  trackBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  // Rewards
  rewardsSlot: { marginHorizontal: 20, height: 80, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  rewardsPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  rewardsIcon: { fontSize: 32, marginRight: 14 },
  rewardsContent: { flex: 1 },
  rewardsTitle: { fontSize: 15, fontWeight: '600', color: '#166534' },
  rewardsSubtitle: { fontSize: 13, color: '#22C55E', marginTop: 2 },
  rewardsProgress: { width: 80, height: 8, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 4, overflow: 'hidden' },
  rewardsProgressFill: { width: '65%', height: '100%', backgroundColor: '#22C55E', borderRadius: 4 },

  bottomSlot: { marginHorizontal: 20, height: 70, borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  bottomPlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  bottomIcon: { fontSize: 24, marginRight: 12 },
  bottomText: { fontSize: 15, color: '#888' },
});
