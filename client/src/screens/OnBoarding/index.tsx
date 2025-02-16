import React from 'react';
import { Text } from 'react-native';
import CustomButton from '~/components/CustomButton';
import Container from '~/components/container';

const OnBoarding = () => {
  return (
    <Container>
      <Text>Login</Text>
      <CustomButton
        onPress={() => {}}
        text="hello"
        style={{
          backgroundColor: 'red',
          height: 50,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        textStyle={{ color: 'green', fontSize: 20, fontStyle: 'italic' }}
      />
    </Container>
  );
};

export default OnBoarding;
