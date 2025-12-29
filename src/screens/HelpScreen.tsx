import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { Colors } from '../styles/colors';
import { useLanguage } from '../contexts/LanguageContext';
import { ScreenHeader } from '../components';

interface HelpScreenProps {
  onBack?: () => void;
  onAIChatPress?: () => void;
  onShowError?: (fromScreen: 'help', message?: string) => void;
}

const HelpScreen: React.FC<HelpScreenProps> = ({ onBack, onAIChatPress, onShowError }) => {
  const { t } = useLanguage();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqItems = [
    {
      id: 1,
      question: t('help.faq1Question'),
      answer: t('help.faq1Answer'),
    },
    {
      id: 2,
      question: t('help.faq2Question'),
      answer: t('help.faq2Answer'),
    },
    {
      id: 3,
      question: t('help.faq3Question'),
      answer: t('help.faq3Answer'),
    },
    {
      id: 4,
      question: t('help.faq4Question'),
      answer: t('help.faq4Answer'),
    },
    {
      id: 5,
      question: t('help.faq5Question'),
      answer: t('help.faq5Answer'),
    },
    {
      id: 6,
      question: t('help.faq6Question'),
      answer: t('help.faq6Answer'),
    },
  ];

  const handleSendEmail = async () => {
    // TODO: Get user details from backend/context when available
    const userDetails = {
      name: 'Prayag Ahire',
      mobile: '+91 1234567890',
      address: 'Mumbai, Maharashtra',
    };

    const recipient = 'client.support@proworker.co';
    const subject = '⚠️ SUPPORT REQUEST - Worker App';
    const body = `Dear ProWorker Support Team,

I am reaching out to request assistance with the ProWorker Worker application.

═══════════════════════════════════════════════════════
📋 CUSTOMER INFORMATION
═══════════════════════════════════════════════════════

Full Name: ${userDetails.name}
Contact Number: ${userDetails.mobile}
Location/Address: ${userDetails.address}
App Version: 1.0.0

═══════════════════════════════════════════════════════
❗ MY QUERY/ISSUE - PLEASE DESCRIBE BELOW ❗
═══════════════════════════════════════════════════════

[PLEASE DESCRIBE YOUR ISSUE OR QUESTION HERE IN DETAIL]

What happened:


What you expected:


When did this occur:


═══════════════════════════════════════════════════════

Thank you for taking the time to assist me. I look forward to your response.

Best Regards,
${userDetails.name}
${userDetails.mobile}

---
ProWorker Support Team
📧 Email: client.support@proworker.co
⏰ Hours: Monday - Friday, 9:00 AM - 6:00 PM IST`;

    // Simplified mailto URL
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
        console.log('Email app opened successfully');
      } else {
        console.log('Cannot open mailto URL');
        Alert.alert(
          'No Email App Found',
          'Please install Gmail or another email app to send emails.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Email error:', error);
      Alert.alert(
        'Unable to Open Email',
        'There was an error opening your email app. Please check your email settings.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleFAQPress = (faqId: number) => {
    // Toggle expand/collapse
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.accent} translucent={true} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ScreenHeader title={t('help.title')} onBack={onBack} variant="blue" />

        {/* Send Email Button */}
        <TouchableOpacity style={styles.sendEmailButton} onPress={handleSendEmail}>
          <Text style={styles.sendEmailText}>{t('actions.sendEmail')}</Text>
        </TouchableOpacity>

        {/* FAQ List */}
        <View style={styles.faqContainer}>
          {faqItems.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                style={[
                  styles.faqItem,
                  index === faqItems.length - 1 && !expandedFAQ && styles.faqItemLast,
                ]}
                onPress={() => handleFAQPress(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.faqText}>{item.question}</Text>
                <Text style={styles.faqArrow}>
                  {expandedFAQ === item.id ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              
              {/* Answer (shown when expanded) */}
              {expandedFAQ === item.id && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* AI Chat Button (Floating) */}
      <TouchableOpacity style={styles.aiChatButton} onPress={onAIChatPress}>
        <Text style={styles.aiChatText}>AI</Text>
      </TouchableOpacity>
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
  sendEmailButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: Colors.white,
  },
  sendEmailText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  faqContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  faqItemLast: {
    borderBottomWidth: 0,
  },
  faqText: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  faqArrow: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 12,
  },
  answerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: Colors.backgroundAccent,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  answerText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  aiChatButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  aiChatText: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: '700',
  },
});

export default HelpScreen;
