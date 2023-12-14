import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { MainStackParamList } from '../navigation/AppNavigator';
import MainContainer from '../components/container/MainContainer';
import Input from '../components/ui/Input';
import SingleSelect from '../components/ui/SingleSelect';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectRoles, selectSchools } from '../store/manage/manage.selector';
import TouchButton from '../components/ui/TouchButton';
import { toastError, toastSuccess } from '../lib/helper';
import { sendRequest } from '../config/compose';
import { loadUsers } from '../store/manage/manage.actions';

interface IForm {
  name: string;
  role?: number;
  school?: number;
}

type Props = NativeStackScreenProps<MainStackParamList, 'UserDetail'>;

const UserDetailScreen = ({ route }: Props) => {
  const user = route.params.user;
  const dispatch = useDispatch<any>();
  const schools = useSelector(selectSchools);
  const roles = useSelector(selectRoles);

  const [form, setForm] = useState<IForm>({
    name: user.name,
    role: user.roles.length <= 0 ? undefined : user.roles[0].id,
    school: user.schools.length <= 0 ? undefined : user.schools[0].id,
  });
  const [disabled, setDisabled] = useState(false);

  const updateForm = (key: keyof IForm, val: any) => {
    setForm({ ...form, [key]: val });
  };
  const updateClick = async () => {
    if (!form.name) {
      toastError('Empty name is not allowed');
      return;
    }

    setDisabled(true);
    const res = await sendRequest(
      `api/director/users/update/${user.id}`,
      form,
      'PATCH',
    );
    setDisabled(false);
    if (res.status) {
      await dispatch(loadUsers());
      toastSuccess(res.message ?? 'Updated successfully');
    } else {
      console.log(res);
      let message: any = res.message;
      if (res.data?.errors) {
        const errors = Object.values(res.data.errors);
        message = errors.reduce((p: any, c: any) => [...p, ...c], []);
        message = message.join(', ');
      }
      alert(message ?? 'Server error');
      setDisabled(false);
    }
  };

  return (
    <MainContainer style={styles.container}>
      <View style={{ marginVertical: 10 }}>
        <Input
          label="Name"
          value={form.name}
          onChange={(v) => updateForm('name', v)}
        />
        <Input label="Email" value={user.email} disabled={true} />
      </View>
      <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
        <SingleSelect
          label="Role"
          options={roles.map((x) => ({ value: x.id, label: x.name }))}
          value={form.role}
          onChange={(v) => updateForm('role', v)}
        />
        <SingleSelect
          label="School"
          options={schools.map((x) => ({ value: x.id, label: x.name }))}
          value={form.school}
          onChange={(v) => updateForm('school', v)}
        />
      </View>
      <View style={{ marginVertical: 20, alignItems: 'center' }}>
        <TouchButton
          scheme="success"
          label="Update"
          disabled={disabled}
          onPress={updateClick}
        />
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default UserDetailScreen;
