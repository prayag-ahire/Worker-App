import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors } from '../styles/colors';
import { useLanguage } from '../contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { t } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animate the splash screen
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to sign up after 3 seconds
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, slideAnim, onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />
      
      {/* Animated Background Blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <View style={styles.blob3} />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
            ],
          },
        ]}
      >
        {/* Title */}
        <Text style={styles.appTitle}>{t('splash.appName')}</Text>
        
        {/* Tagline */}
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>{t('splash.tagline')}</Text>
          <View style={styles.underline} />
        </View>
        
        {/* Subtitle */}
        <Text style={styles.subtitle}>{t('splash.subtitle')}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    backgroundColor: Colors.primaryMedium,
    opacity: 0.12,
    top: -width * 0.3,
    right: -width * 0.2,
  },
  blob2: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    backgroundColor: Colors.primaryLight,
    opacity: 0.1,
    bottom: -width * 0.25,
    left: -width * 0.25,
  },
  blob3: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: (width * 0.5) / 2,
    backgroundColor: Colors.skyBlue,
    opacity: 0.15,
    top: '50%',
    left: '50%',
    marginLeft: -width * 0.25,
    marginTop: -width * 0.25,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    paddingHorizontal: 40,
  },
  appTitle: {
    fontSize: 56,
    fontWeight: '900',
    color: Colors.accent,
    marginBottom: 12,
    letterSpacing: -1,
    textAlign: 'center',
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 18,
    color: Colors.accent,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  underline: {
    width: 60,
    height: 3,
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMedium,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default SplashScreen;
