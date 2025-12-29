import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useLanguage} from '../contexts/LanguageContext';

const {width, height} = Dimensions.get('window');

interface ErrorScreenProps {
  onRetry?: () => void;
  onGoBack?: () => void;
  errorMessage?: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({
  onRetry,
  onGoBack,
  errorMessage,
}) => {
  const {t} = useLanguage();

  return (
    <View style={styles.container}>
      {/* Error Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/Erro_img.jpg')}
          style={styles.errorImage}
          resizeMode="contain"
        />
      </View>

      {/* Error Title */}
      <Text style={styles.title}>{t('errorScreen.title')}</Text>

      {/* Error Message */}
      <Text style={styles.message}>
        {errorMessage || t('errorScreen.defaultMessage')}
      </Text>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {onGoBack && (
          <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
            <Text style={styles.backButtonText}>{t('errorScreen.goBack')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorScreen;
