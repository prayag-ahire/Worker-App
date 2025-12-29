import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  Clipboard,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Colors } from '../styles/colors';
import { ScreenHeader, PrimaryButton, Card } from '../components';
import { useLanguage } from '../contexts/LanguageContext';
import { getReferralCode } from '../services/apiClient';
import { getAuthToken } from '../utils/storage';

interface InviteFriendScreenProps {
  onBack?: () => void;
  onShowError?: (fromScreen: 'inviteFriend', message?: string) => void;
}

const InviteFriendScreen: React.FC<InviteFriendScreenProps> = ({ onBack, onShowError }) => {
  const { t } = useLanguage();
  const [referralCode, setReferralCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch referral code on mount
  useEffect(() => {
    const fetchReferralCode = async () => {
      try {
        const token = await getAuthToken();
        if (!token) {
          throw new Error('No authentication token found. Please login again.');
        }

        const response = await getReferralCode(token);
        setReferralCode(response.ReferCode.toString());
        console.log('Fetched referral code:', response.ReferCode);
      } catch (error: any) {
        console.error('Error fetching referral code:', error);
        
        // Show error screen instead of toast if onShowError is provided
        if (onShowError) {
          const errorMessage = error.message === 'No authentication token found. Please login again.'
            ? 'Your session has expired. Please login again.'
            : 'Unable to load your referral code. Please check your internet connection and try again.';
          
          onShowError('inviteFriend', errorMessage);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Failed to Load',
            text2: error.message || 'Could not fetch referral code',
            position: 'top',
            visibilityTime: 3000,
          });
        }
        // Set a fallback code
        setReferralCode('N/A');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferralCode();
  }, []);

  const handleCopyCode = () => {
    if (referralCode && referralCode !== 'N/A') {
      Clipboard.setString(referralCode);
      Toast.show({
        type: 'success',
        text1: 'Copied!',
        text2: 'Referral code copied to clipboard',
        position: 'top',
        visibilityTime: 2000,
      });
    }
  };

  const handleShare = () => {
    console.log('Share pressed');
    const message = `Join ProWorker and earn rewards! Use my referral code: ${referralCode}`;
    Alert.alert('Share', message);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.accent} translucent={true} />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading referral code...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <ScreenHeader title={t('inviteFriend.title')} onBack={onBack} variant="blue" />

          {/* Illustration */}
          <Card style={styles.illustrationCard}>
            <Text style={styles.illustrationEmoji}>👥</Text>
            <Text style={styles.illustrationText}>{t('inviteFriend.shareCode')}</Text>
          </Card>

          {/* Benefits Section */}
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🎁</Text>
              <Text style={styles.benefitText}>{t('inviteFriend.benefit1')}</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>💰</Text>
              <Text style={styles.benefitText}>{t('inviteFriend.benefit2')}</Text>
            </View>
          </View>

          {/* Referral Code Section */}
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>{t('inviteFriend.yourCode')}</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{referralCode}</Text>
              <TouchableOpacity 
                style={styles.copyButton} 
                onPress={handleCopyCode}
                disabled={referralCode === 'N/A'}
              >
                <Text style={styles.copyText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Share Button */}
          <PrimaryButton
            title={t('inviteFriend.shareButton')}
            onPress={handleShare}
            style={styles.shareButton}
            disabled={referralCode === 'N/A'}
          />

          {/* How it Works */}
          <View style={styles.howItWorksContainer}>
            <Text style={styles.howItWorksTitle}>{t('inviteFriend.howItWorks')}</Text>
            
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>{t('inviteFriend.step1')}</Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>{t('inviteFriend.step2')}</Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>{t('inviteFriend.step3')}</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  illustrationCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
    backgroundColor: Colors.backgroundSoft,
  },
  illustrationEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  illustrationText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
    textAlign: 'center',
  },
  benefitsContainer: {
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.backgroundSoft,
    borderRadius: 8,
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 15,
    color: Colors.textDark,
    fontWeight: '500',
    flex: 1,
  },
  codeContainer: {
    marginBottom: 24,
  },
  codeLabel: {
    fontSize: 14,
    color: Colors.textMedium,
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.backgroundSoft,
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 2,
  },
  copyButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  copyText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '700',
  },
  shareButton: {
    marginBottom: 32,
  },
  howItWorksContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 24,
  },
  howItWorksTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  stepText: {
    fontSize: 15,
    color: Colors.textDark,
    flex: 1,
  },
});

export default InviteFriendScreen;
