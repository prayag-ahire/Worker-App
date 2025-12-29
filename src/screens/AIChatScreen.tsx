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
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../styles/colors';
import { fetchWorkerData } from '../services/dataService';
import { sendChatMessage, checkApiHealth } from '../services/apiClient';
import { Message, WorkerContext } from '../services/types';

interface AIChatScreenProps {
  onBack?: () => void;
  onShowError?: (fromScreen: 'aiChat', message?: string) => void;
}

// Hardcoded for demo, same as chatbot frontend
const WORKER_ID = 1;

const AIChatScreen: React.FC<AIChatScreenProps> = ({ onBack, onShowError }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "I am your personal AI assistant.\n\nI can assist you with your information like order, rating, review, schedule, etc.\n\nI will happy to help you 😊",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [workerContext, setWorkerContext] = useState<WorkerContext | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when new message is added or loading state changes
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isLoading]);

  const initChat = async () => {
    setLoadError(null);
    setIsLoading(true);
    try {
      console.log('Fetching worker data for ID:', WORKER_ID);
      const data = await fetchWorkerData(WORKER_ID);
      if (data) {
        setWorkerContext(data);
      } else {
        setLoadError('Unable to load profile. Please check if Worker ID ' + WORKER_ID + ' exists in Supabase.');
      }

      const isHealthy = await checkApiHealth();
      setApiConnected(isHealthy);
      if (!isHealthy) {
        console.warn('Backend API not connected - host machine port 3001 must be accessible');
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      setLoadError('Failed to initialize: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Load Worker Data and Check API Health on Mount
  useEffect(() => {
    initChat();
  }, []);

  const handleSend = async () => {
    if (inputText.trim() === '' || !workerContext || isLoading) return;

    const userMessageContent = inputText.trim();
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageContent,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      if (!apiConnected) {
        // Double check health if previously failed
        const isHealthy = await checkApiHealth();
        setApiConnected(isHealthy);
        if (!isHealthy) {
          throw new Error('AI Assistant is currently offline. Please try again later.');
        }
      }

      const responseText = await sendChatMessage(userMessageContent, workerContext);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error", error);
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'I\'m sorry, I couldn\'t process that. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse markdown-like formatting
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    
    lines.forEach((line, index) => {
      // Bold text: **text**
      if (line.includes('**')) {
        const parts = line.split('**');
        const textElements: (string | React.ReactElement)[] = [];
        parts.forEach((part, i) => {
          if (i % 2 === 1) {
            textElements.push(
              <Text key={`bold-${index}-${i}`} style={styles.boldText}>{part}</Text>
            );
          } else if (part) {
            textElements.push(part);
          }
        });
        elements.push(
          <Text key={`line-${index}`} style={styles.messageText}>
            {textElements}
          </Text>
        );
      }
      // Bullet points: • or -
      else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        elements.push(
          <View key={`bullet-${index}`} style={styles.bulletContainer}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>{line.replace(/^[•\-]\s*/, '').trim()}</Text>
          </View>
        );
      }
      // Numbered lists: 1. 2. 3.
      else if (/^\d+\.\s/.test(line.trim())) {
        const match = line.match(/^(\d+)\.\s(.+)/);
        if (match) {
          elements.push(
            <View key={`number-${index}`} style={styles.bulletContainer}>
              <Text style={styles.numberText}>{match[1]}.</Text>
              <Text style={styles.bulletText}>{match[2]}</Text>
            </View>
          );
        }
      }
      // Regular text
      else if (line.trim()) {
        elements.push(
          <Text key={`text-${index}`} style={styles.messageText}>{line}</Text>
        );
      }
    });
    
    return elements;
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';
    return (
      <View
        key={message.id}
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <View style={styles.messageContent}>
          {isUser ? (
            <Text style={[styles.messageText, styles.userText]}>
              {message.content}
            </Text>
          ) : (
            <View>{parseMarkdown(message.content)}</View>
          )}
        </View>
        <Text style={[
          styles.timestamp,
          isUser ? styles.userTimestamp : styles.aiTimestamp,
        ]}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  if (isLoading && !workerContext) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Initializing AI Assistant...</Text>
      </View>
    );
  }

  if (loadError && !workerContext) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>⚠️ {loadError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initChat}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.accent} translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>AI Assistant</Text>
          <Text style={styles.headerSubtitle}>
            {apiConnected ? 'Online' : 'Offline'}
          </Text>
        </View>
        <View style={styles.aiIcon}>
          <Text style={styles.aiIconText}>🤖</Text>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
          {isLoading && (
            <View style={[styles.messageBubble, styles.aiBubble, styles.loadingBubble]}>
              <ActivityIndicator size="small" color={Colors.accent} />
            </View>
          )}
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
            editable={!isLoading && !!workerContext}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isLoading || !workerContext) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading || !workerContext}
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textMedium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 5,
    paddingTop: 60, // Extra padding for translucent StatusBar
    backgroundColor: Colors.accent, // Blue background
    borderBottomLeftRadius: 24, // Only bottom corners rounded
    borderBottomRightRadius: 24,
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
    fontSize: 32,
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
  messageContent: {
    // Container for message text - no flex to prevent expansion
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
  loadingBubble: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 40,
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: Colors.textDark,
  },
  userText: {
    color: Colors.white,
  },
  aiText: {
    color: Colors.textDark,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.textDark,
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 2,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 20,
    color: Colors.textDark,
    marginRight: 8,
    fontWeight: '700',
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: Colors.textDark,
  },
  numberText: {
    fontSize: 15,
    lineHeight: 20,
    color: Colors.textDark,
    marginRight: 8,
    fontWeight: '700',
    minWidth: 24,
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
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.white,
    fontWeight: '700',
  },
});

export default AIChatScreen;

