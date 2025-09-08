import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/AppStackParams';
import MainContainer from '../components/container/MainContainer';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { sendRequest } from '../config/compose';
import { COLORS } from '../config/constants';
import moment from 'moment';

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
      <Text style={styles.screenTitle}>My Tasks</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : tasks.length === 0 ? (
        <Text style={styles.emptyText}>No tasks found</Text>
      ) : (
        <View style={styles.listContainer}>
          {tasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskName}>{task.name}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        task.status === 'completed'
                          ? COLORS.success
                          : COLORS.pending,
                    },
                  ]}>
                  <Text style={styles.statusText}>
                    {task.status === 'completed' ? 'Completed' : 'Assigned'}
                  </Text>
                </View>
              </View>

              <View style={styles.taskDetails}>
                <View style={styles.dateRow}>
                  <Text style={styles.dateLabel}>Due Date:</Text>
                  <Text style={styles.dateValue}>
                    {moment(task.due_date).format('MM/DD/YYYY')}
                  </Text>
                </View>

                {task.status === 'completed' && task.date_submitted && (
                  <View style={styles.dateRow}>
                    <Text style={styles.dateLabel}>Completed:</Text>
                    <Text style={[styles.dateValue, styles.completedDate]}>
                      {moment(task.date_submitted).format('MM/DD/YYYY')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  taskDetails: {
    gap: 8,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 14,
    color: COLORS.greyBlue,
    fontWeight: '500',
  },
  dateValue: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '600',
  },
  completedDate: {
    color: COLORS.success,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.greyBlue,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default MyTasksScreen;
