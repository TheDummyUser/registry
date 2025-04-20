import React from 'react';
import { Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import CustomButton from '~/components/CustomButton';
import InputField from '~/components/InputField';
import Container from '~/components/container';
import { useLoginMutation } from '~/redux/services/authService';
import { colors } from '~/utils/colors';

// Zod schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginForm = z.infer<typeof loginSchema>;

const OnBoarding = () => {
  const [login, { data }] = useLoginMutation();

  console.log('login data', data);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    console.log('Login payload =>', data);
    try {
      await login(data).unwrap();
    } catch (err) {
      console.log('Login error:', err);
    }
  };

  return (
    <Container>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ height: 100 }}>
          <Text style={{ color: colors.secondary, fontSize: 25 }}>Registry...</Text>
          <Text style={{ color: colors.secondary, fontSize: 20 }}>
            A Single Source for all your {'\n'}company needs...
          </Text>
        </View>

        <View style={{ height: 150, justifyContent: 'space-around' }}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <InputField
                label="Email"
                placeholder="Enter your email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={error?.message}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <InputField
                label="Password"
                placeholder="Enter your password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={error?.message}
                secureTextEntry
              />
            )}
          />

          <CustomButton text="Login" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
    </Container>
  );
};

export default OnBoarding;
