/**
 * ContentFlow SDK Provider
 *
 * Production-ready SDK integration using @contentflow/sdk v2.0.0
 * Wraps the official SDK with app-specific configuration and helpers.
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from 'react';
import {
  CFProvider as CFSDKProvider,
  CFBlock,
  CFConfig,
  CFLiveStatus,
  useCF,
  useCFBlock,
  useCFBlocks,
  useLiveStatus,
} from '@contentflow/sdk/react-native';
import { registerExpoPush, unregisterExpoPush } from '@contentflow/sdk/expo';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// SDK Configuration from environment variables
const CF_CONFIG: CFConfig = {
  baseUrl: process.env.EXPO_PUBLIC_CF_BASE_URL || 'https://api.contentflow.click',
  tenantId: process.env.EXPO_PUBLIC_CF_TENANT_ID || '',
  publicKey: process.env.EXPO_PUBLIC_CF_SDK_KEY || '',
  consent: false,
  debug: __DEV__,
};

// Storage keys
const STORAGE_KEYS = {
  USER_ID: '@cf_user_id',
  CONSENT: '@cf_consent',
  ONBOARDING: '@cf_onboarding_complete',
};

// Types
export interface ConsentOptions {
  marketing?: boolean;
  push?: boolean;
  sms?: boolean;
  email?: boolean;
  locationTracking?: boolean;
}

export interface UserTraits {
  [key: string]: string | number | boolean | undefined;
}

export interface BlockContent {
  key: string;
  type: string;
  slotId?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  backgroundColor?: string;
  gradientEnd?: string;
  badge?: string;
  value?: string;
  cta?: { label: string; url: string };
  items?: any[];
  [key: string]: any;
}

export interface LiveStatus {
  mode: 'stream' | 'poll' | 'off';
  state: 'connecting' | 'connected' | 'reconnecting' | 'polling' | 'stopped';
  isOnline: boolean;
  reason?: string;
}

// Typed event interfaces (matching SDK)
export interface CommerceEvent {
  action: 'purchase' | 'transfer' | 'payment' | 'booking' | 'order' | 'refund' | 'subscribe' | 'cancel' | 'top_up' | 'withdraw' | string;
  amount?: number;
  currency?: string;
  reference?: string;
  status?: 'initiated' | 'pending' | 'completed' | 'failed' | 'cancelled' | string;
  bookingType?: 'flight' | 'hotel' | 'appointment' | 'table' | 'service' | string;
  datetime?: string;
  provider?: string;
  itemCount?: number;
  deliveryTime?: number;
  plan?: string;
  interval?: 'monthly' | 'yearly' | 'weekly' | string;
  transferType?: 'internal' | 'external' | 'international' | string;
  recipientType?: 'person' | 'business' | string;
  custom?: Record<string, unknown>;
}

export interface EngagementEvent {
  action: 'click' | 'view' | 'search' | 'share' | 'scroll' | 'swipe' | 'play' | 'pause' | 'download' | 'favorite' | 'rate' | 'review' | string;
  element?: string;
  screen?: string;
  query?: string;
  resultsCount?: number;
  position?: number;
  contentId?: string;
  contentType?: string;
  rating?: number;
  destination?: string;
  depth?: number;
  duration?: number;
  custom?: Record<string, unknown>;
}

export interface IdentityEvent {
  action: 'sign_up' | 'sign_in' | 'sign_out' | 'delete' | 'verify' | 'password_reset' | 'password_change' | 'profile_update' | string;
  method?: 'email' | 'phone' | 'social' | 'sso' | 'biometric' | string;
  provider?: string;
  verificationType?: 'email' | 'phone' | 'document' | 'biometric' | string;
  custom?: Record<string, unknown>;
}

export interface GrowthEvent {
  action: 'earn' | 'redeem' | 'tier_change' | 'expire' | 'invite' | 'invite_accepted' | 'referral_convert' | string;
  points?: number;
  tier?: string;
  previousTier?: string;
  rewardId?: string;
  rewardType?: 'discount' | 'cashback' | 'points' | 'gift' | string;
  inviteCode?: string;
  referrerId?: string;
  referredId?: string;
  custom?: Record<string, unknown>;
}

export interface AccountEvent {
  action: 'view' | 'update' | 'verify' | 'close' | 'lock' | 'unlock' | 'statement' | 'limit_change' | string;
  accountId?: string;
  accountType?: string;
  balance?: number;
  currency?: string;
  period?: string;
  newLimit?: number;
  limitType?: string;
  custom?: Record<string, unknown>;
}

export interface SystemEvent {
  action: 'session_start' | 'session_end' | 'app_open' | 'app_background' | 'push_delivered' | 'push_opened' | 'push_dismissed' | 'experiment_exposure' | 'error' | 'crash' | string;
  duration?: number;
  screenCount?: number;
  messageId?: string;
  campaignId?: string;
  channel?: string;
  experimentId?: string;
  variantId?: string;
  errorCode?: string;
  errorMessage?: string;
  custom?: Record<string, unknown>;
}

export interface LocationEvent {
  action: 'geofence_enter' | 'geofence_exit' | 'geofence_dwell' | 'store_visit' | 'zone_enter' | 'zone_exit' | 'location_update' | 'location_permission' | string;
  fenceId?: string;
  name?: string;
  locationType?: 'store' | 'branch' | 'restaurant' | 'airport' | 'mall' | 'zone' | string;
  dwellTime?: number;
  lat?: number;
  lng?: number;
  accuracy?: number;
  source?: string;
  permissionStatus?: 'granted' | 'denied' | 'restricted' | string;
  custom?: Record<string, unknown>;
}

export interface IPGeolocation {
  ip: string;
  country: string;
  countryName: string;
  region?: string;
  regionName?: string;
  city?: string;
  postalCode?: string;
  lat?: number;
  lng?: number;
  timezone?: string;
  utcOffset?: number;
  isp?: string;
  org?: string;
  isProxy?: boolean;
  isHosting?: boolean;
}

export interface ContentFlowContextType {
  // State
  isReady: boolean;
  isInitializing: boolean;
  deviceId: string | null;
  userId: string | null;
  consent: ConsentOptions;
  content: Record<string, BlockContent>;
  config: CFConfig;
  error: string | null;
  liveStatus: LiveStatus | null;

  // Identity Methods
  identify: (userId?: string, traits?: UserTraits) => Promise<void>;
  setUserId: (userId: string) => Promise<void>;
  updateTraits: (traits: UserTraits) => Promise<void>;
  setConsent: (options: ConsentOptions) => Promise<void>;

  // Generic track (legacy)
  trackEvent: (eventType: string, data?: Record<string, any>) => void;

  // Typed Event Methods (v2.0)
  commerce: (event: CommerceEvent) => void;
  engagement: (event: EngagementEvent) => void;
  identity: (event: IdentityEvent) => void;
  growth: (event: GrowthEvent) => void;
  account: (event: AccountEvent) => void;
  system: (event: SystemEvent) => void;
  location: (event: LocationEvent) => void;

  // Identity Events
  trackSignUp: (userId: string, traits?: UserTraits) => void;
  trackSignIn: (userId: string) => void;

  // Block Events
  trackImpression: (block: CFBlock | BlockContent) => void;
  trackTap: (block: CFBlock | BlockContent) => void;

  // Content
  sync: () => Promise<void>;
  getSlotContent: (slotId: string) => BlockContent | null;
  getBlock: (key: string) => CFBlock | undefined;

  // Push
  registerPush: () => Promise<any>;
  unregisterPush: () => Promise<void>;

  // Geolocation
  getIPGeolocation: () => Promise<IPGeolocation | null>;

  // Lifecycle
  flush: () => Promise<void>;
  reset: () => Promise<void>;
  logout: () => Promise<void>;

  // Localization
  setLocale: (locale: string) => Promise<void>;
  t: (key: string, fallback?: string) => string;
}

const ContentFlowContext = createContext<ContentFlowContextType | null>(null);

// Inner provider that has access to CFClient via useCF hook
function ContentFlowInner({ children }: { children: ReactNode }) {
  const client = useCF();
  const sdkLiveStatus = useLiveStatus();

  const [isReady, setIsReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [userId, setUserIdState] = useState<string | null>(null);
  const [consent, setConsentState] = useState<ConsentOptions>({});
  const [content, setContent] = useState<Record<string, BlockContent>>({});
  const [error, setError] = useState<string | null>(null);
  const [liveStatus, setLiveStatus] = useState<LiveStatus | null>(null);

  const initialized = useRef(false);

  // Convert CFBlock to BlockContent
  const blockToContent = useCallback((block: CFBlock): BlockContent => {
    const cta = block.get('cta') as { label?: string; url?: string } | null;
    return {
      key: block.key,
      type: (block.get('type') as string) || 'default',
      slotId: block.get('slotId') as string | undefined,
      title: block.title || (block.get('title') as string | undefined),
      subtitle: block.get('subtitle') as string | undefined,
      description: block.body || (block.get('description') as string | undefined),
      imageUrl: block.imageUrl || (block.get('imageUrl') as string) || (block.get('image_url') as string | undefined),
      icon: block.get('icon') as string | undefined,
      backgroundColor: block.get('backgroundColor') as string || block.get('background_color') as string | undefined,
      gradientEnd: block.get('gradientEnd') as string || block.get('gradient_end') as string | undefined,
      badge: block.get('badge') as string | undefined,
      value: block.get('value') as string | undefined,
      cta: cta ? {
        label: cta.label || block.ctaLabel || (block.get('cta_label') as string) || '',
        url: cta.url || (block.get('cta_url') as string) || '',
      } : block.ctaLabel ? { label: block.ctaLabel, url: block.get('cta_url') as string || '' } : undefined,
      items: block.getCollection?.('items') || (block.get('items') as any[]),
    };
  }, []);

  // Initialize SDK when client is available
  useEffect(() => {
    if (initialized.current || !client) return;
    initialized.current = true;

    async function init() {
      try {
        setIsInitializing(true);

        // Load stored user ID
        const storedUserId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
        if (storedUserId) {
          setUserIdState(storedUserId);
          await client.setUserId(storedUserId);
        }

        // Load stored consent
        const storedConsent = await AsyncStorage.getItem(STORAGE_KEYS.CONSENT);
        if (storedConsent) {
          const parsed = JSON.parse(storedConsent);
          setConsentState(parsed);
          if (parsed.marketing) {
            await client.setConsent(true);
          }
        }

        // Identify device
        const receipt = await client.identify();
        if (receipt) {
          setDeviceId(client.cfg?.deviceId || null);
        }

        // Start live updates
        await client.start();

        // Get initial content
        const blocks = await client.sync();
        if (blocks) {
          const contentMap: Record<string, BlockContent> = {};
          for (const block of blocks) {
            const slotId = (block.get('slotId') as string) || block.key;
            contentMap[slotId] = blockToContent(block);
          }
          setContent(contentMap);
          console.log(`[ContentFlow] Synced ${blocks.length} blocks`);
        }

        console.log('[ContentFlow] SDK initialized successfully');
        setIsReady(true);
      } catch (err) {
        console.error('[ContentFlow] Init error:', err);
        setError(err instanceof Error ? err.message : 'Init failed');
        setIsReady(true);
      } finally {
        setIsInitializing(false);
      }
    }

    init();

    return () => {
      if (client) {
        client.dispose();
      }
    };
  }, [client, blockToContent]);

  // Update live status when SDK status changes
  useEffect(() => {
    if (sdkLiveStatus) {
      setLiveStatus({
        mode: sdkLiveStatus.mode,
        state: sdkLiveStatus.state,
        isOnline: sdkLiveStatus.state === 'connected' || sdkLiveStatus.state === 'polling',
        reason: sdkLiveStatus.reason,
      });
    }
  }, [sdkLiveStatus]);

  const identify = useCallback(async (newUserId?: string, traits?: UserTraits) => {
    if (!client) return;

    if (newUserId) {
      setUserIdState(newUserId);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, newUserId);
      await client.setUserId(newUserId);
    }

    if (traits) {
      await client.identify({ traits });
    }
  }, [client]);

  const setUserId = useCallback(async (id: string) => {
    if (!client) return;
    setUserIdState(id);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, id);
    await client.setUserId(id);
  }, [client]);

  const updateTraits = useCallback(async (traits: UserTraits) => {
    if (!client) return;
    await client.identify({ traits });
  }, [client]);

  const setConsent = useCallback(async (options: ConsentOptions) => {
    if (!client) return;

    const newConsent = { ...consent, ...options };
    setConsentState(newConsent);
    await AsyncStorage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(newConsent));

    // Set analytics consent
    if (options.marketing !== undefined) {
      await client.setConsent(options.marketing);
    }
  }, [client, consent]);

  const trackEvent = useCallback((eventType: string, data?: Record<string, any>) => {
    if (!client) return;
    client.track(eventType, { key: eventType, ...data });
  }, [client]);

  // Typed event methods (v2.0)
  const commerce = useCallback((event: CommerceEvent) => {
    if (!client) return;
    client.track(`commerce:${event.action}`, { key: `commerce:${event.action}`, ...event });
  }, [client]);

  const engagement = useCallback((event: EngagementEvent) => {
    if (!client) return;
    client.track(`engagement:${event.action}`, { key: `engagement:${event.action}`, ...event });
  }, [client]);

  const identityEvent = useCallback((event: IdentityEvent) => {
    if (!client) return;
    client.track(`identity:${event.action}`, { key: `identity:${event.action}`, ...event });
  }, [client]);

  const growth = useCallback((event: GrowthEvent) => {
    if (!client) return;
    client.track(`growth:${event.action}`, { key: `growth:${event.action}`, ...event });
  }, [client]);

  const accountEvent = useCallback((event: AccountEvent) => {
    if (!client) return;
    client.track(`account:${event.action}`, { key: `account:${event.action}`, ...event });
  }, [client]);

  const systemEvent = useCallback((event: SystemEvent) => {
    if (!client) return;
    client.track(`system:${event.action}`, { key: `system:${event.action}`, ...event });
  }, [client]);

  const locationEvent = useCallback((event: LocationEvent) => {
    if (!client) return;
    client.track(`location:${event.action}`, { key: `location:${event.action}`, ...event });
  }, [client]);

  const trackSignUp = useCallback(async (newUserId: string, traits?: UserTraits) => {
    if (!client) return;
    await setUserId(newUserId);
    await client.trackSignUp({
      username: newUserId,
      fullName: traits?.name as string,
      email: traits?.email as string,
      phone: traits?.phone as string,
    });
  }, [client, setUserId]);

  const trackSignIn = useCallback(async (existingUserId: string) => {
    if (!client) return;
    await setUserId(existingUserId);
    await client.trackSignIn({ username: existingUserId });
  }, [client, setUserId]);

  const trackImpression = useCallback((block: CFBlock | BlockContent) => {
    if (!client) return;
    if ('get' in block && typeof block.get === 'function') {
      client.trackImpression(block as CFBlock);
    }
  }, [client]);

  const trackTap = useCallback((block: CFBlock | BlockContent) => {
    if (!client) return;
    if ('get' in block && typeof block.get === 'function') {
      client.trackTap(block as CFBlock);
    }
  }, [client]);

  const sync = useCallback(async () => {
    if (!client) return;

    const blocks = await client.sync();
    if (blocks) {
      const contentMap: Record<string, BlockContent> = {};
      for (const block of blocks) {
        const slotId = (block.get('slotId') as string) || block.key;
        contentMap[slotId] = blockToContent(block);
      }
      setContent(contentMap);
      console.log(`[ContentFlow] Synced ${blocks.length} blocks`);
    }
  }, [client, blockToContent]);

  const registerPushHandler = useCallback(async () => {
    if (!client) return { status: 'failed', error: new Error('Client not initialized') };

    const result = await registerExpoPush(client, Notifications, { requestPermission: true });
    console.log('[ContentFlow] Push registration result:', result.status);
    return result;
  }, [client]);

  const unregisterPushHandler = useCallback(async () => {
    if (!client) return;
    await unregisterExpoPush(client);
  }, [client]);

  const getSlotContent = useCallback((slotId: string): BlockContent | null => {
    return content[slotId] || null;
  }, [content]);

  const getBlock = useCallback((key: string): CFBlock | undefined => {
    if (!client) return undefined;
    return client.getBlock(key);
  }, [client]);

  const reset = useCallback(async () => {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    setDeviceId(null);
    setUserIdState(null);
    setConsentState({});
    setContent({});

    if (client) {
      await client.logout();
    }
  }, [client]);

  const logout = useCallback(async () => {
    if (!client) return;
    await client.logout();
    setUserIdState(null);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_ID);
  }, [client]);

  const setLocale = useCallback(async (locale: string) => {
    if (!client) return;
    await client.setLocale(locale);
  }, [client]);

  const t = useCallback((key: string, fallback?: string): string => {
    if (!client) return fallback || key;
    return client.t(key, fallback);
  }, [client]);

  const flush = useCallback(async () => {
    if (!client) return;
    // The SDK handles flushing internally, but we can force a sync
    await client.sync();
  }, [client]);

  const getIPGeolocation = useCallback(async (): Promise<IPGeolocation | null> => {
    if (!client) return null;
    // IP geolocation would need to be fetched from the SDK's geo endpoint
    // For now, return null as the client method may not be directly exposed
    try {
      const response = await fetch(`${CF_CONFIG.baseUrl}/sdk/v1/geo/ip`, {
        headers: {
          'X-CF-Key': CF_CONFIG.publicKey,
          'X-Tenant-Id': CF_CONFIG.tenantId || '',
        },
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.error('[ContentFlow] IP Geolocation error:', err);
    }
    return null;
  }, [client]);

  const contextValue: ContentFlowContextType = {
    // State
    isReady,
    isInitializing,
    deviceId,
    userId,
    consent,
    content,
    config: CF_CONFIG,
    error,
    liveStatus,

    // Identity
    identify,
    setUserId,
    updateTraits,
    setConsent,

    // Generic track
    trackEvent,

    // Typed events (v2.0)
    commerce,
    engagement,
    identity: identityEvent,
    growth,
    account: accountEvent,
    system: systemEvent,
    location: locationEvent,

    // Identity events
    trackSignUp,
    trackSignIn,

    // Block events
    trackImpression,
    trackTap,

    // Content
    sync,
    getSlotContent,
    getBlock,

    // Push
    registerPush: registerPushHandler,
    unregisterPush: unregisterPushHandler,

    // Geolocation
    getIPGeolocation,

    // Lifecycle
    flush,
    reset,
    logout,

    // Localization
    setLocale,
    t,
  };

  return (
    <ContentFlowContext.Provider value={contextValue}>
      {children}
    </ContentFlowContext.Provider>
  );
}

// Main provider that wraps CFSDKProvider
export function ContentFlowProvider({ children }: { children: ReactNode }) {
  return (
    <CFSDKProvider config={CF_CONFIG}>
      <ContentFlowInner>{children}</ContentFlowInner>
    </CFSDKProvider>
  );
}

export function useContentFlow() {
  const context = useContext(ContentFlowContext);
  if (!context) throw new Error('useContentFlow must be used within ContentFlowProvider');
  return context;
}

// Re-export SDK hooks for direct usage
export { useCFBlock, useCFBlocks, useLiveStatus } from '@contentflow/sdk/react-native';

// Re-export types
export type { CFBlock, CFConfig, CFLiveStatus };
