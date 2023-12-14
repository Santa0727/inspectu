import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MainContainer from '../components/container/MainContainer';
import React, { useCallback, useEffect, useState } from 'react';
import { sendRequest } from '../config/compose';
import { IUser } from '../lib/entities';
import { toastError } from '../lib/helper';
import TouchButton from '../components/ui/TouchButton';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/AppNavigator';
import { loadUsers } from '../store/manage/manage.actions';
import { selectUsers } from '../store/manage/manage.selector';

interface CardProps {
  user: IUser;
  onUpdateClick: (d: IUser) => void;
  loadData: () => void;
}

const UserCard = ({ user, onUpdateClick, loadData }: CardProps) => {
  const [disabled, setDisabled] = useState(false);

  const deleteClick = async () => {
    setDisabled(true);
    const res = await sendRequest(
      `api/director/users/delete/${user.id}`,
      {},
      'DELETE',
    );
    if (res.status) {
      setDisabled(false);
      await loadData();
    } else {
      setDisabled(false);
      alert(res.message ?? 'Failed to delete');
    }
  };

  return (
    <View style={styles.user_card}>
      <Text style={styles.user_name}>{`Name: ${user.name}`}</Text>
      <Text style={styles.user_email}>{`Email: ${user.email}`}</Text>
      <Text style={styles.role_txt}>
        {user.roles.length <= 0
          ? 'No roles'
          : `Role: ${user.roles.map((x) => x.name).join(', ')}`}
      </Text>
      <Text style={styles.role_txt}>
        {user.schools.length <= 0
          ? 'No schools'
          : `Schools: ${user.schools.map((x) => x.name).join(', ')}`}
      </Text>
      <View style={styles.btn_row}>
        <TouchButton
          size="small"
          label="Update"
          scheme="primary"
          disabled={disabled}
          onPress={() => onUpdateClick(user)}
        />
        <View style={{ width: 5 }} />
        <TouchButton
          size="small"
          label="Delete"
          scheme="danger"
          disabled={disabled}
          onPress={deleteClick}
        />
      </View>
    </View>
  );
};

type Props = NativeStackScreenProps<MainStackParamList, 'Users'>;

const UserListScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch<any>();
  const users = useSelector(selectUsers);

  const [loading, setLoading] = useState(true);

  const goToUser = (user: IUser) => navigation.navigate('UserDetail', { user });

  const loadData = useCallback(async () => {
    setLoading(true);
    const r = await dispatch(loadUsers());
    if (r !== true) {
      toastError(r);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <MainContainer>
      <Text style={styles.title}>Users list</Text>
      {loading ? (
        <View style={{ paddingTop: '50%' }}>
          <ActivityIndicator size="large" color={'black'} />
        </View>
      ) : (
        <View style={{ paddingHorizontal: 5 }}>
          {users &&
            users.map((x) => (
              <UserCard
                key={x.id}
                user={x}
                onUpdateClick={(u) => goToUser(u)}
                loadData={loadData}
              />
            ))}
        </View>
      )}
      <View style={{ height: 20 }} />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: 30,
    marginVertical: 30,
  },
  user_card: {
    marginVertical: 10,
    marginHorizontal: 8,
    borderColor: '#b3b3b3',
    borderWidth: 1,
    borderRadius: 3,
    padding: 10,
  },
  user_name: {
    fontSize: 20,
    fontWeight: '600',
  },
  user_email: {
    marginVertical: 5,
    fontSize: 19,
    fontWeight: '600',
  },
  role_txt: {
    fontSize: 19,
    fontWeight: '600',
  },
  btn_row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  modal_wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcf',
  },
  modal_inner: {
    marginTop: 350,
    backgroundColor: 'white',
  },
});

export default UserListScreen;
