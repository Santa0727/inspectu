import { useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Input from '../../components/ui/Input';
import TouchButton from '../../components/ui/TouchButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppContainer from '../../components/container/AppContainer';
import { AuthStackParamList } from '../../navigation/AppStackParams';
import { isEmailFormat } from '../../lib/helper';
import { COLORS } from '../../config/constants';
import { useAppDispatch } from '../../store/hooks';
import { login as authLogin } from '../../store/auth/authSlice';

const loginImage = require('../../images/login-logo.png');

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

const LoginScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();

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
    const res = await dispatch(authLogin({ email, password }));
    setDisabled(false);

    if (authLogin.rejected.match(res)) {
      alert(res.payload);
      return;
    }
  };

  return (
    <AppContainer
      style={{
        height: Dimensions.get('window').height - 39,
        backgroundColor: 'white',
      }}>
      <View
        style={{
          height: Dimensions.get('window').height / 2 - 90,
          justifyContent: 'center',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Image
            source={loginImage}
            style={{ height: 120, width: '98%' }}
            resizeMode="contain"
          />
        </View>
      </View>
      <View
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 100,
        }}>
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
        <TouchButton
          label="Sign In"
          onPress={confirmClick}
          disabled={disabled}
          scheme="red"
          style={{ marginVertical: 20, marginHorizontal: 10 }}
        />
        <TouchableOpacity style={{ marginHorizontal: 10 }}>
          <Text style={styles.link}>Forget password?</Text>
        </TouchableOpacity>
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
    color: COLORS.red,
  },
});

export default LoginScreen;
