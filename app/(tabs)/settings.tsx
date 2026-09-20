import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
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
  } = useContentFlow();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);

  const handleConsentToggle = async (value: boolean) => {
    await setConsent(value);
  };

  const handleSetUserId = () => {
    Alert.prompt(
      'Set User ID',
      'Enter a user ID to identify this user',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Set',
          onPress: (id) => {
            if (id) setUserId(id);
          }
        },
      ],
      'plain-text',
      userId || ''
    );
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

  return (
    <ScrollView style={styles.container}>
      {/* SDK Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SDK Status</Text>
        <View style={styles.card}>
          <SettingRow label="Ready" value={isReady ? '✅ Connected' : '❌ Not ready'} />
          <SettingRow label="Device ID" value={deviceId?.slice(0, 16) + '...' || 'N/A'} />
          <SettingRow label="User ID" value={userId || 'Anonymous'} />
          <SettingRow label="Consent" value={consent ? '✅ Granted' : '⏳ Pending'} />
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
            <Text style={styles.actionLabel}>Force Sync</Text>
            <Text style={styles.actionChevron}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Consent & Permissions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consent & Permissions</Text>
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Analytics Consent</Text>
              <Text style={styles.toggleDesc}>Allow tracking for personalization</Text>
            </View>
            <Switch
              value={consent}
              onValueChange={handleConsentToggle}
              trackColor={{ false: '#ddd', true: '#571FE4' }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Push Notifications</Text>
              <Text style={styles.toggleDesc}>Receive offers and updates</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#ddd', true: '#571FE4' }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Location Services</Text>
              <Text style={styles.toggleDesc}>For nearby recommendations</Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: '#ddd', true: '#571FE4' }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Info</Text>
        <View style={styles.card}>
          <SettingRow label="App Name" value={config.appName} />
          <SettingRow label="App Version" value={config.appVersion} />
          <SettingRow label="API Endpoint" value={config.baseUrl.replace('https://', '')} />
        </View>
      </View>

      {/* SDK Config */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SDK Configuration</Text>
        <View style={styles.card}>
          <SettingRow label="Tenant ID" value={config.tenantId || 'Not set'} />
          <SettingRow label="SDK Key" value={config.sdkKey ? `${config.sdkKey.slice(0, 20)}...` : 'Not set'} />
          <SettingRow label="Write Key" value={config.writeKey ? `${config.writeKey.slice(0, 20)}...` : 'Not set'} />
          <SettingRow label="Read Key" value={config.readKey ? `${config.readKey.slice(0, 20)}...` : 'Not set'} />
        </View>
      </View>

      {/* Debug Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Debug</Text>
        <View style={styles.debugCard}>
          <Text style={styles.debugText}>Device ID:</Text>
          <Text style={styles.debugValue} selectable>{deviceId || 'Not set'}</Text>
          <Text style={styles.debugText}>User ID:</Text>
          <Text style={styles.debugValue} selectable>{userId || 'Anonymous'}</Text>
          <Text style={styles.debugText}>Tenant ID:</Text>
          <Text style={styles.debugValue} selectable>{config.tenantId || 'Not set'}</Text>
          <Text style={styles.debugText}>SDK Key:</Text>
          <Text style={styles.debugValue} selectable>{config.sdkKey || 'Not set'}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Text style={styles.settingValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#888', marginHorizontal: 16, marginBottom: 8, textTransform: 'uppercase' },
  card: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: { fontSize: 15, color: '#333' },
  settingValue: { fontSize: 15, color: '#888' },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionLabel: { fontSize: 15, color: '#571FE4', fontWeight: '500' },
  actionChevron: { fontSize: 18, color: '#571FE4' },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  toggleLabel: { fontSize: 15, color: '#333', fontWeight: '500' },
  toggleDesc: { fontSize: 12, color: '#888', marginTop: 4 },
  debugCard: {
    backgroundColor: '#1e1e1e',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
  debugText: { fontSize: 12, color: '#888', marginTop: 8 },
  debugValue: { fontSize: 13, color: '#4ade80', fontFamily: 'monospace', marginTop: 4 },
});
