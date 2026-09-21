import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ViewStyle,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContentFlow } from '../providers/ContentFlowProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CFSlotProps {
  slotId: string;
  style?: ViewStyle;
  children?: React.ReactNode;
  variant?: 'default' | 'compact' | 'fullwidth';
  showSkeleton?: boolean;
}

export function CFSlot({ slotId, style, children, variant = 'default', showSkeleton = true }: CFSlotProps) {
  const { getSlotContent, getBlock, trackImpression, trackTap, isReady } = useContentFlow();
  const content = getSlotContent(slotId);
  const block = getBlock(slotId);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);
  const shimmerAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  useEffect(() => {
    if (isLoading && showSkeleton) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(shimmerAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isLoading, showSkeleton]);

  // Track impression once when block content is loaded
  useEffect(() => {
    if (content && isReady && !hasTrackedImpression) {
      if (block) {
        trackImpression(block);
      } else {
        trackImpression(content);
      }
      setHasTrackedImpression(true);
    }
  }, [content, block, isReady, hasTrackedImpression, trackImpression]);

  const handleTap = () => {
    if (content) {
      // Track tap event
      if (block) {
        trackTap(block);
      } else {
        trackTap(content);
      }

      if (content.cta?.url) {
        Linking.openURL(content.cta.url);
      }
    }
  };

  // Skeleton loader
  if (isLoading && showSkeleton && !children) {
    const opacity = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });
    return (
      <View style={[styles.slot, style]}>
        <Animated.View style={[styles.skeleton, { opacity }]}>
          <LinearGradient
            colors={['#E5E5E5', '#F5F5F5', '#E5E5E5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    );
  }

  // No content from server - show placeholder/fallback
  if (!content) {
    return (
      <View style={[styles.slot, style]}>
        {children}
      </View>
    );
  }

  // Render content based on block type
  const renderContent = () => {
    switch (content.type) {
      case 'banner':
      case 'hero':
        return (
          <TouchableOpacity style={styles.banner} onPress={handleTap} activeOpacity={0.95}>
            {content.imageUrl ? (
              <Image source={{ uri: content.imageUrl }} style={styles.bannerImage} resizeMode="cover" />
            ) : (
              <LinearGradient
                colors={[content.backgroundColor || '#571FE4', content.gradientEnd || '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bannerImage}
              />
            )}
            <View style={[styles.bannerOverlay, content.imageUrl && styles.bannerOverlayDark]}>
              {content.badge && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{content.badge}</Text>
                </View>
              )}
              {content.title && <Text style={styles.bannerTitle}>{content.title}</Text>}
              {content.subtitle && <Text style={styles.bannerSubtitle}>{content.subtitle}</Text>}
              {content.cta?.label && (
                <View style={[styles.ctaButton, content.ctaColor && { backgroundColor: content.ctaColor }]}>
                  <Text style={[styles.ctaText, content.ctaTextColor && { color: content.ctaTextColor }]}>
                    {content.cta.label}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );

      case 'card':
        return (
          <TouchableOpacity style={styles.card} onPress={handleTap} activeOpacity={0.95}>
            {content.imageUrl && (
              <Image source={{ uri: content.imageUrl }} style={styles.cardImage} resizeMode="cover" />
            )}
            <View style={styles.cardContent}>
              {content.title && <Text style={styles.cardTitle}>{content.title}</Text>}
              {content.description && <Text style={styles.cardDescription} numberOfLines={2}>{content.description}</Text>}
              {content.cta?.label && (
                <Text style={styles.cardCta}>{content.cta.label} →</Text>
              )}
            </View>
          </TouchableOpacity>
        );

      case 'promo':
      case 'inline':
        return (
          <TouchableOpacity
            style={[styles.promo]}
            onPress={handleTap}
            activeOpacity={0.95}
          >
            <LinearGradient
              colors={[content.backgroundColor || '#FEF3C7', content.gradientEnd || '#FDE68A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.promoContent}>
              {content.icon && <Text style={styles.promoIcon}>{content.icon}</Text>}
              {content.imageUrl && (
                <Image source={{ uri: content.imageUrl }} style={styles.promoImage} resizeMode="cover" />
              )}
              <View style={styles.promoText}>
                {content.title && <Text style={[styles.promoTitle, { color: content.titleColor || '#92400E' }]}>{content.title}</Text>}
                {content.subtitle && <Text style={[styles.promoSubtitle, { color: content.subtitleColor || '#B45309' }]}>{content.subtitle}</Text>}
              </View>
            </View>
            {content.cta?.label && (
              <View style={[styles.promoCta, { backgroundColor: content.ctaColor || '#F59E0B' }]}>
                <Text style={styles.promoCtaText}>{content.cta.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        );

      case 'reward':
        return (
          <TouchableOpacity style={styles.reward} onPress={handleTap} activeOpacity={0.95}>
            <LinearGradient
              colors={['#F0FDF4', '#DCFCE7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.rewardLeft}>
              {content.icon && <Text style={styles.rewardIcon}>{content.icon}</Text>}
              <View>
                {content.title && <Text style={styles.rewardLabel}>{content.title}</Text>}
                {content.value && <Text style={styles.rewardValue}>{content.value}</Text>}
              </View>
            </View>
            {content.cta?.label && (
              <View style={styles.rewardCta}>
                <Text style={styles.rewardCtaText}>{content.cta.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        );

      case 'carousel':
        return (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
          >
            {(content.items || []).map((item: any, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.carouselItem}
                onPress={() => {
                  if (block) trackTap(block);
                  if (item.url) Linking.openURL(item.url);
                }}
                activeOpacity={0.95}
              >
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.carouselImage} resizeMode="cover" />
                ) : (
                  <LinearGradient
                    colors={[item.backgroundColor || '#EEF2FF', item.gradientEnd || '#C7D2FE']}
                    style={styles.carouselImage}
                  />
                )}
                {item.title && <Text style={styles.carouselTitle}>{item.title}</Text>}
                {item.subtitle && <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      case 'story':
        return (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storyContainer}
          >
            {(content.items || []).map((item: any, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.storyItem}
                onPress={() => {
                  if (block) trackTap(block);
                  if (item.url) Linking.openURL(item.url);
                }}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={item.hasNew ? ['#E11D48', '#EC4899', '#F59E0B'] : ['#E5E5E5', '#D4D4D4']}
                  style={styles.storyRing}
                >
                  <View style={styles.storyImageContainer}>
                    {item.imageUrl ? (
                      <Image source={{ uri: item.imageUrl }} style={styles.storyImage} resizeMode="cover" />
                    ) : (
                      <View style={[styles.storyImage, { backgroundColor: item.backgroundColor || '#F5F5F5' }]}>
                        <Text style={styles.storyIcon}>{item.icon || '✨'}</Text>
                      </View>
                    )}
                  </View>
                </LinearGradient>
                <Text style={styles.storyLabel} numberOfLines={1}>{item.title || 'Story'}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      case 'grid':
        const gridItems = content.items || [];
        const columns = content.columns || 2;
        return (
          <View style={[styles.gridContainer, { flexDirection: 'row', flexWrap: 'wrap' }]}>
            {gridItems.map((item: any, index: number) => (
              <TouchableOpacity
                key={index}
                style={[styles.gridItem, { width: `${100 / columns}%` }]}
                onPress={() => {
                  if (block) trackTap(block);
                  if (item.url) Linking.openURL(item.url);
                }}
                activeOpacity={0.9}
              >
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.gridImage} resizeMode="cover" />
                ) : (
                  <LinearGradient
                    colors={[item.backgroundColor || '#F0F9FF', item.gradientEnd || '#E0F2FE']}
                    style={styles.gridImage}
                  >
                    {item.icon && <Text style={styles.gridIcon}>{item.icon}</Text>}
                  </LinearGradient>
                )}
                {item.title && <Text style={styles.gridTitle}>{item.title}</Text>}
                {item.subtitle && <Text style={styles.gridSubtitle}>{item.subtitle}</Text>}
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'countdown':
        return (
          <TouchableOpacity style={styles.countdown} onPress={handleTap} activeOpacity={0.95}>
            <LinearGradient
              colors={['#7C3AED', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.countdownContent}>
              {content.icon && <Text style={styles.countdownIcon}>{content.icon}</Text>}
              <View style={styles.countdownText}>
                {content.title && <Text style={styles.countdownTitle}>{content.title}</Text>}
                {content.subtitle && <Text style={styles.countdownSubtitle}>{content.subtitle}</Text>}
              </View>
            </View>
            <View style={styles.countdownTimer}>
              <View style={styles.timerBlock}>
                <Text style={styles.timerValue}>{content.hours || '00'}</Text>
                <Text style={styles.timerLabel}>HRS</Text>
              </View>
              <Text style={styles.timerSeparator}>:</Text>
              <View style={styles.timerBlock}>
                <Text style={styles.timerValue}>{content.minutes || '00'}</Text>
                <Text style={styles.timerLabel}>MIN</Text>
              </View>
              <Text style={styles.timerSeparator}>:</Text>
              <View style={styles.timerBlock}>
                <Text style={styles.timerValue}>{content.seconds || '00'}</Text>
                <Text style={styles.timerLabel}>SEC</Text>
              </View>
            </View>
          </TouchableOpacity>
        );

      case 'fullwidth':
        return (
          <TouchableOpacity style={styles.fullwidth} onPress={handleTap} activeOpacity={0.98}>
            {content.imageUrl ? (
              <Image source={{ uri: content.imageUrl }} style={styles.fullwidthImage} resizeMode="cover" />
            ) : (
              <LinearGradient
                colors={[content.backgroundColor || '#1E293B', content.gradientEnd || '#334155']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.fullwidthImage}
              />
            )}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.fullwidthOverlay}
            >
              <View style={styles.fullwidthContent}>
                {content.badge && (
                  <View style={styles.fullwidthBadge}>
                    <Text style={styles.fullwidthBadgeText}>{content.badge}</Text>
                  </View>
                )}
                {content.title && <Text style={styles.fullwidthTitle}>{content.title}</Text>}
                {content.subtitle && <Text style={styles.fullwidthSubtitle}>{content.subtitle}</Text>}
                {content.cta?.label && (
                  <View style={styles.fullwidthCta}>
                    <Text style={styles.fullwidthCtaText}>{content.cta.label}</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        );

      case 'spotlight':
        return (
          <TouchableOpacity style={styles.spotlight} onPress={handleTap} activeOpacity={0.95}>
            <View style={styles.spotlightLeft}>
              {content.imageUrl ? (
                <Image source={{ uri: content.imageUrl }} style={styles.spotlightImage} resizeMode="cover" />
              ) : (
                <LinearGradient
                  colors={[content.backgroundColor || '#FEF3C7', content.gradientEnd || '#FDE68A']}
                  style={styles.spotlightImage}
                >
                  {content.icon && <Text style={styles.spotlightIcon}>{content.icon}</Text>}
                </LinearGradient>
              )}
            </View>
            <View style={styles.spotlightContent}>
              {content.badge && (
                <View style={[styles.spotlightBadge, { backgroundColor: content.badgeColor || '#FEF3C7' }]}>
                  <Text style={[styles.spotlightBadgeText, { color: content.badgeTextColor || '#92400E' }]}>{content.badge}</Text>
                </View>
              )}
              {content.title && <Text style={styles.spotlightTitle}>{content.title}</Text>}
              {content.description && <Text style={styles.spotlightDesc} numberOfLines={2}>{content.description}</Text>}
              {content.cta?.label && (
                <Text style={styles.spotlightCta}>{content.cta.label} →</Text>
              )}
            </View>
          </TouchableOpacity>
        );

      default:
        return (
          <TouchableOpacity style={styles.defaultBlock} onPress={handleTap} activeOpacity={0.95}>
            <View style={styles.defaultContent}>
              {content.icon && <Text style={styles.defaultIcon}>{content.icon}</Text>}
              <View style={styles.defaultText}>
                {content.title && <Text style={styles.defaultTitle}>{content.title}</Text>}
                {content.description && <Text style={styles.defaultDesc}>{content.description}</Text>}
              </View>
            </View>
            {content.cta?.label && <Text style={styles.defaultCta}>{content.cta.label} →</Text>}
          </TouchableOpacity>
        );
    }
  };

  return (
    <View style={[styles.slot, style]}>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    overflow: 'hidden',
    borderRadius: 16,
  },

  skeleton: {
    flex: 1,
    borderRadius: 16,
  },

  // Badge
  badgeContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Banner / Hero
  banner: {
    flex: 1,
    position: 'relative',
  },
  bannerImage: {
    ...StyleSheet.absoluteFill,
  },
  bannerOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  bannerOverlayDark: {
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 4,
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 14,
  },
  ctaText: {
    color: '#571FE4',
    fontWeight: '600',
    fontSize: 14,
  },

  // Card
  card: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: 100,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    lineHeight: 18,
  },
  cardCta: {
    fontSize: 14,
    fontWeight: '600',
    color: '#571FE4',
    marginTop: 8,
  },

  // Promo / Inline
  promo: {
    flex: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    overflow: 'hidden',
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  promoIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  promoImage: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 14,
  },
  promoText: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  promoSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  promoCta: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  promoCtaText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },

  // Reward
  reward: {
    flex: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  rewardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  rewardLabel: {
    fontSize: 13,
    color: '#166534',
  },
  rewardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#15803D',
    marginTop: 2,
  },
  rewardCta: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  rewardCtaText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  // Carousel
  carouselContainer: {
    paddingHorizontal: 4,
  },
  carouselItem: {
    width: 140,
    marginHorizontal: 6,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  carouselImage: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  carouselSubtitle: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginTop: 2,
  },

  // Story
  storyContainer: {
    paddingHorizontal: 10,
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 72,
  },
  storyRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImageContainer: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#fff',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyIcon: {
    fontSize: 24,
  },
  storyLabel: {
    fontSize: 11,
    color: '#444',
    marginTop: 6,
    textAlign: 'center',
  },

  // Grid
  gridContainer: {
    padding: 4,
  },
  gridItem: {
    padding: 6,
  },
  gridImage: {
    aspectRatio: 1,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridIcon: {
    fontSize: 32,
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 8,
    textAlign: 'center',
  },
  gridSubtitle: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },

  // Countdown
  countdown: {
    flex: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    overflow: 'hidden',
  },
  countdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  countdownIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  countdownText: {
    flex: 1,
  },
  countdownTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  countdownSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  countdownTimer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerBlock: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 36,
  },
  timerValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  timerLabel: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  timerSeparator: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginHorizontal: 4,
  },

  // Fullwidth
  fullwidth: {
    flex: 1,
    position: 'relative',
  },
  fullwidthImage: {
    ...StyleSheet.absoluteFill,
  },
  fullwidthOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  fullwidthContent: {
    padding: 20,
  },
  fullwidthBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  fullwidthBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  fullwidthTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  fullwidthSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
  },
  fullwidthCta: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  fullwidthCtaText: {
    color: '#1a1a1a',
    fontWeight: '600',
    fontSize: 14,
  },

  // Spotlight
  spotlight: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
  },
  spotlightLeft: {
    width: 120,
  },
  spotlightImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotlightIcon: {
    fontSize: 40,
  },
  spotlightContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  spotlightBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  spotlightBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  spotlightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  spotlightDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    lineHeight: 18,
  },
  spotlightCta: {
    fontSize: 14,
    fontWeight: '600',
    color: '#571FE4',
    marginTop: 8,
  },

  // Default
  defaultBlock: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  defaultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  defaultIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  defaultText: {
    flex: 1,
  },
  defaultTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  defaultDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  defaultCta: {
    fontSize: 14,
    fontWeight: '600',
    color: '#571FE4',
  },
});
