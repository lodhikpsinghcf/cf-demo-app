/**
 * Polyfills for React Native
 * Required by @contentflow/sdk for secure storage and offline queue
 */

import * as ExpoCrypto from 'expo-crypto';
import NetInfo from '@react-native-community/netinfo';

// Polyfill window.addEventListener for online/offline events using NetInfo
type NetworkListener = () => void;
const networkListeners: { online: NetworkListener[]; offline: NetworkListener[] } = {
  online: [],
  offline: [],
};

let netInfoUnsubscribe: (() => void) | null = null;
let lastIsConnected = true;

function setupNetInfoListener() {
  if (netInfoUnsubscribe) return;

  netInfoUnsubscribe = NetInfo.addEventListener((state) => {
    const isConnected = state.isConnected ?? false;
    if (isConnected !== lastIsConnected) {
      lastIsConnected = isConnected;
      const listeners = isConnected ? networkListeners.online : networkListeners.offline;
      listeners.forEach((listener) => {
        try {
          listener();
        } catch (e) {
          console.error('[Polyfill] Network listener error:', e);
        }
      });
    }
  });
}

// Polyfill window for SDK's online/offline event handling
if (typeof window === 'undefined') {
  (global as any).window = {};
}

const originalAddEventListener = (global as any).window.addEventListener;
(global as any).window.addEventListener = (
  type: string,
  listener: EventListener,
  options?: boolean | AddEventListenerOptions
) => {
  if (type === 'online' || type === 'offline') {
    networkListeners[type].push(listener as NetworkListener);
    setupNetInfoListener();
    return;
  }
  if (originalAddEventListener) {
    return originalAddEventListener.call((global as any).window, type, listener, options);
  }
};

const originalRemoveEventListener = (global as any).window.removeEventListener;
(global as any).window.removeEventListener = (
  type: string,
  listener: EventListener,
  options?: boolean | EventListenerOptions
) => {
  if (type === 'online' || type === 'offline') {
    const listeners = networkListeners[type];
    const index = listeners.indexOf(listener as NetworkListener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
    return;
  }
  if (originalRemoveEventListener) {
    return originalRemoveEventListener.call((global as any).window, type, listener, options);
  }
};

// Polyfill crypto.subtle for SHA-256
if (typeof global.crypto === 'undefined') {
  (global as any).crypto = {};
}

if (typeof global.crypto.subtle === 'undefined') {
  (global as any).crypto.subtle = {
    async digest(algorithm: string, data: ArrayBuffer): Promise<ArrayBuffer> {
      if (algorithm === 'SHA-256' || algorithm === 'sha-256') {
        const uint8Array = new Uint8Array(data);
        const hexString = await ExpoCrypto.digestStringAsync(
          ExpoCrypto.CryptoDigestAlgorithm.SHA256,
          Array.from(uint8Array).map(b => String.fromCharCode(b)).join(''),
          { encoding: ExpoCrypto.CryptoEncoding.HEX }
        );
        // Convert hex string to ArrayBuffer
        const bytes = new Uint8Array(hexString.length / 2);
        for (let i = 0; i < hexString.length; i += 2) {
          bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
        }
        return bytes.buffer;
      }
      throw new Error(`Unsupported algorithm: ${algorithm}`);
    },
  };
}

// Polyfill crypto.getRandomValues
if (typeof global.crypto.getRandomValues === 'undefined') {
  (global as any).crypto.getRandomValues = (array: Uint8Array): Uint8Array => {
    const randomBytes = ExpoCrypto.getRandomBytes(array.length);
    array.set(randomBytes);
    return array;
  };
}

export {};
