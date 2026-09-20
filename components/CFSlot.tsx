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

      // Handle CTA action
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
          <TouchableOpacity style={styles.banner} onPress={handleTap} activeOpacity={0.9}>
            {content.imageUrl && (
              <Image source={{ uri: content.imageUrl }} style={styles.bannerImage} resizeMode="cover" />
            )}
            <View style={styles.bannerOverlay}>
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
          <TouchableOpacity style={styles.card} onPress={handleTap} activeOpacity={0.9}>
            {content.imageUrl && (
              <Image source={{ uri: content.imageUrl }} style={styles.cardImage} resizeMode="cover" />
            )}
            <View style={styles.cardContent}>
              {content.title && <Text style={styles.cardTitle}>{content.title}</Text>}
              {content.description && <Text style={styles.cardDescription}>{content.description}</Text>}
            </View>
          </TouchableOpacity>
        );

      case 'promo':
        return (
          <TouchableOpacity style={styles.promo} onPress={handleTap} activeOpacity={0.9}>
            <View style={styles.promoContent}>
              {content.icon && <Text style={styles.promoIcon}>{content.icon}</Text>}
              <View style={styles.promoText}>
                {content.title && <Text style={styles.promoTitle}>{content.title}</Text>}
                {content.subtitle && <Text style={styles.promoSubtitle}>{content.subtitle}</Text>}
              </View>
            </View>
            {content.cta?.label && (
              <View style={styles.promoCta}>
                <Text style={styles.promoCtaText}>{content.cta.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        );

      default:
        return (
          <TouchableOpacity style={styles.defaultBlock} onPress={handleTap}>
            {content.title && <Text style={styles.defaultTitle}>{content.title}</Text>}
            {content.description && <Text style={styles.defaultDesc}>{content.description}</Text>}
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
  },
  // Banner styles
  banner: {
    flex: 1,
    backgroundColor: '#571FE4',
    position: 'relative',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 4,
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  ctaText: {
    color: '#571FE4',
    fontWeight: '600',
    fontSize: 14,
  },
  // Card styles
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    height: '60%',
    width: '100%',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  // Promo styles
  promo: {
    flex: 1,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  promoIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  promoText: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400e',
  },
  promoSubtitle: {
    fontSize: 12,
    color: '#b45309',
    marginTop: 2,
  },
  promoCta: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  promoCtaText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  // Default styles
  defaultBlock: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    justifyContent: 'center',
    borderRadius: 12,
  },
  defaultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  defaultDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
});
