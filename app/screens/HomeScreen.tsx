import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectProfile } from '../store/auth/auth.selector';
import TouchButton from '../components/ui/TouchButton';
import { authLogout } from '../store/auth/auth.actions';
import { MainStackParamList } from '../navigation/AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<MainStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch<any>();
  const profile = useSelector(selectProfile);

  const [disabled, setDisabled] = useState(false);

  const logoutClick = async () => {
    setDisabled(true);
    await dispatch(authLogout());
    setDisabled(false);
  };

  return (
    <View style={styles.view}>
      <Text style={styles.title}>
        {!profile
          ? 'Invalid access'
          : `Hello ${profile.name} (${profile.email})`}
      </Text>
      <View style={{ width: '80%', marginVertical: 15 }}>
        <TouchButton
          label="View Profile"
          onPress={() => navigation.navigate('Profile')}
          disabled={disabled}
        />
      </View>
      <View style={{ width: '80%', marginVertical: 15 }}>
        <TouchButton
          label="List users"
          onPress={() => navigation.navigate('Users')}
          disabled={disabled}
        />
      </View>
      <View style={{ width: '80%', marginVertical: 15 }}>
        <TouchButton
          label="List schools"
          onPress={() => navigation.navigate('Schools')}
          disabled={disabled}
        />
      </View>
      <View style={{ width: '80%', marginVertical: 20 }}>
        <TouchButton
          label="Sign Out"
          scheme="secondary"
          onPress={logoutClick}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: 30,
    marginVertical: 30,
  },
});

export default HomeScreen;
