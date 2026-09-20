/**
 * ContentFlow SDK Provider
 *
 * Production-ready SDK integration for React Native / Expo apps.
 * Provides device identification, event tracking, consent management,
 * and dynamic content delivery.
 *
 * Usage:
 *   import { useContentFlow } from './providers/ContentFlowProvider';
 *   const { identify, trackEvent, sync } = useContentFlow();
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from 'react';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

// SDK Configuration from environment variables
const CF_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_CF_BASE_URL || 'https://api.contentflow.click',
  tenantId: process.env.EXPO_PUBLIC_CF_TENANT_ID || '',
  sdkKey: process.env.EXPO_PUBLIC_CF_SDK_KEY || '',
  writeKey: process.env.EXPO_PUBLIC_CF_WRITE_KEY || '',
  readKey: process.env.EXPO_PUBLIC_CF_READ_KEY || '',
  appName: process.env.EXPO_PUBLIC_APP_NAME || 'CF Demo',
  appVersion: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
};

// Storage keys
const STORAGE_KEYS = {
  DEVICE_ID: '@cf_device_id',
  USER_ID: '@cf_user_id',
  CONSENT: '@cf_consent',
};

// Types
interface ContentFlowConfig {
  baseUrl: string;
  tenantId: string;
  sdkKey: string;
  writeKey: string;
  readKey: string;
  appName: string;
  appVersion: string;
}

interface ConsentOptions {
  marketing?: boolean;
  push?: boolean;
  sms?: boolean;
  email?: boolean;
  locationTracking?: boolean;
}

interface UserTraits {
  [key: string]: string | number | boolean | undefined;
}

interface BlockContent {
  key: string;
  type: string;
  slotId?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  cta?: { label: string; url: string };
  [key: string]: any;
}

interface ContentFlowContextType {
  isReady: boolean;
  isInitializing: boolean;
  deviceId: string | null;
  userId: string | null;
  consent: ConsentOptions;
  content: Record<string, BlockContent>;
  config: ContentFlowConfig;
  error: string | null;
  identify: (userId?: string, traits?: UserTraits) => Promise<void>;
  setUserId: (userId: string) => Promise<void>;
  updateTraits: (traits: UserTraits) => Promise<void>;
  setConsent: (options: ConsentOptions) => Promise<void>;
  trackEvent: (eventType: string, data?: Record<string, any>) => void;
  trackSignUp: (userId: string, traits?: UserTraits) => void;
  trackSignIn: (userId: string) => void;
  sync: () => Promise<void>;
  registerPush: (token: string) => Promise<void>;
  getSlotContent: (slotId: string) => BlockContent | null;
  reset: () => Promise<void>;
}

const ContentFlowContext = createContext<ContentFlowContextType | null>(null);

function generateDeviceId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function apiCall(
  method: 'GET' | 'POST',
  endpoint: string,
  body?: any,
  headers?: Record<string, string>
): Promise<any> {
  const url = `${CF_CONFIG.baseUrl}${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-CF-Key': CF_CONFIG.sdkKey,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return response.json();
}

export function ContentFlowProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [userId, setUserIdState] = useState<string | null>(null);
  const [consent, setConsentState] = useState<ConsentOptions>({});
  const [content, setContent] = useState<Record<string, BlockContent>>({});
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function init() {
      try {
        setIsInitializing(true);
        let storedDeviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
        if (!storedDeviceId) {
          storedDeviceId = generateDeviceId();
          await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, storedDeviceId);
        }
        setDeviceId(storedDeviceId);

        const storedUserId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
        if (storedUserId) setUserIdState(storedUserId);

        const storedConsent = await AsyncStorage.getItem(STORAGE_KEYS.CONSENT);
        if (storedConsent) setConsentState(JSON.parse(storedConsent));

        const response = await apiCall('POST', '/sdk/v1/identify', {
          deviceId: storedDeviceId,
          userId: storedUserId || undefined,
          platform: Device.osName?.toLowerCase() || 'unknown',
          osVersion: Device.osVersion || 'unknown',
          appVersion: CF_CONFIG.appVersion,
          deviceModel: Device.modelName || 'unknown',
        });

        if (response.success) {
          console.log('[ContentFlow] Initialized');
          if (response.data?.consent !== undefined) {
            setConsentState(prev => ({ ...prev, marketing: response.data.consent }));
          }
        }
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
  }, []);

  const identify = useCallback(async (newUserId?: string, traits?: UserTraits) => {
    if (!deviceId) return;
    if (newUserId) {
      setUserIdState(newUserId);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, newUserId);
    }
    await apiCall('POST', '/sdk/v1/identify', { deviceId, userId: newUserId || userId, traits });
  }, [deviceId, userId]);

  const setUserId = useCallback(async (id: string) => identify(id), [identify]);
  const updateTraits = useCallback(async (traits: UserTraits) => identify(undefined, traits), [identify]);

  const setConsent = useCallback(async (options: ConsentOptions) => {
    const newConsent = { ...consent, ...options };
    setConsentState(newConsent);
    await AsyncStorage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(newConsent));
    if (deviceId) await apiCall('POST', '/sdk/v1/consent', { deviceId, consent: options });
  }, [deviceId, consent]);

  const trackEvent = useCallback((eventType: string, data?: Record<string, any>) => {
    if (!deviceId) return;
    apiCall('POST', '/sdk/v1/events', {
      deviceId, userId,
      events: [{ type: eventType, timestamp: new Date().toISOString(), custom: data }],
    }).catch(console.error);
  }, [deviceId, userId]);

  const trackSignUp = useCallback((newUserId: string, traits?: UserTraits) => {
    setUserId(newUserId);
    trackEvent('sign_up', { userId: newUserId, ...traits });
  }, [setUserId, trackEvent]);

  const trackSignIn = useCallback((existingUserId: string) => {
    setUserId(existingUserId);
    trackEvent('sign_in', { userId: existingUserId });
  }, [setUserId, trackEvent]);

  const sync = useCallback(async () => {
    if (!deviceId) return;
    try {
      const response = await apiCall('GET', '/sdk/v1/sync', undefined, { 'X-CF-Device-Id': deviceId });
      if (response.success && response.data?.blocks) {
        const contentMap: Record<string, BlockContent> = {};
        for (const block of response.data.blocks) {
          if (block.slotId) contentMap[block.slotId] = block;
          if (block.key) contentMap[block.key] = block;
        }
        setContent(contentMap);
      }
    } catch (err) { console.error('[ContentFlow] Sync error:', err); }
  }, [deviceId]);

  const registerPush = useCallback(async (token: string) => {
    if (!deviceId) return;
    await apiCall('POST', '/sdk/v1/register-push', {
      deviceId, userId, token,
      platform: Device.osName?.toLowerCase() === 'ios' ? 'ios' : 'android',
    });
  }, [deviceId, userId]);

  const getSlotContent = useCallback((slotId: string) => content[slotId] || null, [content]);

  const reset = useCallback(async () => {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    setDeviceId(null); setUserIdState(null); setConsentState({}); setContent({});
    initialized.current = false;
  }, []);

  useEffect(() => { if (isReady && deviceId) sync(); }, [isReady, deviceId, sync]);

  return (
    <ContentFlowContext.Provider value={{
      isReady, isInitializing, deviceId, userId, consent, content, config: CF_CONFIG, error,
      identify, setUserId, updateTraits, setConsent, trackEvent, trackSignUp, trackSignIn,
      sync, registerPush, getSlotContent, reset,
    }}>
      {children}
    </ContentFlowContext.Provider>
  );
}

export function useContentFlow() {
  const context = useContext(ContentFlowContext);
  if (!context) throw new Error('useContentFlow must be used within ContentFlowProvider');
  return context;
}

export type { ContentFlowConfig, ConsentOptions, UserTraits, BlockContent, ContentFlowContextType };
