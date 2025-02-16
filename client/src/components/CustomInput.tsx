import React from 'react';
import { View, Text, StyleSheet, TextInput, TextStyle } from 'react-native';

interface CustomInputProps {
  styles?: TextStyle;
  placeHolder: string;
  placeHolderColor: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ styles }) => {
  return <TextInput style={styles}  />;
};

export default CustomInput;
