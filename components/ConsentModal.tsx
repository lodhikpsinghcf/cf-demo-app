import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Switch,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ConsentOptions } from '../providers/ContentFlowProvider';

const { width, height } = Dimensions.get('window');

interface ConsentModalProps {
  visible: boolean;
  onComplete: (consent: ConsentOptions) => void;
  onSkip?: () => void;
}

export function ConsentModal({ visible, onComplete, onSkip }: ConsentModalProps) {
  const [marketing, setMarketing] = useState(true);
  const [push, setPush] = useState(true);
  const [locationTracking, setLocationTracking] = useState(false);
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);

  const handleAcceptAll = () => {
    onComplete({
      marketing: true,
      push: true,
      locationTracking: true,
      email: true,
      sms: true,
    });
  };

  const handleAcceptSelected = () => {
    onComplete({
      marketing,
      push,
      locationTracking,
      email,
      sms,
    });
  };

  const handleDeclineAll = () => {
    onComplete({
      marketing: false,
      push: false,
      locationTracking: false,
      email: false,
      sms: false,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <LinearGradient colors={['#571FE4', '#7C3AED']} style={styles.header}>
              <Text style={styles.headerIcon}>🔒</Text>
              <Text style={styles.headerTitle}>Privacy & Permissions</Text>
              <Text style={styles.headerSubtitle}>
                Help us personalize your experience
              </Text>
            </LinearGradient>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.sectionTitle}>Choose your preferences</Text>

              {/* Marketing */}
              <View style={styles.consentItem}>
                <View style={styles.consentIcon}>
                  <Text style={styles.iconEmoji}>🎯</Text>
                </View>
                <View style={styles.consentInfo}>
                  <Text style={styles.consentLabel}>Personalized Content</Text>
                  <Text style={styles.consentDesc}>
                    Show offers and content tailored to your interests
                  </Text>
                </View>
                <Switch
                  value={marketing}
                  onValueChange={setMarketing}
                  trackColor={{ false: '#E5E5E5', true: '#571FE4' }}
                  thumbColor="#fff"
                />
              </View>

              {/* Push Notifications */}
              <View style={styles.consentItem}>
                <View style={styles.consentIcon}>
                  <Text style={styles.iconEmoji}>🔔</Text>
                </View>
                <View style={styles.consentInfo}>
                  <Text style={styles.consentLabel}>Push Notifications</Text>
                  <Text style={styles.consentDesc}>
                    Receive updates, offers, and important alerts
                  </Text>
                </View>
                <Switch
                  value={push}
                  onValueChange={setPush}
                  trackColor={{ false: '#E5E5E5', true: '#571FE4' }}
                  thumbColor="#fff"
                />
              </View>

              {/* Location */}
              <View style={styles.consentItem}>
                <View style={styles.consentIcon}>
                  <Text style={styles.iconEmoji}>📍</Text>
                </View>
                <View style={styles.consentInfo}>
                  <Text style={styles.consentLabel}>Location Services</Text>
                  <Text style={styles.consentDesc}>
                    Find nearby offers, restaurants, and services
                  </Text>
                </View>
                <Switch
                  value={locationTracking}
                  onValueChange={setLocationTracking}
                  trackColor={{ false: '#E5E5E5', true: '#571FE4' }}
                  thumbColor="#fff"
                />
              </View>

              {/* Email */}
              <View style={styles.consentItem}>
                <View style={styles.consentIcon}>
                  <Text style={styles.iconEmoji}>✉️</Text>
                </View>
                <View style={styles.consentInfo}>
                  <Text style={styles.consentLabel}>Email Communications</Text>
                  <Text style={styles.consentDesc}>
                    Receive newsletters and promotional emails
                  </Text>
                </View>
                <Switch
                  value={email}
                  onValueChange={setEmail}
                  trackColor={{ false: '#E5E5E5', true: '#571FE4' }}
                  thumbColor="#fff"
                />
              </View>

              {/* SMS */}
              <View style={styles.consentItem}>
                <View style={styles.consentIcon}>
                  <Text style={styles.iconEmoji}>💬</Text>
                </View>
                <View style={styles.consentInfo}>
                  <Text style={styles.consentLabel}>SMS Messages</Text>
                  <Text style={styles.consentDesc}>
                    Get important updates via text message
                  </Text>
                </View>
                <Switch
                  value={sms}
                  onValueChange={setSms}
                  trackColor={{ false: '#E5E5E5', true: '#571FE4' }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.acceptAllBtn} onPress={handleAcceptAll}>
                <LinearGradient
                  colors={['#571FE4', '#7C3AED']}
                  style={styles.acceptAllGradient}
                >
                  <Text style={styles.acceptAllText}>Accept All</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.acceptSelectedBtn} onPress={handleAcceptSelected}>
                <Text style={styles.acceptSelectedText}>Accept Selected</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.declineBtn} onPress={handleDeclineAll}>
                <Text style={styles.declineText}>Decline All</Text>
              </TouchableOpacity>

              <Text style={styles.privacyNote}>
                You can change these settings anytime in Settings → Privacy
              </Text>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: height * 0.85,
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 6,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  consentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  consentIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 18,
  },
  consentInfo: {
    flex: 1,
    marginRight: 12,
  },
  consentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  consentDesc: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
    lineHeight: 14,
  },
  footer: {
    padding: 16,
    paddingTop: 12,
    backgroundColor: '#fff',
  },
  acceptAllBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  acceptAllGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  acceptAllText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  acceptSelectedBtn: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  acceptSelectedText: {
    color: '#571FE4',
    fontSize: 14,
    fontWeight: '600',
  },
  declineBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  declineText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
  },
  privacyNote: {
    fontSize: 10,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 10,
  },
});
