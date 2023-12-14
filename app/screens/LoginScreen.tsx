import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Input from '../components/ui/Input';
import TouchButton from '../components/ui/TouchButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AppNavigator';
import { useDispatch } from 'react-redux';
import { isEmailFormat } from '../config/helper';
import { authLogin } from '../store/auth/auth.actions';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

const LoginScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch<any>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [valid, setValid] = useState({ email: '', password: '' });
  const [disabled, setDisabled] = useState(false);

  const isValid = () => {
    let tmp = { email: '', password: '' };
    if (!email) {
      tmp.email = 'Email is required';
    } else if (!isEmailFormat(email)) {
      tmp.email = 'Invalid email format';
    }
    if (!password) {
      tmp.password = 'Password is required';
    }
    setValid(tmp);
    return email && password;
  };
  const confirmClick = async () => {
    if (!isValid()) return;

    setDisabled(true);
    const res = await dispatch(authLogin(email, password));
    setDisabled(false);

    if (res !== true) {
      alert(res);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.view}
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
        <Text style={styles.title}>Sign In</Text>
        <View style={{ width: '100%' }}>
          <Input
            label="Email"
            placeholder="Please enter your email"
            type="email-address"
            autoCapitalize="none"
            value={email}
            onChange={(v) => {
              setEmail(v);
              setValid((prv) => ({ ...prv, email: '' }));
            }}
            error={valid.email}
          />
          <Input
            label="Password"
            placeholder="Please enter your email"
            type="visible-password"
            autoCapitalize="none"
            security={true}
            value={password}
            onChange={(v) => {
              setPassword(v);
              setValid((prv) => ({ ...prv, password: '' }));
            }}
            error={valid.password}
          />
        </View>
        <View
          style={{
            marginTop: 20,
            marginBottom: 10,
            width: '100%',
            paddingHorizontal: 10,
          }}>
          <TouchButton
            label="Sign in"
            onPress={confirmClick}
            disabled={disabled}
          />
        </View>
        <View
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: '100%',
            paddingHorizontal: 10,
          }}>
          <TouchButton
            label="Go to sign up"
            scheme="secondary"
            onPress={() => navigation.navigate('SignUp')}
            disabled={disabled}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 50,
  },
});

export default LoginScreen;
