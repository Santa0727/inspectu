import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Input from '../components/ui/Input';
import TouchButton from '../components/ui/TouchButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AppNavigator';
import { useDispatch } from 'react-redux';
import { isEmailFormat } from '../config/helper';
import { authLogin } from '../store/auth/auth.actions';
import AppContainer from '../components/container/AppContainer';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

const LoginScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch<any>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [valid, setValid] = useState({ email: '', password: '' });
  const [disabled, setDisabled] = useState(false);
  const [hidePass, setHidePass] = useState(true);

  const isValid = () => {
    let tmp = { email: '', password: '' };
    let res = true;
    if (!email) {
      tmp.email = 'Email is required';
      res = false;
    } else if (!isEmailFormat(email)) {
      tmp.email = 'Invalid email format';
      res = false;
    }
    if (!password) {
      tmp.password = 'Password is required';
      res = false;
    }
    setValid(tmp);
    return res;
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
    <AppContainer>
      <Text style={styles.title}>Login</Text>
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
          icon="email"
          error={valid.email}
        />
        <Input
          label="Password"
          placeholder="Please enter your password"
          type="visible-password"
          autoCapitalize="none"
          security={hidePass}
          value={password}
          onChange={(v) => {
            setPassword(v);
            setValid((prv) => ({ ...prv, password: '' }));
          }}
          error={valid.password}
          icon={hidePass ? 'eye-on' : 'eye-off'}
          onIconTouch={() => setHidePass(!hidePass)}
        />
      </View>
      <View
        style={{
          marginTop: 20,
          marginBottom: 10,
          width: '100%',
          paddingHorizontal: 10,
        }}>
        <TouchableOpacity style={{ marginBottom: 30, marginHorizontal: 10 }}>
          <Text style={styles.link}>Forgot password</Text>
        </TouchableOpacity>
        <View style={{ marginVertical: 20 }}>
          <TouchButton
            label="Login"
            onPress={confirmClick}
            disabled={disabled}
          />
        </View>
      </View>
    </AppContainer>
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
    marginTop: '20%',
  },
  link: {
    fontSize: 22,
    textDecorationLine: 'underline',
    fontWeight: '400',
  },
});

export default LoginScreen;
