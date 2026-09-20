import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, ViewStyle } from 'react-native';
import { useContentFlow } from '../providers/ContentFlowProvider';

interface CFSlotProps {
  slotId: string;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function CFSlot({ slotId, style, children }: CFSlotProps) {
  const { getSlotContent, trackEvent, isReady } = useContentFlow();
  const content = getSlotContent(slotId);

  useEffect(() => {
    if (content && isReady) {
      trackEvent('impression', {
        slotId,
        blockKey: content.key,
        blockType: content.type,
      });
    }
  }, [content, slotId, isReady]);

  const handleTap = () => {
    if (content) {
      trackEvent('tap', {
        slotId,
        blockKey: content.key,
        blockType: content.type,
      });

      if (content.cta?.url) {
        Linking.openURL(content.cta.url);
      }
    }
  };

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
              <View style={[styles.bannerImage, { backgroundColor: content.backgroundColor || '#571FE4' }]} />
            )}
            <View style={[styles.bannerOverlay, content.imageUrl && styles.bannerOverlayDark]}>
              {content.title && <Text style={styles.bannerTitle}>{content.title}</Text>}
              {content.subtitle && <Text style={styles.bannerSubtitle}>{content.subtitle}</Text>}
              {content.cta?.label && (
                <View style={styles.ctaButton}>
                  <Text style={styles.ctaText}>{content.cta.label}</Text>
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
          <TouchableOpacity style={[styles.promo, { backgroundColor: content.backgroundColor || '#FEF3C7' }]} onPress={handleTap} activeOpacity={0.95}>
            <View style={styles.promoContent}>
              {content.icon && <Text style={styles.promoIcon}>{content.icon}</Text>}
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

  // Banner / Hero
  banner: {
    flex: 1,
    position: 'relative',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
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
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
