import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../store/auth/auth.selector';
import ProfileScreen from '../screens/auth/ProfileScreen';
import { loadMyProfile } from '../store/auth/auth.actions';
import InspectEntryScreen from '../screens/inspect/InspectEntryScreen';
import {
  AuthStackParamList,
  HomeStackParamList,
  MainStackParamList,
} from './AppStackParams';
import HelpScreen from '../screens/HelpScreen';
import SchoolScreen from '../screens/inspect/SchoolScreen';
import InspectReviewScreen from '../screens/inspect/InspectReviewScreen';
import HomeScreen from '../screens/HomeScreen';
import ScheduleScreen from '../screens/ScheduleScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      options={{ headerShown: false }}
      name="SignIn"
      component={LoginScreen}
    />
    <AuthStack.Screen
      options={{ headerShown: false }}
      name="SignUp"
      component={RegisterScreen}
    />
  </AuthStack.Navigator>
);

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      options={{ headerShown: false }}
      name="Inspections"
      component={HomeScreen}
    />
    <HomeStack.Screen
      options={{ headerShown: false }}
      name="InspectEntry"
      component={InspectEntryScreen}
    />
    <HomeStack.Screen
      options={{ headerShown: false }}
      name="InspectReview"
      component={InspectReviewScreen}
    />
    <HomeStack.Screen
      options={{ headerShown: false }}
      name="School"
      component={SchoolScreen}
    />
    <HomeStack.Screen
      options={{ headerShown: false }}
      name="Schedule"
      component={ScheduleScreen}
    />
  </HomeStack.Navigator>
);

const MainStack = createDrawerNavigator<MainStackParamList>();

const MainNavigator = () => {
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(loadMyProfile());
  }, [dispatch]);

  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Home"
        options={{ headerShown: false, drawerLabel: 'Home' }}
        component={HomeNavigator}
      />
      <MainStack.Screen
        name="Profile"
        options={{ headerShown: false, drawerLabel: 'Profile' }}
        component={ProfileScreen}
      />
      <MainStack.Screen
        name="Help"
        options={{ headerShown: false, drawerLabel: 'Help' }}
        component={HelpScreen}
      />
    </MainStack.Navigator>
  );
};

const AppNavigator = () => {
  const token = useSelector(selectToken);

  return (
    <NavigationContainer>
      {!token ? <AuthNavigator /> : <MainNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
