import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors } from '../styles/colors';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  variant?: 'default' | 'blue'; // New prop for blue header
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ 
  title, 
  onBack, 
  showBackButton = true,
  variant = 'default'
}) => {
  const isBlueVariant = variant === 'blue';
  
  return (
    <View style={[
      styles.container,
      isBlueVariant && styles.containerBlue
    ]}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={onBack}
        disabled={!showBackButton}
        activeOpacity={showBackButton ? 0.7 : 1}
      >
        {showBackButton && (
          <Text style={[
            styles.backArrow,
            isBlueVariant && styles.backArrowWhite
          ]}>‹</Text>
        )}
        <Text style={[
          styles.title,
          isBlueVariant && styles.titleWhite
        ]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -24, // Extend to screen edges
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginTop: -20, // Compensate for scroll padding
    marginBottom: 20,
  },
  containerBlue: {
    backgroundColor: Colors.accent, // Sky blue background
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderBottomLeftRadius: 24, // Rounded bottom corners
    borderBottomRightRadius: 24, // Rounded bottom corners
    paddingTop: 60, // Extra padding for translucent StatusBar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 32,
    color: Colors.accent,
    fontWeight: '700',
    marginRight: 12,
    marginTop: -3, // Perfect vertical alignment with title
  },
  backArrowWhite: {
    color: Colors.white,
  },
  title: {
    fontSize: 22, // Increased from 18
    color: Colors.textPrimary,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  titleWhite: {
    color: Colors.white,
  },
});

export default ScreenHeader;
