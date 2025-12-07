import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Colors } from '../styles/colors';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ 
  title, 
  onBack, 
  showBackButton = true 
}) => {
  return (
    <TouchableOpacity 
      style={styles.header} 
      onPress={onBack}
      disabled={!showBackButton}
      activeOpacity={showBackButton ? 0.7 : 1}
    >
      {showBackButton && <Text style={styles.backArrow}>←</Text>}
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  backArrow: {
    fontSize: 28,
    color: Colors.accent,
    fontWeight: '600',
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    color: Colors.textDark,
    fontWeight: '600',
  },
});

export default ScreenHeader;
