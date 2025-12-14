import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../styles/colors';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16, // Increased from 12 for more modern look
    padding: 20,
    backgroundColor: Colors.white,
    // Modern shadow effect for elevated card look
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3, // Android shadow
    // Remove border for cleaner, modern look
  },
});

export default Card;
