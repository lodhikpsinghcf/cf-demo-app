import React, { useCallback, useState } from 'react';
import { Image, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCF, type CFCampaign } from '@contentflow/sdk/react-native';
import { absoluteUrl, useContentFlow } from '../providers/ContentFlowProvider';

// /campaigns returns every channel (email, sms, ...); only these are shown inside the app.
const IN_APP_TYPES = new Set(['popup', 'inapp_notification']);

// Closed messages stay closed until the app restarts, so switching tabs doesn't re-open them.
const dismissedThisSession = new Set<string>();

interface Props {
  /** Where in the app this is shown; campaigns targeting it (or no placement) appear here. */
  placement: string;
}

export function InAppMessage({ placement }: Props) {
  const client = useCF();
  const { isReady } = useContentFlow();
  const [campaign, setCampaign] = useState<CFCampaign | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!isReady) return;
      let active = true;
      client
        .getCampaigns(placement)
        .then(list => {
          const next = list.find(c => IN_APP_TYPES.has(c.type) && !dismissedThisSession.has(c.campaignId));
          if (!active || !next) return;
          client.trackCampaignImpression(next);
          setCampaign(next);
        })
        .catch(err => console.log('[InAppMessage] getCampaigns failed:', err));
      return () => {
        active = false;
      };
    }, [client, isReady, placement]),
  );

  if (!campaign) return null;

  const close = () => {
    dismissedThisSession.add(campaign.campaignId);
    setCampaign(null);
  };

  const onAction = () => {
    client.trackCampaignTap(campaign);
    if (campaign.actionUrl) {
      Linking.openURL(campaign.actionUrl).catch(err => console.log('[InAppMessage] cannot open', campaign.actionUrl, err));
    }
    close();
  };

  const imageUrl = absoluteUrl(campaign.imageUrl);

  return (
    <Modal transparent animationType="fade" visible onRequestClose={close}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.close} onPress={close} accessibilityLabel="Close message" hitSlop={12}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" /> : null}
          <View style={styles.body}>
            {campaign.title ? <Text style={styles.title}>{campaign.title}</Text> : null}
            {campaign.body ? <Text style={styles.text}>{campaign.body}</Text> : null}
            <TouchableOpacity style={styles.cta} onPress={onAction} activeOpacity={0.9}>
              <Text style={styles.ctaText}>{campaign.ctaLabel || 'OK'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  image: { width: '100%', height: 180, backgroundColor: '#eee' },
  body: { padding: 20, gap: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#111' },
  text: { fontSize: 15, lineHeight: 21, color: '#444' },
  cta: {
    marginTop: 8,
    backgroundColor: '#571FE4',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
