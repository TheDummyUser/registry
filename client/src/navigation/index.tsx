import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import Calender from '~/screens/Calender';
import Home from '~/screens/Home';
import OnBoarding from '~/screens/OnBoarding';

const Stack = createStackNavigator();

const TabNavItems = [
  {
    id: 1,
    name: 'Home',
    component: Home,
    activeIcon: 'home',
    inavtiveIcon: 'home-outline',
  },
  {
    id: 2,
    name: 'Calender',
    component: Calender,
    activeIcon: 'calendar',
    inavtiveIcon: 'calendar-outline',
  },
];

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
    </Stack.Navigator>
  );
};

const Tabs = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarStyle: { height: 60, backgroundColor: 'white', elevation: 0 },
        tabBarLabelStyle: { fontSize: 10, color: 'black' },
      }}>
      {TabNavItems.map(({ id, name, component, activeIcon, inavtiveIcon }) => (
        <Tabs.Screen
          key={id}
          name={name}
          component={component}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  backgroundColor: focused ? 'lightgreen' : 'transparent',
                  width: 50,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 18,
                }}>
                <Ionicons
                  name={focused ? activeIcon : inavtiveIcon}
                  size={18}
                  color={focused ? 'white' : 'grey'}
                />
              </View>
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? 'lightgreen' : 'grey', fontSize: 11 }}>
                {focused ? name : name}
              </Text>
            ),
          }}
        />
      ))}
    </Tabs.Navigator>
  );
};

export default function Navigation() {
  const isLogin = false;
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>{isLogin ? <BottomTabs /> : <AuthStack />}</NavigationContainer>
    </>
  );
}
