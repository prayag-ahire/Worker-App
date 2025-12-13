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

interface HelpScreenProps {
  onBack?: () => void;
  onAIChatPress?: () => void;
}

const HelpScreen: React.FC<HelpScreenProps> = ({ onBack, onAIChatPress }) => {
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

  const handleSendEmail = () => {
    // TODO: Get user details from backend/context when available
    // For now using placeholder data
    const userDetails = {
      name: 'Prayag Ahire', // TODO: Get from user profile/context
      mobile: '+91 1234567890', // TODO: Get from user profile/context
      address: 'Mumbai, Maharashtra', // TODO: Get from user profile/context
    };

    const subject = 'Support Request - Worker App';
    const body = `Dear ProWorker Support Team,

I need assistance with the following:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${userDetails.name}
Contact: ${userDetails.mobile}
Address: ${userDetails.address}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MY QUERY/ISSUE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Please describe your issue or question here]




━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Thank you for your support!

Best regards,
${userDetails.name}`;

    const emailUrl = `mailto:client.support@proworker.co?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.canOpenURL(emailUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(emailUrl);
        } else {
          Alert.alert('Error', 'Unable to open email app. Please make sure you have an email app installed.');
        }
      })
      .catch(() => Alert.alert('Error', 'Unable to open email app. Please try again.'));
  };

  const handleFAQPress = (faqId: number) => {
    // Toggle expand/collapse
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← {t('help.title')}</Text>
          </TouchableOpacity>
        </View>

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
    paddingBottom: 100, // Space for floating AI button
  },
  header: {
    marginBottom: 24,
    marginTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: Colors.textDark,
    fontWeight: '600',
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
    color: Colors.textDark,
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
    color: Colors.textDark,
    fontWeight: '500',
  },
  faqArrow: {
    fontSize: 14,
    color: Colors.textMedium,
    marginLeft: 12,
  },
  answerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: Colors.backgroundSoft,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  answerText: {
    fontSize: 14,
    color: Colors.textDark,
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
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  aiChatText: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: '700',
  },
});

export default HelpScreen;
