import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContentFlow } from '../providers/ContentFlowProvider';
import { ConsentModal } from '../components/ConsentModal';
import { ConsentOptions } from '../providers/ContentFlowProvider';

const { width, height } = Dimensions.get('window');

const ONBOARDING_KEY = '@cf_onboarding_complete';

export default function WelcomeScreen() {
  const { isReady, userId, setConsent, consent, system, identity, t } = useContentFlow();
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, [isReady]);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingComplete = await AsyncStorage.getItem(ONBOARDING_KEY);

      // If user has completed onboarding and has userId, go to main app
      if (onboardingComplete === 'true') {
        router.replace('/(tabs)');
        return;
      }

      setIsChecking(false);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsChecking(false);
    }
  };

  const handleGetStarted = () => {
    // Show consent modal first
    setShowConsentModal(true);
  };

  const handleConsentComplete = async (consentOptions: ConsentOptions) => {
    await setConsent(consentOptions);
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');

    system({
      action: 'app_open',
      custom: {
        onboarding: 'consent_completed',
        marketing: consentOptions.marketing,
        push: consentOptions.push,
        location: consentOptions.locationTracking,
        email: consentOptions.email,
        sms: consentOptions.sms,
      },
    });

    setShowConsentModal(false);

    // Navigate to sign up
    router.replace('/(auth)/sign-up');
  };

  const handleSignIn = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.push('/(auth)/sign-in');
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    system({
      action: 'app_open',
      custom: { onboarding: 'skipped' },
    });
    router.replace('/(tabs)');
  };

  if (isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={['#571FE4', '#7C3AED']} style={styles.loadingGradient}>
          <Text style={styles.loadingIcon}>💳</Text>
          <Text style={styles.loadingText}>Loading...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#571FE4', '#7C3AED', '#9333EA']}
        style={styles.gradient}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>💳</Text>
          </View>
          <Text style={styles.appName}>{t('app.name', 'CF Demo')}</Text>
          <Text style={styles.tagline}>{t('onboarding.welcome', 'Experience Dynamic Content')}</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <FeatureItem
            icon="🎯"
            title={t('onboarding.feature1.title', 'Personalized Content')}
            description={t('onboarding.feature1.desc', 'Dynamic blocks tailored just for you')}
          />
          <FeatureItem
            icon="⚡"
            title={t('onboarding.feature2.title', 'Real-time Updates')}
            description={t('onboarding.feature2.desc', 'Content syncs instantly from the cloud')}
          />
          <FeatureItem
            icon="📊"
            title={t('onboarding.feature3.title', 'Smart Analytics')}
            description={t('onboarding.feature3.desc', 'We learn what works best for you')}
          />
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <TouchableOpacity style={styles.getStartedBtn} onPress={handleGetStarted}>
            <Text style={styles.getStartedText}>{t('onboarding.getStarted', 'Get Started')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signInBtn} onPress={handleSignIn}>
            <Text style={styles.signInText}>{t('onboarding.signIn', 'Already have an account? Sign In')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
            <Text style={styles.skipText}>{t('onboarding.skip', 'Continue as Guest')}</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by ContentFlow SDK
          </Text>
        </View>
      </LinearGradient>

      {/* Consent Modal */}
      <ConsentModal
        visible={showConsentModal}
        onComplete={handleConsentComplete}
      />
    </View>
  );
}

function FeatureItem({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Text style={styles.featureEmoji}>{icon}</Text>
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoIcon: {
    fontSize: 56,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  featuresSection: {
    marginBottom: 48,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureIcon: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureEmoji: {
    fontSize: 28,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  ctaSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  getStartedBtn: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#571FE4',
  },
  signInBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  signInText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
  },
  skipBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
