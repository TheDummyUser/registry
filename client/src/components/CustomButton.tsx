import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface customButtonProps {
  text: string;
  onPress: () => void;
  textColor: string;
  bgColor: string;
  disabled: boolean;
  width: number;
  height: number;
  fontsize: number;
  fontFam: string;
}

const CustomButton: React.FC<customButtonProps> = ({
  text,
  textColor,
  onPress,
  bgColor,
  disabled,
  width,
  height,
  fontFam,
  fontsize,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{
        backgroundColor: bgColor,
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
      }}>
      <Text style={{ fontSize: fontsize, fontFamily: fontFam, color: textColor }}>{text}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
