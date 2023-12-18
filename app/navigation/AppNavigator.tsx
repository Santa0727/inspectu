import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../store/auth/auth.selector';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UserListScreen from '../screens/UserListScreen';
import { IUser } from '../lib/entities';
import UserDetailScreen from '../screens/UserDetailScreen';
import { useEffect } from 'react';
import { loadMyProfile } from '../store/auth/auth.actions';
import SchoolListScreen from '../screens/SchoolListScreen';
import InspectionScreen from '../screens/InspectionScreen';
import PostDetailScreen from '../screens/PostDetailScreen';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

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

export type MainStackParamList = {
  Home: undefined;
  Profile: undefined;
  Users: undefined;
  UserDetail: { user: IUser };
  Schools: undefined;
  Inspect: undefined;
  PostDetail: undefined;
};

const MainStack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(loadMyProfile());
  }, [dispatch]);

  return (
    <MainStack.Navigator>
      <MainStack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
      />
      <MainStack.Screen
        options={{ headerShown: false }}
        name="Profile"
        component={ProfileScreen}
      />
      <MainStack.Screen
        options={{ headerShown: true }}
        name="Users"
        component={UserListScreen}
      />
      <MainStack.Screen
        options={{ headerShown: true }}
        name="UserDetail"
        component={UserDetailScreen}
      />
      <MainStack.Screen
        options={{ headerShown: true }}
        name="Schools"
        component={SchoolListScreen}
      />
      <MainStack.Screen
        options={{ headerShown: false }}
        name="Inspect"
        component={InspectionScreen}
      />
      <MainStack.Screen
        options={{ headerShown: false }}
        name="PostDetail"
        component={PostDetailScreen}
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
