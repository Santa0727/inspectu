import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ProfileScreen from '../screens/auth/ProfileScreen';
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
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadMyProfile, selectToken } from '../store/auth/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, View, StyleSheet, Dimensions } from 'react-native';
import MyTasksScreen from '../screens/MyTasksScreen';

const splashImage = require('../../assets/splash.png');

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
    <HomeStack.Screen
      options={{ headerShown: false }}
      name="MyTasks"
      component={MyTasksScreen}
    />
  </HomeStack.Navigator>
);

const MainStack = createDrawerNavigator<MainStackParamList>();

const MainNavigator = () => {
  const dispatch = useAppDispatch();

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
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);

  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const savedToken = await AsyncStorage.getItem('__token');
      if (savedToken) {
        await dispatch(loadMyProfile());
      }
      setAppLoading(false);
    })();
  }, []);

  if (appLoading) {
    return (
      <View style={styles.splash}>
        <Image
          source={splashImage}
          style={styles.splashImage}
          resizeMode="cover"
        />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {!token ? <AuthNavigator /> : <MainNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default AppNavigator;
