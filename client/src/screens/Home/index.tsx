import React from 'react';
import { View, Text } from 'react-native';
import MainContainer from '~/components/Container';
import { styles } from './styles';

const Home = () => {
  return (
    <MainContainer ph={10}>
      <View>
        <Text style={styles.textStyle}>Home</Text>
      </View>
    </MainContainer>
  );
};

export default Home;
