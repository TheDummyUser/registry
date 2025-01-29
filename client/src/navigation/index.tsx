import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useLogger } from '@react-navigation/devtools';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import AddUser from '~/screens/AddUser';
import Home from '~/screens/Home';
import OnBoarding from '~/screens/OnBoarding';
import UserAttendence from '~/screens/UserAttendence';
import useThemeStore from '~/store/themeStore';
import { useUserStore } from '~/store/userStore';
import { Theme } from '~/utils/colors';
import { fonts } from '~/utils/fonts';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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

const AfterAutnBotTab = () => {
  const { user } = useUserStore();

  const AfterAuthBotArray = [
    {
      name: 'Home',
      component: Home,
      activeIcon: 'home',
      inactiveIcon: 'home-outline',
    },
    {
      name: 'Attendence',
      component: UserAttendence,
      activeIcon: 'person',
      inactiveIcon: 'person-outline',
    },
    // Only include "Add User" tab if user is admin
    ...(user?.is_admin
      ? [
          {
            name: 'Add User',
            component: AddUser,
            activeIcon: 'person-add',
            inactiveIcon: 'person-add-outline',
          },
        ]
      : []),
  ];

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
          borderBottomWidth: 0.2,
          borderColor: theme.base07,
        },
        tabBarStyle: {
          backgroundColor: theme.base00,
          height: 45,
          borderTopWidth: 0.2,
          borderColor: theme.base07,
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
                color={focused ? theme.base05 : theme.base04}
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
  const navigationRef = useNavigationContainerRef();
  useLogger(navigationRef);
  const { theme } = useThemeStore();
  const { user } = useUserStore();

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar backgroundColor={t.base00} style={theme == 'dark' ? 'light' : 'dark'} />
      {user ? <AfterAutnStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootStack;
