import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../styles/colors';
import { ScreenHeader, PrimaryButton } from '../components';

interface CommentScreenProps {
  onBack?: () => void;
  onNext?: (comment: string) => void;
  commentType?: 'cancel' | 'reschedule';
  onShowError?: (fromScreen: 'comment', message?: string) => void;
}

const CommentScreen: React.FC<CommentScreenProps> = ({ 
  onBack, 
  onNext,
  commentType = 'cancel',
  onShowError
}) => {
  const [comment, setComment] = useState('');

  const handleNext = () => {
    if (onNext && comment.trim()) {
      onNext(comment);
    }
  };

  const title = commentType === 'cancel' 
    ? 'Comment For Cancel' 
    : 'Comment For Reschedule';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.accent} translucent={true} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <ScreenHeader title={title} onBack={onBack} variant="blue" />

        {/* Comment Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your comment here..."
            placeholderTextColor={Colors.textLight}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
        </View>

        {/* Next Button */}
        <PrimaryButton
          title="Next"
          onPress={handleNext}
          disabled={!comment.trim()}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  inputContainer: {
    marginBottom: 24,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.textDark,
    minHeight: 200,
    backgroundColor: Colors.white,
  },
});

export default CommentScreen;
