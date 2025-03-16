import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { colors } from '~/utils/colors';

interface ButtonProps {
  onPress: () => void;
  style?: ViewStyle;
  text: string;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  type?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
  fullWidth?: boolean;
  accessibilityLabel?: string;
}

const CustomButton: React.FC<ButtonProps> = ({
  onPress,
  style,
  text,
  textStyle,
  disabled = false,
  loading = false,
  type = 'primary',
  icon,
  fullWidth = false,
  accessibilityLabel,
}) => {
  // Handle different button types
  const getTypeStyles = () => {
    switch (type) {
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        };
      default: // primary
        return {
          backgroundColor: colors.primary,
          borderWidth: 0,
        };
    }
  };

  return (
    <TouchableOpacity
      style={StyleSheet.compose(
        [
          styles.baseButton,
          getTypeStyles(),
          fullWidth && { width: Dimensions.get('window').width - 32 },
          disabled && styles.disabledButton,
        ],
        style
      )}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityLabel={accessibilityLabel || text}
      accessibilityRole="button">
      {loading ? (
        <ActivityIndicator color={colors.secondary} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.baseText,
              textStyle,
              type === 'outline' && { color: colors.primary },
              disabled && styles.disabledText,
            ]}>
            {text}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    backgroundColor: colors.fbg,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
    gap: 8,
  },
  baseText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: colors.primary,
    opacity: 0.7,
  },
  disabledText: {
    color: colors.primary,
  },
});

export default CustomButton;
