import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { Colors } from '../styles/colors';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  image: any;
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    titleKey: 'onboarding.slide1Title',
    descriptionKey: 'onboarding.slide1Description',
    image: require('../assets/images/onboarding1.png'),
  },
  {
    id: '2',
    titleKey: 'onboarding.slide2Title',
    descriptionKey: 'onboarding.slide2Description',
    image: require('../assets/images/onboarding2.png'),
  },
  {
    id: '3',
    titleKey: 'onboarding.slide3Title',
    descriptionKey: 'onboarding.slide3Description',
    image: require('../assets/images/onboarding3.png'),
  },
  {
    id: '4',
    titleKey: 'onboarding.slide4Title',
    descriptionKey: 'onboarding.slide4Description',
    image: require('../assets/images/onboarding4.png'),
  },
];

interface OnboardingScreenProps {
  onFinish?: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      if (onFinish) {
        onFinish();
      }
    }
  };

  const handleSkip = () => {
    if (onFinish) {
      onFinish();
    }
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{t(item.titleKey)}</Text>
        <Text style={styles.description}>{t(item.descriptionKey)}</Text>
      </View>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex && styles.dotActive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />
      
      {/* Skip Button */}
      {currentIndex < onboardingData.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        scrollEnabled={true}
      />

      {/* Dots Indicator */}
      {renderDots()}

      {/* Next/Get Started Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === onboardingData.length - 1 ? t('onboarding.getStarted') : t('onboarding.next')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: Colors.textMedium,
    fontWeight: '600',
  },
  slide: {
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: Colors.textMedium,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.accent,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.5,
  },
});

export default OnboardingScreen;
