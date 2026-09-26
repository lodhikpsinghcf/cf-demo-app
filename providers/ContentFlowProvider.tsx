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
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

// SDK Configuration from environment variables
const CF_CONFIG: CFConfig = {
  baseUrl: process.env.EXPO_PUBLIC_CF_BASE_URL || 'https://api.contentflow.click',
  tenantId: process.env.EXPO_PUBLIC_CF_TENANT_ID || '',
  publicKey: process.env.EXPO_PUBLIC_CF_SDK_KEY || '',
  consent: true,
  debug: __DEV__,
};

// Simplified config for CFSDKProvider
const CF_SDK_CONFIG: CFConfig = {
  ...CF_CONFIG,
  // Event batching config
  eventBatchSize: 10,      // Batch up to 10 events before sending
  eventFlushMs: 15000,     // Flush every 15 seconds
  enableOfflineQueue: true,
  maxOfflineQueueSize: 100,
  // Event delivery callbacks
  onEventsDropped: (info: any) => {
    console.log('[ContentFlow] Events DROPPED:', {
      accepted: info.accepted,
      dropped: info.dropped,
      reason: info.reason,
      source: info.source,
    });
  },
  onEventsUncertain: (info: any) => {
    console.log('[ContentFlow] Events UNCERTAIN:', {
      status: info.status,
      reason: info.reason,
      eventCount: info.events?.length,
    });
  },
} as CFConfig;

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
  instanceId?: string;
  screen?: string;
  type: string;
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

  // Content (blocks)
  sync: () => Promise<void>;
  getBlockContent: (key: string) => BlockContent | null;
  getBlock: (key: string) => CFBlock | undefined;
  getScreenBlocks: (screen: string) => CFBlock[];
  getAllBlocks: () => CFBlock[];

  // Block Registration (cards-as-code)

  // Push
  registerPush: () => Promise<any>;
  unregisterPush: () => Promise<void>;

  // Geolocation
  getIPGeolocation: () => Promise<IPGeolocation | null>;
  startLocationTracking: () => Promise<boolean>;
  stopLocationTracking: () => void;
  getCurrentLocation: () => Promise<{ lat: number; lng: number } | null>;
  isTrackingLocation: boolean;

  // Lifecycle
  flush: () => Promise<void>;
  reset: () => Promise<void>;
  logout: () => Promise<void>;

  // Localization
  setLocale: (locale: string) => Promise<void>;
  t: (key: string, fallback?: string) => string;
  fetchStrings: (locale?: string) => Promise<Record<string, string> | null>;
  currentLocale: string;
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
  const [isTrackingLocation, setIsTrackingLocation] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('en');
  const [strings, setStrings] = useState<Record<string, string>>({});

  const initialized = useRef(false);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  // Convert CFBlock to BlockContent
  const blockToContent = useCallback((block: CFBlock): BlockContent => {
    // Fields are registered with plain tags ("title"), but block.get() only looks up "#title".
    // Empty strings (unfilled seeded fields) count as absent so slot placeholders still show.
    const read = (b: CFBlock, tag: string): any => {
      const raw = b.values?.[tag] ?? b.get(tag);
      return raw === '' || raw === null ? undefined : raw;
    };
    const v = (tag: string) => read(block, tag);
    const toItem = (item: CFBlock) => ({
      title: item.title || read(item, 'title'),
      subtitle: read(item, 'subtitle'),
      imageUrl: item.imageUrl || read(item, 'image'),
      icon: read(item, 'icon'),
      url: read(item, 'url'),
    });
    const collection = block.getCollection?.('items');

    const cta = v('cta') as { label?: string; url?: string } | undefined;
    const ctaLabel = cta?.label || block.ctaLabel || v('cta_label');
    const ctaUrl = cta?.url || v('cta_url') || '';
    return {
      key: block.key,
      instanceId: block.instanceId,
      screen: block.screen,
      type: v('type') || 'default',
      title: block.title || v('title'),
      subtitle: v('subtitle'),
      description: block.body || v('description') || v('body'),
      imageUrl: block.imageUrl || v('image') || v('imageUrl') || v('image_url'),
      icon: v('icon'),
      backgroundColor: v('backgroundColor') || v('background_color'),
      gradientEnd: v('gradientEnd') || v('gradient_end'),
      badge: v('badge'),
      value: v('value'),
      cta: ctaLabel ? { label: ctaLabel, url: ctaUrl } : undefined,
      items: collection?.length ? collection.map(toItem) : v('items'),
    };
  }, []);

  // Initialize SDK when client is available
  useEffect(() => {
    if (initialized.current || !client) return;
    initialized.current = true;

    async function init() {
      try {
        setIsInitializing(true);
        console.log('[ContentFlow] Starting SDK initialization...');
        console.log('[ContentFlow] Config:', {
          baseUrl: CF_CONFIG.baseUrl,
          tenantId: CF_CONFIG.tenantId,
          publicKey: CF_CONFIG.publicKey ? `${CF_CONFIG.publicKey.slice(0, 20)}...` : 'MISSING',
        });

        // Load stored user ID
        const storedUserId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
        if (storedUserId) {
          console.log('[ContentFlow] Restoring user ID:', storedUserId);
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
        console.log('[ContentFlow] Calling identify...');
        const receipt = await client.identify();
        console.log('[ContentFlow] Identify response:', receipt);
        if (receipt) {
          const newDeviceId = client.cfg?.deviceId || null;
          console.log('[ContentFlow] Device ID:', newDeviceId);
          setDeviceId(newDeviceId);

          // Enable analytics consent based on server response or default to true
          if (receipt.consent !== false) {
            console.log('[ContentFlow] Enabling analytics consent');
            await client.setConsent(true);
          }
        }

        // Start live updates
        console.log('[ContentFlow] Starting live updates...');
        await client.start();

        // Get initial content (blocks keyed by block.key)
        console.log('[ContentFlow] Syncing blocks...');
        const blocks = await client.sync();
        if (blocks) {
          const contentMap: Record<string, BlockContent> = {};
          for (const block of blocks) {
            contentMap[block.key] = blockToContent(block);
          }
          setContent(contentMap);
          console.log(`[ContentFlow] Synced ${blocks.length} blocks:`, blocks.map(b => b.key));
        } else {
          console.log('[ContentFlow] No blocks returned from sync');
        }

        // Fetch initial strings for default locale
        console.log('[ContentFlow] Fetching initial strings...');
        try {
          const apiBase = CF_CONFIG.baseUrl || 'https://api.contentflow.click/sdk/v1';
          const stringsResponse = await fetch(`${apiBase}/strings?locale=en`, {
            method: 'GET',
            headers: {
              'X-CF-Key': CF_CONFIG.publicKey,
              'X-Tenant-Id': CF_CONFIG.tenantId || '',
            },
          });
          const stringsResult = await stringsResponse.json();
          if (stringsResponse.ok && stringsResult.data?.strings) {
            setStrings(stringsResult.data.strings);
            console.log('[ContentFlow] Loaded', Object.keys(stringsResult.data.strings).length, 'strings');
          }
        } catch (stringsErr) {
          console.log('[ContentFlow] Strings fetch skipped:', stringsErr);
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
    if (!client || !isReady) {
      console.log('[ContentFlow] trackEvent: device not identified yet');
      return;
    }
    console.log('[ContentFlow] Tracking event:', eventType, data);
    client.track(eventType, { key: eventType, ...data });
  }, [client, isReady]);

  // Typed event methods (v2.0)
  const commerce = useCallback((event: CommerceEvent) => {
    if (!client || !isReady) return;
    const eventType = `commerce:${event.action}`;
    console.log('[ContentFlow] Track commerce:', eventType);
    client.track(eventType, { key: eventType, ...event });
  }, [client, isReady]);

  const engagement = useCallback((event: EngagementEvent) => {
    if (!client || !isReady) return;
    const eventType = `engagement:${event.action}`;
    console.log('[ContentFlow] Track engagement:', eventType);
    client.track(eventType, { key: eventType, ...event });
  }, [client, isReady]);

  const identityEvent = useCallback((event: IdentityEvent) => {
    if (!client || !isReady) return;
    client.track(`identity:${event.action}`, { key: `identity:${event.action}`, ...event });
  }, [client, isReady]);

  const growth = useCallback((event: GrowthEvent) => {
    if (!client || !isReady) return;
    client.track(`growth:${event.action}`, { key: `growth:${event.action}`, ...event });
  }, [client, isReady]);

  const accountEvent = useCallback((event: AccountEvent) => {
    if (!client || !isReady) return;
    client.track(`account:${event.action}`, { key: `account:${event.action}`, ...event });
  }, [client, isReady]);

  const systemEvent = useCallback((event: SystemEvent) => {
    if (!client || !isReady) return;
    client.track(`system:${event.action}`, { key: `system:${event.action}`, ...event });
  }, [client, isReady]);

  const locationEvent = useCallback((event: LocationEvent) => {
    if (!client || !isReady) return;
    client.track(`location:${event.action}`, { key: `location:${event.action}`, ...event });
  }, [client, isReady]);

  const trackSignUp = useCallback(async (newUserId: string, traits?: UserTraits) => {
    if (!client) return;
    await setUserId(newUserId);

    // newUserId is typically the email
    const signUpData = {
      username: newUserId,
      fullName: traits?.name as string,
      email: (traits?.email as string) || newUserId, // fallback to userId if email not in traits
      phone: traits?.phone as string,
    };

    console.log('[ContentFlow] trackSignUp data:', signUpData);
    await client.trackSignUp(signUpData);

    // Also track as identity event for unified tracking
    client.track('identity:sign_up', {
      key: 'sign_up',
      screen: 'sign_up',
    });
    console.log('[ContentFlow] Tracked sign_up event');
  }, [client, setUserId]);

  const trackSignIn = useCallback(async (existingUserId: string) => {
    if (!client) return;
    await setUserId(existingUserId);

    const signInData = {
      username: existingUserId,
      email: existingUserId, // userId is typically the email
    };

    console.log('[ContentFlow] trackSignIn data:', signInData);
    await client.trackSignIn(signInData);

    // Also track as identity event for unified tracking
    client.track('identity:sign_in', {
      key: 'sign_in',
      screen: 'sign_in',
    });
    console.log('[ContentFlow] Tracked sign_in event');
  }, [client, setUserId]);

  const trackImpression = useCallback((block: CFBlock | BlockContent) => {
    if (!client || !isReady) {
      console.log('[ContentFlow] Skipping impression - device not identified yet');
      return;
    }
    if ('get' in block && typeof block.get === 'function') {
      // Real CFBlock from SDK
      client.trackImpression(block as CFBlock);
      console.log('[ContentFlow] Tracked impression (CFBlock):', block.key);
    } else {
      // BlockContent - use generic tracking
      const content = block as BlockContent;
      client.track('content:impression', {
        key: content.key,
        screen: content.screen,
      });
      console.log('[ContentFlow] Tracked impression (BlockContent):', content.key);
    }
  }, [client, isReady]);

  const trackTap = useCallback((block: CFBlock | BlockContent) => {
    if (!client || !isReady) {
      console.log('[ContentFlow] Skipping tap - device not identified yet');
      return;
    }
    if ('get' in block && typeof block.get === 'function') {
      // Real CFBlock from SDK
      client.trackTap(block as CFBlock);
      console.log('[ContentFlow] Tracked tap (CFBlock):', block.key);
    } else {
      // BlockContent - use generic tracking
      const content = block as BlockContent;
      client.track('content:tap', {
        key: content.key,
        screen: content.screen,
      });
      console.log('[ContentFlow] Tracked tap (BlockContent):', content.key);
    }
  }, [client, isReady]);

  const sync = useCallback(async () => {
    if (!client) return;

    const blocks = await client.sync();
    if (blocks) {
      const contentMap: Record<string, BlockContent> = {};
      for (const block of blocks) {
        contentMap[block.key] = blockToContent(block);
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

  const getBlockContent = useCallback((key: string): BlockContent | null => {
    return content[key] || null;
  }, [content]);

  const getBlock = useCallback((key: string): CFBlock | undefined => {
    if (!client) return undefined;
    return client.getBlock(key);
  }, [client]);

  const getScreenBlocks = useCallback((screen: string): CFBlock[] => {
    if (!client) return [];
    return client.getBlocks(screen) || [];
  }, [client]);

  const getAllBlocks = useCallback((): CFBlock[] => {
    if (!client) return [];
    // Get all blocks from content map
    return Object.keys(content).map(key => client.getBlock(key)).filter(Boolean) as CFBlock[];
  }, [client, content]);

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

  // Fetch strings from backend
  const fetchStringsInternal = useCallback(async (locale: string): Promise<Record<string, string> | null> => {
    console.log('[ContentFlow] Fetching strings for locale:', locale);

    try {
      const apiBase = CF_CONFIG.baseUrl || 'https://api.contentflow.click/sdk/v1';
      const response = await fetch(`${apiBase}/strings?locale=${locale}`, {
        method: 'GET',
        headers: {
          'X-CF-Key': CF_CONFIG.publicKey,
          'X-Tenant-Id': CF_CONFIG.tenantId || '',
        },
      });

      const result = await response.json();
      console.log('[ContentFlow] Strings response:', response.status, JSON.stringify(result).slice(0, 500));

      if (response.ok && result.data?.strings) {
        return result.data.strings;
      }
      return null;
    } catch (err) {
      console.error('[ContentFlow] Fetch strings error:', err);
      return null;
    }
  }, []);

  const setLocale = useCallback(async (locale: string) => {
    if (!client) return;
    console.log('[ContentFlow] Setting locale to:', locale);
    setCurrentLocale(locale);

    // Clear previous strings cache immediately
    setStrings({});

    // Notify SDK of locale change
    await client.setLocale(locale);

    // Fetch strings from backend and cache locally
    const fetchedStrings = await fetchStringsInternal(locale);
    // Always update strings - use fetched or empty object
    setStrings(fetchedStrings || {});
    console.log('[ContentFlow] Cached', Object.keys(fetchedStrings || {}).length, 'strings for locale:', locale);

    // Track locale change event
    if (isReady) {
      client.track('content:locale_change', {
        key: 'locale_change',
        screen: locale,
      });
      console.log('[ContentFlow] Tracked locale change event for:', locale);
    }
  }, [client, isReady, fetchStringsInternal]);

  // Translation function with tracking
  const t = useCallback((key: string, fallback?: string): string => {
    // First check local strings cache
    if (strings[key]) {
      // Track string impression
      if (client && isReady) {
        client.track('content:string_impression', {
          key: key,
          screen: currentLocale,
        });
      }
      console.log(`[ContentFlow] t('${key}') = '${strings[key]}' (from cache)`);
      return strings[key];
    }

    // Fallback to SDK's t() function
    if (client) {
      const value = client.t(key, fallback);
      if (value !== fallback && value !== key) {
        console.log(`[ContentFlow] t('${key}') = '${value}' (from SDK)`);
        return value;
      }
    }

    return fallback || key;
  }, [client, isReady, strings, currentLocale]);

  // Public fetchStrings that also updates state
  const fetchStrings = useCallback(async (locale?: string): Promise<Record<string, string> | null> => {
    const targetLocale = locale || currentLocale;
    const fetchedStrings = await fetchStringsInternal(targetLocale);
    if (fetchedStrings) {
      setStrings(fetchedStrings);
    }
    return fetchedStrings;
  }, [currentLocale, fetchStringsInternal]);

  const flush = useCallback(async () => {
    if (!client) return;
    console.log('[ContentFlow] Flushing events...');
    // Flush the event queue
    if (typeof (client as any).flush === 'function') {
      await (client as any).flush();
      console.log('[ContentFlow] Events flushed successfully');
    } else {
      await client.sync();
      console.log('[ContentFlow] Sync completed (includes event flush)');
    }
  }, [client]);

  const getIPGeolocation = useCallback(async (): Promise<IPGeolocation | null> => {
    if (!client) return null;
    // IP geolocation would need to be fetched from the SDK's geo endpoint
    // For now, return null as the client method may not be directly exposed
    try {
      const response = await fetch(`${CF_CONFIG.baseUrl}/geo/ip`, {
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

  const getCurrentLocation = useCallback(async (): Promise<{ lat: number; lng: number } | null> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('[ContentFlow] Location permission denied');
        return null;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      return {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
    } catch (err) {
      console.error('[ContentFlow] Get location error:', err);
      return null;
    }
  }, []);

  const startLocationTracking = useCallback(async (): Promise<boolean> => {
    if (!client || isTrackingLocation) return false;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('[ContentFlow] Location permission denied');
        locationEvent({
          action: 'location_permission',
          permissionStatus: 'denied',
        });
        return false;
      }

      locationEvent({
        action: 'location_permission',
        permissionStatus: 'granted',
      });

      console.log('[ContentFlow] Starting location tracking...');

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 50, // meters
          timeInterval: 30000, // 30 seconds
        },
        (location) => {
          console.log('[ContentFlow] Location update:', location.coords.latitude, location.coords.longitude);
          locationEvent({
            action: 'location_update',
            lat: location.coords.latitude,
            lng: location.coords.longitude,
            accuracy: location.coords.accuracy || undefined,
            source: 'gps',
          });
        }
      );

      setIsTrackingLocation(true);
      return true;
    } catch (err) {
      console.error('[ContentFlow] Start location tracking error:', err);
      return false;
    }
  }, [client, isTrackingLocation, locationEvent]);

  const stopLocationTracking = useCallback(() => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
      setIsTrackingLocation(false);
      console.log('[ContentFlow] Location tracking stopped');
    }
  }, []);

  // Cleanup location tracking on unmount
  useEffect(() => {
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

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

    // Content (blocks)
    sync,
    getBlockContent,
    getBlock,
    getScreenBlocks,
    getAllBlocks,

    // Block registration (cards-as-code)

    // Push
    registerPush: registerPushHandler,
    unregisterPush: unregisterPushHandler,

    // Geolocation
    getIPGeolocation,
    startLocationTracking,
    stopLocationTracking,
    getCurrentLocation,
    isTrackingLocation,

    // Lifecycle
    flush,
    reset,
    logout,

    // Localization
    setLocale,
    t,
    fetchStrings,
    currentLocale,
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
