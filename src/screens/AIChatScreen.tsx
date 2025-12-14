import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../styles/colors';

interface AIChatScreenProps {
  onBack?: () => void;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIChatScreen: React.FC<AIChatScreenProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your ProWorker AI assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when new message is added
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Simulated AI responses based on keywords
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('withdraw') || lowerMessage.includes('money')) {
      return 'To withdraw money:\n1. Go to your Profile\n2. Click on "Withdraw"\n3. Enter amount\n4. Select your bank account\n5. Confirm withdrawal\n\nMinimum withdrawal is ₹100.';
    }
    if (lowerMessage.includes('work') || lowerMessage.includes('job')) {
      return 'To get more work:\n1. Complete your profile 100%\n2. Add your skills and portfolio\n3. Set competitive rates\n4. Enable location services\n5. Keep your availability updated\n\nHigher ratings get more work!';
    }
    if (lowerMessage.includes('schedule') || lowerMessage.includes('non-working')) {
      return 'To schedule non-working days:\n1. Go to Profile\n2. Click "Availability"\n3. Select dates you\'re unavailable\n4. Save changes\n\nClients won\'t see you on those days.';
    }
    if (lowerMessage.includes('bank') || lowerMessage.includes('account')) {
      return 'To set primary bank account:\n1. Go to Settings\n2. Click "Bank Accounts"\n3. Add your bank details\n4. Click "Set as Primary"\n\nYou can add multiple accounts.';
    }
    if (lowerMessage.includes('referral') || lowerMessage.includes('invite') || lowerMessage.includes('friend')) {
      return 'Referral benefits:\n• You get ₹100 when friend signs up\n• Your friend gets ₹50 bonus\n• Unlimited referrals!\n\nShare your code from Settings → Invite A Friend';
    }
    if (lowerMessage.includes('rating') || lowerMessage.includes('review')) {
      return 'Ratings help you get more work!\n\n• Complete jobs on time\n• Maintain quality\n• Communicate well\n• Be professional\n\nHigher ratings = More visibility';
    }
    if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      return 'Payment info:\n• Clients pay after work completion\n• Money credited within 24 hours\n• Withdraw anytime (min ₹100)\n• No hidden charges\n\nCheck "My Earnings" for details.';
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! How can I assist you with ProWorker today?';
    }
    if (lowerMessage.includes('thank')) {
      return 'You\'re welcome! Feel free to ask if you need anything else. Happy working! 😊';
    }

    // Default response
    return 'I can help you with:\n• Withdrawing money\n• Getting more work\n• Scheduling availability\n• Bank account setup\n• Referral program\n• Ratings & reviews\n• Payments\n\nWhat would you like to know?';
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText.trim()),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 500);
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageBubble,
        message.isUser ? styles.userBubble : styles.aiBubble,
      ]}
    >
      <Text style={[
        styles.messageText,
        message.isUser ? styles.userText : styles.aiText,
      ]}>
        {message.text}
      </Text>
      <Text style={[
        styles.timestamp,
        message.isUser ? styles.userTimestamp : styles.aiTimestamp,
      ]}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>AI Assistant</Text>
          <Text style={styles.headerSubtitle}>Online</Text>
        </View>
        <View style={styles.aiIcon}>
          <Text style={styles.aiIconText}>🤖</Text>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor={Colors.textLight}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingTop: 50, // Reduced padding for translucent StatusBar
    backgroundColor: Colors.accent, // Blue background
    borderRadius: 24, // All corners rounded
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 28,
    color: Colors.white, // White arrow
    fontWeight: '700',
    marginTop: -3,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white, // White text
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)', // White with transparency
    marginTop: 2,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiIconText: {
    fontSize: 24,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.accent,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.backgroundSoft,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: Colors.white,
  },
  aiText: {
    color: Colors.textDark,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  aiTimestamp: {
    color: Colors.textLight,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.textDark,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.border,
  },
  sendButtonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700',
  },
});

export default AIChatScreen;
