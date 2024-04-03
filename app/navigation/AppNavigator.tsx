import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../store/auth/auth.selector';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/auth/ProfileScreen';
import { loadMyProfile } from '../store/auth/auth.actions';
import InspectEntryScreen from '../screens/inspect/InspectEntryScreen';
import {
  AuthStackParamList,
  InspectStackParamList,
  MainStackParamList,
} from './AppStackParams';
import ScheduleScreen from '../screens/ScheduleScreen';
import HelpScreen from '../screens/HelpScreen';
import SchoolScreen from '../screens/inspect/SchoolScreen';
import InspectReviewScreen from '../screens/inspect/InspectReviewScreen';

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

const InspectStack = createNativeStackNavigator<InspectStackParamList>();

const InspectNavigator = () => (
  <InspectStack.Navigator>
    <InspectStack.Screen
      options={{ headerShown: false }}
      name="Inspections"
      component={HomeScreen}
    />
    <InspectStack.Screen
      options={{ headerShown: false }}
      name="InspectEntry"
      component={InspectEntryScreen}
    />
    <InspectStack.Screen
      options={{ headerShown: false }}
      name="InspectReview"
      component={InspectReviewScreen}
    />
    <InspectStack.Screen
      options={{ headerShown: false }}
      name="School"
      component={SchoolScreen}
    />
  </InspectStack.Navigator>
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
        name="Inspect"
        options={{ headerShown: false, drawerLabel: 'Inspections' }}
        component={InspectNavigator}
      />
      <MainStack.Screen
        name="Profile"
        options={{ headerShown: false, drawerLabel: 'Profile' }}
        component={ProfileScreen}
      />
      <MainStack.Screen
        name="Schedule"
        options={{ headerShown: false, drawerLabel: 'Schedule' }}
        component={ScheduleScreen}
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
