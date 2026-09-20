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
    isReady,
    sync,
    trackEvent,
    config,
    reset,
  } = useContentFlow();

  const [showUserIdModal, setShowUserIdModal] = useState(false);
  const [userIdInput, setUserIdInput] = useState('');

  const handleConsentToggle = async (key: 'marketing' | 'push' | 'sms' | 'email' | 'locationTracking', value: boolean) => {
    await setConsent({ [key]: value });
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
    Alert.alert('Event Sent', 'Test event tracked successfully');
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

  return (
    <ScrollView style={styles.container}>
      {/* SDK Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SDK Status</Text>
        <View style={styles.card}>
          <SettingRow label="Status" value={isReady ? '✅ Connected' : '⏳ Connecting...'} />
          <SettingRow label="Device ID" value={deviceId ? `${deviceId.slice(0, 8)}...${deviceId.slice(-4)}` : 'Generating...'} />
          <SettingRow label="User ID" value={userId || 'Anonymous'} />
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
          <TouchableOpacity style={styles.actionRow} onPress={handleTestEvent}>
            <Text style={styles.actionLabel}>Send Test Event</Text>
            <Text style={styles.actionChevron}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionRow} onPress={handleSync}>
            <Text style={styles.actionLabel}>Force Sync Content</Text>
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
          <SettingRow label="App Name" value={config.appName} />
          <SettingRow label="Version" value={config.appVersion} />
          <SettingRow label="API Endpoint" value={config.baseUrl.replace('https://', '')} />
        </View>
      </View>

      {/* SDK Configuration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SDK Keys</Text>
        <View style={styles.card}>
          <SettingRow label="Tenant ID" value={config.tenantId ? `${config.tenantId.slice(0, 12)}...` : 'Not configured'} />
          <SettingRow label="SDK Key" value={config.sdkKey ? `${config.sdkKey.slice(0, 12)}...` : 'Not configured'} />
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
          <Text style={styles.debugLabel}>SDK Key</Text>
          <Text style={styles.debugValue} selectable>{config.sdkKey || 'Not configured'}</Text>
          <Text style={styles.debugLabel}>API Endpoint</Text>
          <Text style={styles.debugValue} selectable>{config.baseUrl}</Text>
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
});
