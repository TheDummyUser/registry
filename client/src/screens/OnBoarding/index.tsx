import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { loginApi } from '~/apiconfig/services';
import MainContainer from '~/components/Container';
import CustomButton from '~/components/CustomButton';
import { useUserStore } from '~/store/userStore';
import { Theme } from '~/utils/colors';
import { fonts } from '~/utils/fonts';
import { FormData } from '~/utils/types';
import { validationRules } from '~/utils/validationSchema';

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
    mode: 'onBlur',
  });
  const { setUser } = useUserStore();
  const onSubmit = (data: FormData) => {
    console.log('button Pressed', data);
    mutation.mutate(data);
  };
  const theme = Theme();

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setUser({
        details: data.details,
      });
    },
    onError: (data) => {
      console.log('error', data);
    },
  });
  return (
    <MainContainer ph={15} center={true} style={{}}>
      <View style={styles.headerContainer}>
        <Text style={[styles.textStyle, { color: theme.base07 }]}>Registry</Text>
        <Text style={[styles.textStyle, { color: theme.base07, fontSize: 16 }]}>
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
              style={[styles.input, { backgroundColor: theme.base02, color: theme.base06 }]}
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
              style={[styles.input, { backgroundColor: theme.base02, color: theme.base06 }]}
              secureTextEntry
              accessibilityLabel="Password Input"
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
        {mutation.error && <Text style={styles.errorText}>{mutation.error.message}</Text>}
        <CustomButton
          text="Login"
          disabled={!isValid}
          bgColor={theme.base02}
          width="100%"
          height={50}
          fontsize={20}
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
    fontSize: 34,
    fontFamily: fonts.pixeSansBold,
  },
  formContainer: {
    height: 200,
    justifyContent: 'space-evenly',
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 10,
    fontFamily: fonts.Pr,
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
