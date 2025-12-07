import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../styles/colors';

interface ListItemProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  showArrow?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({ 
  title, 
  onPress, 
  style,
  showArrow = true 
}) => {
  return (
    <TouchableOpacity
      style={[styles.listItem, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.listItemText}>{title}</Text>
      {showArrow && <Text style={styles.arrow}>›</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  listItemText: {
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 24,
    color: Colors.textLight,
    fontWeight: '300',
  },
});

export default ListItem;
