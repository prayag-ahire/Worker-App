import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { Colors } from '../styles/colors';

interface TextInputFieldProps extends TextInputProps {
  containerStyle?: ViewStyle;
}

const TextInputField: React.FC<TextInputFieldProps> = ({ 
  containerStyle,
  style,
  ...props 
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={Colors.textLight}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: Colors.textDark,
    backgroundColor: Colors.white,
  },
});

export default TextInputField;
