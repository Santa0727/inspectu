import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/AppStackParams';
import MainContainer from '../components/container/MainContainer';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { sendRequest } from '../config/compose';
import { COLORS } from '../config/constants';
import moment from 'moment';
import MyTaskModal from '../components/manage/MyTaskModal';

interface ITask {
  id: number;
  name: string;
  status: 'publish' | 'completed';
  due_date: string;
  date_submitted?: string;
}

interface IListItem {
  id: string;
  name: string;
}

interface ITaskDetail extends ITask {
  intro: string;
  task_list: IListItem[];
}

type Props = NativeStackScreenProps<HomeStackParamList, 'MyTasks'>;

const MyTasksScreen = ({ navigation }: Props) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<ITaskDetail>();
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);

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

  const clickTask = async (taskId: number) => {
    setLoadingTaskId(taskId);
    const response = await sendRequest(`api/member/tasks/${taskId}`, {}, 'GET');
    setLoadingTaskId(null);

    if (response.status) {
      setDetail(response.data);
    } else {
      alert(response.message ?? 'Failed to load task details');
    }
  };

  useEffect(() => {
    loadMyTasks();
  }, [loadMyTasks]);

  const pendingTasks = tasks.filter((task) => task.status !== 'completed');
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  const renderTaskCard = (task: ITask) => (
    <TouchableOpacity
      key={task.id}
      style={[
        styles.taskCard,
        task.status !== 'completed' && styles.clickableCard,
        loadingTaskId === task.id && styles.loadingCard,
      ]}
      onPress={() => task.status !== 'completed' && clickTask(task.id)}
      disabled={task.status === 'completed' || loadingTaskId === task.id}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskName}>{task.name}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                task.status === 'completed' ? COLORS.success : COLORS.pending,
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

      {loadingTaskId === task.id && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={COLORS.secondary} />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      )}
    </TouchableOpacity>
  );

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
          {pendingTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Pending Tasks ({pendingTasks.length})
              </Text>
              {pendingTasks.map(renderTaskCard)}
            </View>
          )}
          {completedTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Completed Tasks ({completedTasks.length})
              </Text>
              {completedTasks.map(renderTaskCard)}
            </View>
          )}
        </View>
      )}
      {!!detail && (
        <MyTaskModal
          visible={true}
          task={detail}
          onClose={() => setDetail(undefined)}
          onSuccess={loadMyTasks}
        />
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
  clickableCard: {
    shadowOpacity: 0.15,
    elevation: 6,
    borderLeftWidth: 5,
  },
  loadingCard: {
    backgroundColor: '#f8f9fa',
    borderLeftColor: COLORS.secondary,
    shadowOpacity: 0.2,
    elevation: 8,
    opacity: 0.8,
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
  loadingOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.inactive,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.secondary,
    marginLeft: 8,
    fontWeight: '500',
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 12,
    paddingLeft: 4,
  },
});

export default MyTasksScreen;
