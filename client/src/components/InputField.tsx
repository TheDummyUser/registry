import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Expo Icons
import { colors } from '~/utils/colors';

interface InputFieldProps extends TextInputProps {
  label?: string;
  labelStyle?: TextStyle;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  labelStyle,
  error,
  containerStyle,
  inputStyle,
  secureTextEntry = false, // Default to false
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor="#888" // Default placeholder color
          secureTextEntry={!isPasswordVisible} // Toggle secureTextEntry
          {...rest}
        />
        {label?.toLowerCase().includes('password') && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={24}
              color={colors.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'normal',
    marginBottom: 8,
    color: colors.secondary, // Default label color
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.fbg,
    color: colors.secondary,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default InputField;
