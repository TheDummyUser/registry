import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useColorScheme } from 'react-native';
import Home from '~/screens/Home';
import OnBoarding from '~/screens/OnBoarding';
import useThemeStore from '~/store/themeStore';
import { Theme } from '~/utils/colors';
const Stack = createNativeStackNavigator();

const AuthStackArray = [
  {
    name: 'OnBoarding',
    component: OnBoarding,
  },
];

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {AuthStackArray.map(({ name, component }) => (
        <Stack.Screen key={name} name={name} component={component} />
      ))}
    </Stack.Navigator>
  );
};

const RootStack = () => {
  const t = Theme();
  const { theme } = useThemeStore();
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={t.base00} style={theme == 'dark' ? 'light' : 'dark'} />
      <AuthStack />
    </NavigationContainer>
  );
};

export default RootStack;
