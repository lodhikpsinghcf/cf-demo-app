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

  // Methods
  identify: (userId?: string, traits?: UserTraits) => Promise<void>;
  setUserId: (userId: string) => Promise<void>;
  updateTraits: (traits: UserTraits) => Promise<void>;
  setConsent: (options: ConsentOptions) => Promise<void>;
  trackEvent: (eventType: string, data?: Record<string, any>) => void;
  trackSignUp: (userId: string, traits?: UserTraits) => void;
  trackSignIn: (userId: string) => void;
  trackImpression: (block: CFBlock | BlockContent) => void;
  trackTap: (block: CFBlock | BlockContent) => void;
  sync: () => Promise<void>;
  registerPush: () => Promise<any>;
  unregisterPush: () => Promise<void>;
  getSlotContent: (slotId: string) => BlockContent | null;
  getBlock: (key: string) => CFBlock | undefined;
  reset: () => Promise<void>;
  logout: () => Promise<void>;
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

  const contextValue: ContentFlowContextType = {
    isReady,
    isInitializing,
    deviceId,
    userId,
    consent,
    content,
    config: CF_CONFIG,
    error,
    liveStatus,
    identify,
    setUserId,
    updateTraits,
    setConsent,
    trackEvent,
    trackSignUp,
    trackSignIn,
    trackImpression,
    trackTap,
    sync,
    registerPush: registerPushHandler,
    unregisterPush: unregisterPushHandler,
    getSlotContent,
    getBlock,
    reset,
    logout,
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
