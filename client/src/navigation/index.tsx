import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Home from '~/screens/Home';
import OnBoarding from '~/screens/OnBoarding';
import useThemeStore from '~/store/themeStore';
import { Theme } from '~/utils/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { fonts } from '~/utils/fonts';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStackArray = [
  {
    name: 'OnBoarding',
    component: OnBoarding,
  },
];

const AfterAuthBotArray = [
  {
    name: 'Home',
    component: Home,
    activeIcon: 'home',
    inactiveIcon: 'home-outline',
  },
  {
    name: 'Homee',
    component: Home,
    activeIcon: 'home',
    inactiveIcon: 'home-outline',
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

const AfterAutnBotTab = () => {
  const theme = Theme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: theme.base07,
        headerTitleStyle: {
          fontFamily: fonts.pixeSansRegular,
        },
        headerStyle: {
          backgroundColor: theme.base00,
          borderBottomWidth: 1,
        },
        tabBarStyle: {
          backgroundColor: theme.base00,
          height: 40,
          borderTopWidth: 0,
        },
      }}>
      {AfterAuthBotArray.map((route) => (
        <Tab.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? route.activeIcon : route.inactiveIcon}
                size={20}
                color={focused ? theme.base05 : theme.base0A}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};
const AfterAutnStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTab" component={AfterAutnBotTab} />
    </Stack.Navigator>
  );
};

const RootStack = () => {
  const t = Theme();
  const { theme } = useThemeStore();
  const isLogin = true;
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={t.base00} style={theme == 'dark' ? 'light' : 'dark'} />
      {isLogin ? <AfterAutnStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootStack;
