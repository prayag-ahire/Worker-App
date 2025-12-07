import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  Clipboard,
} from 'react-native';
import { Colors } from '../styles/colors';
import { ScreenHeader, PrimaryButton, Card } from '../components';

interface InviteFriendScreenProps {
  onBack?: () => void;
}

const InviteFriendScreen: React.FC<InviteFriendScreenProps> = ({ onBack }) => {
  const [referralCode] = useState('PROWORK' + Math.floor(Math.random() * 10000));

  const handleCopyCode = () => {
    Clipboard.setString(referralCode);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  const handleShare = () => {
    console.log('Share pressed');
    const message = `Join ProWorker and earn rewards! Use my referral code: ${referralCode}`;
    Alert.alert('Share', message);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ScreenHeader title="Invite A Friend" onBack={onBack} />

        {/* Illustration */}
        <Card style={styles.illustrationCard}>
          <Text style={styles.illustrationEmoji}>👥</Text>
          <Text style={styles.illustrationText}>Invite friends & earn rewards!</Text>
        </Card>

        {/* Benefits Section */}
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🎁</Text>
            <Text style={styles.benefitText}>You get ₹100 when friend signs up</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>💰</Text>
            <Text style={styles.benefitText}>Your friend gets ₹50 bonus</Text>
          </View>
        </View>

        {/* Referral Code Section */}
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Your Referral Code</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{referralCode}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Share Button */}
        <PrimaryButton
          title="Invite A Friend"
          onPress={handleShare}
          style={styles.shareButton}
        />

        {/* How it Works */}
        <View style={styles.howItWorksContainer}>
          <Text style={styles.howItWorksTitle}>How it works?</Text>
          
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Share your referral code with friends</Text>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Friend signs up using your code</Text>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>Both of you get rewards!</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  copyButtonText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '600',
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
