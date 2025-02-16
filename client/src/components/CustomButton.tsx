import React from 'react';
import { Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  style?: ViewStyle;
  text: string;
  textStyle?: TextStyle;
}

const CustomButton: React.FC<ButtonProps> = ({ onPress, style, text, textStyle }) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
