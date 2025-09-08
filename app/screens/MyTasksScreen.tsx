import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/AppStackParams';
import MainContainer from '../components/container/MainContainer';
import { Text } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { sendRequest } from '../config/compose';

interface ITask {
  id: number;
  name: string;
  status: 'publish' | 'completed';
  due_date: string;
  date_submitted?: string;
}

type Props = NativeStackScreenProps<HomeStackParamList, 'MyTasks'>;

const MyTasksScreen = ({ navigation }: Props) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMyTasks = useCallback(async () => {
    setLoading(true);
    const response = await sendRequest(
      'api/member/tasks',
      { page: 1, status: false },
      'GET',
    );
    setLoading(false);
    if (response.status) {
      setTasks(response.data?.data ?? []);
    } else {
      alert(response.message ?? 'Server error');
    }
  }, []);

  useEffect(() => {
    loadMyTasks();
  }, [loadMyTasks]);

  return (
    <MainContainer>
      <Text>My Tasks</Text>
    </MainContainer>
  );
};

export default MyTasksScreen;
