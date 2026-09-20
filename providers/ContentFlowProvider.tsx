import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import * as Device from 'expo-device';

// ContentFlow SDK configuration from environment variables
const CF_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_CF_BASE_URL || 'https://api.contentflow.click',
  tenantId: process.env.EXPO_PUBLIC_CF_TENANT_ID || '',
  sdkKey: process.env.EXPO_PUBLIC_CF_SDK_KEY || '',
  writeKey: process.env.EXPO_PUBLIC_CF_WRITE_KEY || '',
  readKey: process.env.EXPO_PUBLIC_CF_READ_KEY || '',
  appName: process.env.EXPO_PUBLIC_APP_NAME || 'CF Demo',
  appVersion: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
};

interface ContentFlowConfig {
  baseUrl: string;
  tenantId: string;
  sdkKey: string;
  writeKey: string;
  readKey: string;
  appName: string;
  appVersion: string;
}

interface ContentFlowContextType {
  isReady: boolean;
  deviceId: string | null;
  userId: string | null;
  consent: boolean;
  content: Record<string, any>;
  config: ContentFlowConfig;
  setUserId: (id: string) => Promise<void>;
  setConsent: (granted: boolean) => Promise<void>;
  trackEvent: (event: string, data?: Record<string, any>) => void;
  sync: () => Promise<void>;
  getSlotContent: (slotId: string) => any | null;
}

const ContentFlowContext = createContext<ContentFlowContextType | null>(null);

// Generate a unique device ID
function generateDeviceId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = 'cf-';
  for (let i = 0; i < 24; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export function ContentFlowProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [userId, setUserIdState] = useState<string | null>(null);
  const [consent, setConsentState] = useState(false);
  const [content, setContent] = useState<Record<string, any>>({});

  // Initialize SDK
  useEffect(() => {
    async function init() {
      try {
        // Generate or retrieve device ID
        const id = generateDeviceId();
        setDeviceId(id);

        // Call identify endpoint
        const response = await fetch(`${CF_CONFIG.baseUrl}/sdk/v1/identify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CF-Key': CF_CONFIG.sdkKey,
          },
          body: JSON.stringify({
            deviceId: id,
            platform: Device.osName?.toLowerCase() || 'unknown',
            osVersion: Device.osVersion || 'unknown',
            appVersion: CF_CONFIG.appVersion,
            deviceModel: Device.modelName || 'unknown',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('[ContentFlow] Identified:', data);
          setConsentState(data.data?.consent || false);
          setIsReady(true);
        } else {
          console.warn('[ContentFlow] Identify failed:', response.status);
          setIsReady(true); // Still mark as ready for offline mode
        }
      } catch (error) {
        console.error('[ContentFlow] Init error:', error);
        setIsReady(true); // Offline mode
      }
    }

    init();
  }, []);

  // Set user ID
  const setUserId = useCallback(async (id: string) => {
    setUserIdState(id);
    if (!deviceId) return;

    try {
      await fetch(`${CF_CONFIG.baseUrl}/sdk/v1/identify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CF-Key': CF_CONFIG.sdkKey,
        },
        body: JSON.stringify({
          deviceId,
          userId: id,
        }),
      });
      console.log('[ContentFlow] User ID set:', id);
    } catch (error) {
      console.error('[ContentFlow] Set user ID error:', error);
    }
  }, [deviceId]);

  // Set consent
  const setConsent = useCallback(async (granted: boolean) => {
    setConsentState(granted);
    if (!deviceId) return;

    try {
      await fetch(`${CF_CONFIG.baseUrl}/sdk/v1/consent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CF-Key': CF_CONFIG.sdkKey,
        },
        body: JSON.stringify({
          deviceId,
          consent: {
            marketing: granted,
            push: granted,
          },
        }),
      });
      console.log('[ContentFlow] Consent set:', granted);
    } catch (error) {
      console.error('[ContentFlow] Set consent error:', error);
    }
  }, [deviceId]);

  // Track event
  const trackEvent = useCallback((event: string, data?: Record<string, any>) => {
    if (!deviceId || !consent) {
      console.log('[ContentFlow] Event skipped (no consent):', event);
      return;
    }

    fetch(`${CF_CONFIG.baseUrl}/sdk/v1/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CF-Key': CF_CONFIG.sdkKey,
      },
      body: JSON.stringify({
        deviceId,
        events: [{
          type: event,
          timestamp: new Date().toISOString(),
          custom: data,
        }],
      }),
    }).then(() => {
      console.log('[ContentFlow] Event tracked:', event);
    }).catch((error) => {
      console.error('[ContentFlow] Track event error:', error);
    });
  }, [deviceId, consent]);

  // Sync content
  const sync = useCallback(async () => {
    if (!deviceId) return;

    try {
      const response = await fetch(`${CF_CONFIG.baseUrl}/sdk/v1/sync`, {
        method: 'GET',
        headers: {
          'X-CF-Key': CF_CONFIG.sdkKey,
          'X-CF-Device-Id': deviceId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[ContentFlow] Synced:', data);

        // Store content by slot
        const contentMap: Record<string, any> = {};
        if (data.data?.blocks) {
          for (const block of data.data.blocks) {
            if (block.slotId) {
              contentMap[block.slotId] = block;
            }
          }
        }
        setContent(contentMap);
      }
    } catch (error) {
      console.error('[ContentFlow] Sync error:', error);
    }
  }, [deviceId]);

  // Get content for a slot
  const getSlotContent = useCallback((slotId: string) => {
    return content[slotId] || null;
  }, [content]);

  // Auto-sync on mount
  useEffect(() => {
    if (isReady && deviceId) {
      sync();
    }
  }, [isReady, deviceId, sync]);

  return (
    <ContentFlowContext.Provider
      value={{
        isReady,
        deviceId,
        userId,
        consent,
        content,
        config: CF_CONFIG,
        setUserId,
        setConsent,
        trackEvent,
        sync,
        getSlotContent,
      }}
    >
      {children}
    </ContentFlowContext.Provider>
  );
}

export function useContentFlow() {
  const context = useContext(ContentFlowContext);
  if (!context) {
    throw new Error('useContentFlow must be used within ContentFlowProvider');
  }
  return context;
}
