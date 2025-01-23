import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MainContainer from '~/components/Container';
import { fonts } from '~/utils/fonts';
import { styles } from './styles';

const Home = () => {
  return (
    <MainContainer ph={10}>
      <Text style={styles.textStyle}>Home</Text>
    </MainContainer>
  );
};

export default Home;
