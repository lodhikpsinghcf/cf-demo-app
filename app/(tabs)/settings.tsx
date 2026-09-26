import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, TextInput, Modal } from 'react-native';
import { useState } from 'react';
import { useContentFlow } from '../../providers/ContentFlowProvider';

export default function SettingsScreen() {
  const {
    deviceId,
    userId,
    consent,
    setConsent,
    setUserId,
    registerPush,
    unregisterPush,
    isReady,
    sync,
    trackEvent,
    config,
    reset,
    liveStatus,
    startLocationTracking,
    stopLocationTracking,
    getCurrentLocation,
    isTrackingLocation,
    flush,
    setLocale,
    t,
    fetchStrings,
    currentLocale,
  } = useContentFlow();

  const [showUserIdModal, setShowUserIdModal] = useState(false);
  const [pushStatus, setPushStatus] = useState('Not registered');
  const [userIdInput, setUserIdInput] = useState('');

  const isOnline = liveStatus?.isOnline ?? false;

  const handleConsentToggle = async (key: 'marketing' | 'push' | 'sms' | 'email' | 'locationTracking', value: boolean) => {
    await setConsent({ [key]: value });
    if (key === 'push') {
      if (value) {
        await enablePush();
      } else {
        await unregisterPush();
        setPushStatus('Turned off');
      }
    }
  };

  const enablePush = async () => {
    const result = await registerPush();
    switch (result?.status) {
      case 'registered':
        setPushStatus(`✅ Registered (${result.provider})`);
        Alert.alert('Push Registered', `ContentFlow can now send pushes to this device via ${result.provider.toUpperCase()}.\n\nToken: ${result.token.slice(0, 16)}…`);
        break;
      case 'permission_denied':
        setPushStatus('🚫 Permission denied');
        Alert.alert('Notifications Blocked', 'Allow notifications for this app in your phone Settings, then try again.');
        break;
      default: {
        const reason = result?.error?.message || result?.tokenType || result?.status || 'unknown';
        setPushStatus(`⚠️ ${result?.status || 'failed'}`);
        Alert.alert('Push Not Registered', `${reason}\n\nExpo Go can't receive ContentFlow pushes. Use a development build of this app.`);
      }
    }
  };

  const handleEnablePush = async () => {
    await setConsent({ push: true });
    await enablePush();
  };

  const handleSetUserId = () => {
    setUserIdInput(userId || '');
    setShowUserIdModal(true);
  };

  const confirmSetUserId = async () => {
    if (userIdInput.trim()) {
      await setUserId(userIdInput.trim());
      setShowUserIdModal(false);
      Alert.alert('Success', 'User ID updated');
    }
  };

  const handleTestEvent = () => {
    trackEvent('test_event', {
      source: 'settings',
      timestamp: new Date().toISOString(),
    });
    Alert.alert('Event Queued', 'Test event added to queue. Tap "Flush Events" to send immediately.');
  };

  const handleFlushEvents = async () => {
    try {
      await flush();
      Alert.alert('Events Flushed', 'All queued events sent to server. Check console for response.');
    } catch (e) {
      Alert.alert('Flush Failed', String(e));
    }
  };

  const handleSync = async () => {
    try {
      await sync();
      Alert.alert('Sync Complete', 'Content synced from server');
    } catch (e) {
      Alert.alert('Sync Failed', String(e));
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset SDK',
      'This will clear all local data including device ID, user ID, and consent settings. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await reset();
            Alert.alert('Reset Complete', 'SDK data cleared. Restart the app.');
          }
        },
      ]
    );
  };

  const handleToggleLocationTracking = async () => {
    if (isTrackingLocation) {
      stopLocationTracking();
      Alert.alert('Location Tracking', 'Location tracking stopped');
    } else {
      const started = await startLocationTracking();
      if (started) {
        Alert.alert('Location Tracking', 'Location tracking started');
      } else {
        Alert.alert('Location Tracking', 'Failed to start - permission denied?');
      }
    }
  };

  const handleGetCurrentLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      Alert.alert('Current Location', `Lat: ${location.lat.toFixed(6)}\nLng: ${location.lng.toFixed(6)}`);
    } else {
      Alert.alert('Location Error', 'Could not get current location');
    }
  };

  const handleLocaleChange = async (locale: string) => {
    try {
      await setLocale(locale);
      Alert.alert('Locale Changed', `App language set to: ${locale}`);
    } catch (e) {
      Alert.alert('Error', String(e));
    }
  };

  const handleFetchStrings = async () => {
    try {
      const strings = await fetchStrings();
      if (strings) {
        const keys = Object.keys(strings);
        Alert.alert('Strings Fetched', `Got ${keys.length} strings: ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}`);
      } else {
        Alert.alert('No Strings', 'No strings returned for this locale');
      }
    } catch (e) {
      Alert.alert('Error', String(e));
    }
  };

  const locales = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'hi', label: 'हिन्दी' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* SDK Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SDK Status</Text>
        <View style={styles.card}>
          <SettingRow label="Status" value={isReady ? '✅ Connected' : '⏳ Connecting...'} />
          <SettingRow label="Network" value={isOnline ? '🟢 Online' : '🔴 Offline'} />
          <SettingRow label="Live Mode" value={liveStatus?.mode || 'off'} />
          <SettingRow label="Live State" value={liveStatus?.state || 'stopped'} />
          <SettingRow label="Device ID" value={deviceId ? `${deviceId.slice(0, 8)}...${deviceId.slice(-4)}` : 'Generating...'} />
          <SettingRow label="User ID" value={userId || 'Anonymous'} />
          <SettingRow label="Locale" value={currentLocale.toUpperCase()} />
          <SettingRow label="Push" value={pushStatus} />
        </View>
      </View>

      {/* Localization */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Localization</Text>
        <View style={styles.card}>
          <View style={styles.localeRow}>
            {locales.map((loc) => (
              <TouchableOpacity
                key={loc.code}
                style={[
                  styles.localeBtn,
                  currentLocale === loc.code && styles.localeBtnActive,
                ]}
                onPress={() => handleLocaleChange(loc.code)}
              >
                <Text
                  style={[
                    styles.localeBtnText,
                    currentLocale === loc.code && styles.localeBtnTextActive,
                  ]}
                >
                  {loc.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.testKeyRow}>
            <Text style={styles.testKeyLabel}>test.key:</Text>
            <Text style={styles.testKeyValue}>{t('test.key', '(not set)')}</Text>
          </View>
          <View style={styles.testKeyRow}>
            <Text style={styles.testKeyLabel}>test2.key:</Text>
            <Text style={styles.testKeyValue}>{t('test2.key', '(not set)')}</Text>
          </View>
          <TouchableOpacity style={styles.actionRow} onPress={handleFetchStrings}>
            <Text style={styles.actionLabel}>Fetch Strings ({currentLocale})</Text>
            <Text style={styles.actionChevron}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SDK Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SDK Actions</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={handleSetUserId}>
            <Text style={styles.actionLabel}>Set User ID</Text>
            <Text style={styles.actionChevron}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionRow} onPress={handleEnablePush}>
            <Text style={styles.actionLabel}>Enable Push Notifications</Text>
            <Text style={styles.actionChevron}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionRow} onPress={handleTestEvent}>
            <Text style={styles.actionLabel}>Send Test Event</Text>
            <Text style={styles.actionChevron}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionRow} onPress={handleFlushEvents}>
            <Text style={styles.actionLabel}>Flush Events Now</Text>
            <Text style={styles.actionChevron}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionRow} onPress={handleSync}>
            <Text style={styles.actionLabel}>Force Sync Content</Text>
            <Text style={styles.actionChevron}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionRow} onPress={handleGetCurrentLocation}>
            <Text style={styles.actionLabel}>Get Current Location</Text>
            <Text style={styles.actionChevron}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionRow} onPress={handleToggleLocationTracking}>
            <Text style={[styles.actionLabel, isTrackingLocation && { color: '#22c55e' }]}>
              {isTrackingLocation ? '● Stop Location Tracking' : 'Start Location Tracking'}
            </Text>
            <Text style={styles.actionChevron}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Consent & Permissions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consent & Permissions</Text>
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Marketing</Text>
              <Text style={styles.toggleDesc}>Allow personalized content</Text>
            </View>
            <Switch
              value={consent.marketing ?? false}
              onValueChange={(v) => handleConsentToggle('marketing', v)}
              trackColor={{ false: '#ddd', true: '#571FE4' }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Push Notifications</Text>
              <Text style={styles.toggleDesc}>Receive offers and updates</Text>
            </View>
            <Switch
              value={consent.push ?? false}
              onValueChange={(v) => handleConsentToggle('push', v)}
              trackColor={{ false: '#ddd', true: '#571FE4' }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>SMS</Text>
              <Text style={styles.toggleDesc}>Receive SMS messages</Text>
            </View>
            <Switch
              value={consent.sms ?? false}
              onValueChange={(v) => handleConsentToggle('sms', v)}
              trackColor={{ false: '#ddd', true: '#571FE4' }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Email</Text>
              <Text style={styles.toggleDesc}>Receive email campaigns</Text>
            </View>
            <Switch
              value={consent.email ?? false}
              onValueChange={(v) => handleConsentToggle('email', v)}
              trackColor={{ false: '#ddd', true: '#571FE4' }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Location Services</Text>
              <Text style={styles.toggleDesc}>For nearby recommendations</Text>
            </View>
            <Switch
              value={consent.locationTracking ?? false}
              onValueChange={(v) => handleConsentToggle('locationTracking', v)}
              trackColor={{ false: '#ddd', true: '#571FE4' }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Configuration</Text>
        <View style={styles.card}>
          <SettingRow label="App Name" value="CF Demo App" />
          <SettingRow label="SDK Version" value="2.0.0" />
          <SettingRow label="API Endpoint" value={(config.baseUrl || '').replace('https://', '')} />
        </View>
      </View>

      {/* SDK Configuration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SDK Keys</Text>
        <View style={styles.card}>
          <SettingRow label="Tenant ID" value={config.tenantId ? `${config.tenantId.slice(0, 12)}...` : 'Not configured'} />
          <SettingRow label="Public Key" value={config.publicKey ? `${config.publicKey.slice(0, 12)}...` : 'Not configured'} />
        </View>
      </View>

      {/* Debug Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Debug Information</Text>
        <View style={styles.debugCard}>
          <Text style={styles.debugLabel}>Full Device ID</Text>
          <Text style={styles.debugValue} selectable>{deviceId || 'Not assigned'}</Text>
          <Text style={styles.debugLabel}>Full User ID</Text>
          <Text style={styles.debugValue} selectable>{userId || 'Anonymous user'}</Text>
          <Text style={styles.debugLabel}>Tenant ID</Text>
          <Text style={styles.debugValue} selectable>{config.tenantId || 'Not configured'}</Text>
          <Text style={styles.debugLabel}>Public Key</Text>
          <Text style={styles.debugValue} selectable>{config.publicKey || 'Not configured'}</Text>
          <Text style={styles.debugLabel}>API Endpoint</Text>
          <Text style={styles.debugValue} selectable>{config.baseUrl || 'Not configured'}</Text>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.dangerRow} onPress={handleReset}>
            <Text style={styles.dangerLabel}>Reset SDK Data</Text>
            <Text style={styles.dangerDesc}>Clear device ID, user ID, and consent</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />

      {/* User ID Modal */}
      <Modal visible={showUserIdModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set User ID</Text>
            <Text style={styles.modalSubtitle}>Enter a unique identifier for this user</Text>
            <TextInput
              style={styles.modalInput}
              value={userIdInput}
              onChangeText={setUserIdInput}
              placeholder="e.g. user_12345"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowUserIdModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={confirmSetUserId}>
                <Text style={styles.modalConfirmText}>Set ID</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Text style={styles.settingValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  section: { marginTop: 24 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    marginHorizontal: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  settingLabel: { fontSize: 15, color: '#333', flex: 1 },
  settingValue: { fontSize: 15, color: '#888', maxWidth: '50%', textAlign: 'right' },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  actionLabel: { fontSize: 15, color: '#571FE4', fontWeight: '500' },
  actionChevron: { fontSize: 16, color: '#571FE4' },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  toggleInfo: { flex: 1, marginRight: 16 },
  toggleLabel: { fontSize: 15, color: '#333', fontWeight: '500' },
  toggleDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  debugCard: {
    backgroundColor: '#1a1a2e',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
  debugLabel: { fontSize: 11, color: '#888', marginTop: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  debugValue: { fontSize: 13, color: '#4ade80', fontFamily: 'monospace', marginTop: 4 },
  dangerRow: {
    padding: 16,
  },
  dangerLabel: { fontSize: 15, color: '#ef4444', fontWeight: '500' },
  dangerDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 4 },
  modalSubtitle: { fontSize: 14, color: '#888', marginBottom: 16 },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modalCancelText: { fontSize: 15, color: '#888' },
  modalConfirmBtn: {
    backgroundColor: '#571FE4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalConfirmText: { fontSize: 15, color: '#fff', fontWeight: '500' },
  localeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
  },
  localeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  localeBtnActive: {
    backgroundColor: '#571FE4',
  },
  localeBtnText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  localeBtnTextActive: {
    color: '#fff',
  },
  testKeyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e5e5',
  },
  testKeyLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  testKeyValue: {
    fontSize: 14,
    color: '#571FE4',
    fontWeight: '500',
  },
});
