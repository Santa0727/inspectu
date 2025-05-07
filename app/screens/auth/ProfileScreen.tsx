import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Input from '../../components/ui/Input';
import MainContainer from '../../components/container/MainContainer';
import TouchButton from '../../components/ui/TouchButton';
import { toastError, toastSuccess } from '../../lib/helper';
import { sendRequest } from '../../config/compose';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  loadMyProfile,
  logoutAsync,
  selectProfile,
} from '../../store/auth/authSlice';

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);

  const [disabled, setDisabled] = useState(false);
  const [name, setName] = useState(profile?.name ?? '');
  const [pForm, setPForm] = useState({
    password: '',
    password_confirmation: '',
    current_password: '',
  });

  const updateProfile = async () => {
    if (!name) {
      toastError('Empty name is not allowed');
      return;
    }
    if (name === profile?.name) return;

    setDisabled(true);
    const res = await sendRequest('api/member/self/update', { name }, 'PATCH');
    if (!res.status) {
      setDisabled(false);
      let message: any = res.message;
      if (res.data.errors) {
        message = Object.values(res.data.errors).reduce(
          (p: any, c: any) => [...p, ...c],
          [],
        );
        message = message.join(', ');
      }
      toastError(message ?? 'Server error');
    } else {
      await dispatch(loadMyProfile());
      setDisabled(false);
      toastSuccess(res.data?.message ?? 'Success');
    }
  };
  const updatePassword = async () => {
    if (!pForm.password) {
      toastError('Please enter new password');
      return;
    }
    if (pForm.password !== pForm.password_confirmation) {
      toastError('Password confirmation mismatch');
      return;
    }
    if (!pForm.current_password) {
      toastError('Please enter your current password');
      return;
    }
    if (pForm.password === pForm.current_password) return;

    setDisabled(true);
    const res = await sendRequest('api/member/self/password', pForm, 'POST');
    setDisabled(false);
    if (!res.status) {
      let message: any = res.message;
      if (res.data.errors) {
        message = Object.values(res.data.errors).reduce(
          (p: any, c: any) => [...p, ...c],
          [],
        );
        message = message.join(', ');
      }
      toastError(message ?? 'Server error');
    } else {
      setPForm({
        password: '',
        password_confirmation: '',
        current_password: '',
      });
      toastSuccess(res.data?.message ?? 'Success');
    }
  };
  const logoutClick = async () => {
    setDisabled(true);
    await dispatch(logoutAsync());
  };

  return (
    <MainContainer>
      <Text style={styles.title}>Your profile</Text>
      <View style={{ marginVertical: 15 }}>
        <Input
          label="Name"
          placeholder="Please enter your name"
          type="default"
          value={name}
          onChange={(t) => setName(t)}
        />
        <Input
          label="Email"
          type="email-address"
          autoCapitalize="none"
          value={profile?.email ?? ''}
          disabled={true}
        />
        <View style={styles.update_btn}>
          <TouchButton
            label="Update profile"
            onPress={updateProfile}
            disabled={disabled}
          />
        </View>
      </View>
      <View style={{ marginVertical: 15, paddingBottom: 20 }}>
        <Input
          label="Current password"
          placeholder="Please enter your current password"
          type="visible-password"
          autoCapitalize="none"
          value={pForm.current_password}
          onChange={(t) => setPForm((p) => ({ ...p, current_password: t }))}
          security={true}
        />
        <Input
          label="New password"
          placeholder="Please enter new password"
          type="visible-password"
          autoCapitalize="none"
          value={pForm.password}
          onChange={(t) => setPForm((p) => ({ ...p, password: t }))}
          security={true}
        />
        <Input
          label="Password confirmation"
          placeholder="Please confirm your password"
          type="visible-password"
          autoCapitalize="none"
          value={pForm.password_confirmation}
          onChange={(t) =>
            setPForm((p) => ({ ...p, password_confirmation: t }))
          }
          security={true}
        />
        <View style={styles.update_btn}>
          <TouchButton
            label="Change password"
            disabled={disabled}
            onPress={updatePassword}
          />
        </View>
        <View style={styles.update_btn}>
          <TouchButton
            label="Logout"
            disabled={disabled}
            scheme="danger"
            onPress={logoutClick}
          />
        </View>
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  update_btn: {
    margin: 10,
  },
});

export default ProfileScreen;
