import React from 'react';
import MainContainer from '~/components/Container';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { fonts } from '~/utils/fonts';
import { Theme } from '~/utils/colors';
import CustomButton from '~/components/CustomButton';

const OnBoarding = () => {
  const theme = Theme();
  return (
    <MainContainer ph={15} center={true}>
      <View style={{ height: 100, borderWidth: 1, borderColor: 'red', justifyContent: 'center' }}>
        <Text style={[styles.textStyle, { color: theme.base07 }]}>Registry</Text>
        <Text style={[styles.textStyle, { color: theme.base07, fontSize: 15 }]}>
          A one place destinaton for Attendence
        </Text>
      </View>
      <View
        style={{
          height: 200,
          borderWidth: 1,
          borderColor: 'green',
          justifyContent: 'space-evenly',
        }}>
        <TextInput
          placeholder="Email@example.com"
          placeholderTextColor={theme.base05}
          style={{
            backgroundColor: theme.base02,
            height: 40,
            borderRadius: 12,
            paddingHorizontal: 10,
            fontStyle: 'normal',
            fontFamily: fonts.Rcr,
            fontSize: 13,
          }}
        />

        <TextInput
          placeholder="Password..."
          placeholderTextColor={theme.base05}
          style={{
            backgroundColor: theme.base02,
            height: 40,
            borderRadius: 12,
            paddingHorizontal: 10,
            fontStyle: 'normal',
            fontFamily: fonts.Rcr,
            fontSize: 13,
          }}
        />
        <CustomButton
          text="login"
          disabled={false}
          bgColor={theme.base03}
          width={'100%'}
          height={40}
          fontsize={12}
          fontFam={fonts.pixeSansRegular}
          textColor={theme.base06}
          onPress={() => {}}
        />
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 22,
    fontFamily: fonts.pixeSansBold,
  },
});

export default OnBoarding;
