import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import MainContainer from '~/components/Container';
import { fonts } from '~/utils/fonts';
import { Theme } from '~/utils/colors';
import CustomButton from '~/components/CustomButton';
import { Controller, useForm } from 'react-hook-form';
import { validationRules } from '~/utils/validationSchema';

type FormData = {
  username: string;
  password: string;
};

const OnBoarding = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = (data: FormData) => console.log(data);

  const theme = Theme();
  return (
    <MainContainer ph={15} center={true}>
      <View style={styles.headerContainer}>
        <Text style={[styles.textStyle, { color: theme.base07 }]}>Registry</Text>
        <Text style={[styles.textStyle, { color: theme.base07, fontSize: 15 }]}>
          A one place destination for Attendance
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="username"
          rules={validationRules.username}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Email@example.com"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={theme.base05}
              style={[styles.input, { backgroundColor: theme.base03 }]}
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Email Input"
            />
          )}
        />
        {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

        <Controller
          control={control}
          name="password"
          rules={validationRules.password}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Password..."
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholderTextColor={theme.base05}
              style={[styles.input, { backgroundColor: theme.base03 }]}
              secureTextEntry
              accessibilityLabel="Password Input"
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

        <CustomButton
          text="Login"
          disabled={!isValid}
          bgColor={theme.base03}
          width="100%"
          height={40}
          fontsize={12}
          fontFam={fonts.pixeSansRegular}
          textColor={theme.base06}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 100,
    justifyContent: 'center',
    marginBottom: 20,
  },
  textStyle: {
    fontSize: 22,
    fontFamily: fonts.pixeSansBold,
  },
  formContainer: {
    height: 200,
    justifyContent: 'space-evenly',
  },
  input: {
    height: 40,
    borderRadius: 12,
    paddingHorizontal: 10,
    fontFamily: fonts.Rcr,
    fontSize: 13,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default OnBoarding;
