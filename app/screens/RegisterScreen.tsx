import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Input from '../components/ui/Input';
import TouchButton from '../components/ui/TouchButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { isEmailFormat } from '../config/helper';
import { authRegister } from '../store/auth/auth.actions';
import AppContainer from '../components/container/AppContainer';
import { AuthStackParamList } from '../navigation/AppStackParams';

interface IForm {
  name: string;
  email: string;
  password: string;
  invitation_code: string;
}

interface IError {
  name?: string;
  email?: string;
  password?: string;
}

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const RegisterScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch<any>();

  const [form, setForm] = useState<IForm>({
    name: '',
    email: '',
    password: '',
    invitation_code: 'DIRECTORDEMO',
  });
  const [valid, setValid] = useState<IError>({});
  const [disabled, setDisabled] = useState(false);

  const updateForm = (key: keyof IForm, val: string) => {
    setForm((prv) => ({ ...prv, [key]: val }));
    setValid((prv) => ({ ...prv, [key]: undefined }));
  };
  const isFormValid = () => {
    let res = true;
    let error: IError = {};
    if (!form.name) {
      error.name = 'Name is required';
      res = false;
    }
    if (!form.email) {
      error.email = 'Email is required';
      res = false;
    } else if (!isEmailFormat(form.email)) {
      error.email = 'Invalid email format';
      res = false;
    }
    if (!form.password || form.password.length < 6) {
      error.password = 'Minimum allowed length is 6';
      res = false;
    }
    setValid(error);
    return res;
  };
  const confirmClick = async () => {
    if (!isFormValid()) return;

    setDisabled(true);
    const res = await dispatch(authRegister(form));
    setDisabled(false);

    if (res !== true) {
      alert(res);
    }
  };

  return (
    <AppContainer>
      <Text style={styles.title}>Sign Up</Text>
      <View style={{ width: '100%' }}>
        <Input
          label="Name"
          placeholder="Please enter your name"
          type="default"
          value={form.name}
          onChange={(v) => updateForm('name', v)}
          error={valid.name}
        />
        <Input
          label="Email"
          placeholder="Please enter your email"
          type="email-address"
          autoCapitalize="none"
          value={form.email}
          onChange={(v) => updateForm('email', v)}
          error={valid.email}
        />
        <Input
          label="Password"
          placeholder="Please enter your password"
          type="visible-password"
          autoCapitalize="none"
          security={true}
          value={form.password}
          onChange={(v) => updateForm('password', v)}
          error={valid.password}
        />
        <Input
          label="Invitation code"
          placeholder="Please enter your invitation code"
          type="ascii-capable"
          autoCapitalize="none"
          value={form.invitation_code}
          onChange={(v) => updateForm('invitation_code', v)}
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
          label="Sign Up"
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
          label="Go to sign in"
          scheme="secondary"
          onPress={() => navigation.navigate('SignIn')}
          disabled={disabled}
        />
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
    marginTop: 30,
    marginBottom: 15,
  },
});

export default RegisterScreen;
