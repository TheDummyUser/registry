import React from 'react';
import { Text, View } from 'react-native';

import CustomButton from '~/components/CustomButton';
import InputField from '~/components/InputField';
import Container from '~/components/container';
import { colors } from '~/utils/colors';

const OnBoarding = () => {
  return (
    <Container>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ height: 100 }}>
          <Text style={{ color: colors.secondary, fontSize: 25 }}>Registry...</Text>
          <Text style={{ color: colors.secondary, fontSize: 20 }}>
            A Single Source for all your {'\n'}company needs...
          </Text>
        </View>
        <View style={{ height: 130, justifyContent: 'space-around' }}>
          <InputField label="Email" placeholder="email" />
          <InputField label="Password" placeholder="password" secureTextEntry />
          <CustomButton text="login" onPress={() => {}} />
        </View>
      </View>
    </Container>
  );
};

export default OnBoarding;
