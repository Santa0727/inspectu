import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MainContainer from '../components/container/MainContainer';
import { HomeStackParamList } from '../navigation/AppStackParams';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '../config/constants';
import { useCallback, useMemo, useState } from 'react';
import { IInspection } from '../lib/manage.entities';
import { sendRequest } from '../config/compose';
import { useFocusEffect } from '@react-navigation/native';
import InspectionCard from '../components/manage/InspectionCard';
import InspectionModal from '../components/manage/InspectionModal';
import Calendar from '../components/ui/Calendar';
import SingleSelect from '../components/ui/SingleSelect';
import TouchButton from '../components/ui/TouchButton';
import TaskModal from '../components/manage/TaskModal';
import { ITask } from '../lib/task.entities';
import { useAppSelector } from '../store/hooks';
import { selectProfile } from '../store/auth/authSlice';
import MyTaskModal from '../components/manage/MyTaskModal';

type Props = NativeStackScreenProps<HomeStackParamList, 'Inspections'>;

const HomeScreen = ({ navigation }: Props) => {
  const profile = useAppSelector(selectProfile);

  const [upItems, setUpItems] = useState<IInspection[]>();
  const [pastItems, setPastItems] = useState<IInspection[]>();
  const [curItem, setCurItem] = useState<IInspection>();

  const [filter, setFilter] = useState<{ date?: string; status?: string }>({});
  const [visCreateTask, setVisCreateTask] = useState(false);
  const [viewTask, setViewTask] = useState<ITask>();
  const [myTask, setMyTask] = useState<ITask>();
  const [tasks, setTasks] = useState<ITask[]>();

  const loadData = useCallback(() => {
    (async () => {
      const insResponse = await sendRequest(
        'api/member/inspections',
        { per_page: 50 },
        'GET',
      );
      if (insResponse.status) {
        setUpItems(insResponse.data.coming ?? []);
        setPastItems(insResponse.data.passed ?? []);
      } else {
        alert(insResponse.message ?? 'Server error');
      }
      const taskResponse = await sendRequest(
        'api/tasks',
        { per_page: 1000 },
        'GET',
      );
      if (taskResponse.status) {
        setTasks(taskResponse.data?.data ?? []);
      }
    })();
  }, []);

  const clickInspection = (item: IInspection) => {
    if (item.status === 'publish') {
      navigation.navigate('InspectEntry', { inspectID: item.id });
    } else if (item.status === 'review_required') {
      navigation.navigate('InspectReview', { inspectID: item.id });
    } else {
      setCurItem(item);
    }
  };
  const fetchMyTask = async (taskId: number) => {
    const response = await sendRequest(`api/member/tasks/${taskId}`, {}, 'GET');

    if (response.status) {
      setMyTask(response.data);
    } else {
      alert(response.message ?? 'Failed to load task details');
    }
  };

  const filteredItems = useMemo(() => {
    let result = pastItems ?? [];
    if (filter.date) {
      result = result.filter((x) => x.due_date.slice(0, 10) === filter.date);
    }
    if (filter.status) {
      result = result.filter((x) => x.status === filter.status);
    }
    return result;
  }, [filter, pastItems]);

  useFocusEffect(loadData);

  const markers = [
    ...[...(pastItems ?? []), ...(upItems ?? [])].map((x) => ({
      date: x.due_date.slice(0, 10),
      color:
        x.status === 'approved'
          ? COLORS.approved
          : x.status === 'pending_review'
          ? COLORS.pending
          : x.status === 'review_required'
          ? COLORS.danger
          : COLORS.inactive,
    })),
    ...(tasks ?? []).map((x) => ({
      date: x.due_date.slice(0, 10),
      isDot: true,
    })),
  ];

  return (
    <MainContainer>
      <View style={styles.panel}>
        <Calendar
          markers={markers}
          selectedDate={filter.date}
          onClick={(d) => setFilter((f) => ({ ...f, date: d }))}
        />
      </View>
      {!!filter.date && (
        <>
          {tasks
            ?.filter((x) => x.due_date.slice(0, 10) === filter.date)
            .map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[
                  styles.task_touch,
                  task.status === 'completed' && styles.task_completed,
                ]}
                onPress={() =>
                  task.status !== 'completed' &&
                  task.assigned_to.some((x) => x.id === profile?.id)
                    ? fetchMyTask(task.id)
                    : setViewTask(task)
                }>
                <Text style={styles.task_name}>{task.name}</Text>
                <Text style={styles.task_assigned}>
                  {task.assigned_to.map((x) => x.name).join(', ')}
                </Text>
                <Text style={styles.task_categories}>
                  {task.category.map((x) => x.name).join(', ')}
                </Text>
              </TouchableOpacity>
            ))}
          {profile?.user_permissions.includes('manage_tasks') && (
            <TouchButton
              style={{ margin: 10 }}
              label="Schedule Task"
              onPress={() => setVisCreateTask(true)}
            />
          )}
        </>
      )}
      <View style={styles.panel}>
        <View style={styles.panel_header}>
          <AntDesign name="clockcircle" size={24} color={COLORS.greyBlue} />
          <Text style={styles.panel_label}>{'Scheduled Inspections'}</Text>
        </View>
        <View style={{ minHeight: 100, paddingVertical: 10 }}>
          {upItems?.map((x) => (
            <InspectionCard key={x.id} data={x} onClick={clickInspection} />
          ))}
        </View>
      </View>
      <View style={styles.panel}>
        <View style={styles.panel_header}>
          <AntDesign name="clockcircle" size={24} color={COLORS.greyBlue} />
          <Text style={styles.panel_label}>Inspections</Text>
        </View>
        <SingleSelect
          style={{ marginHorizontal: 10, marginTop: 10, marginBottom: -10 }}
          label="Status"
          options={[
            { label: 'All', value: '' },
            { label: 'Approved', value: 'approved' },
            { label: 'Pending Review', value: 'pending_review' },
            { label: 'Review Required', value: 'review_required' },
            { label: 'Inactive', value: 'inactive' },
          ]}
          value={filter.status ?? ''}
          onChange={(v) =>
            setFilter((f) => ({
              ...f,
              status: v === '' ? undefined : String(v),
            }))
          }
        />
        <View style={{ minHeight: 100, paddingVertical: 10 }}>
          {filteredItems?.map((x) => (
            <InspectionCard key={x.id} data={x} onClick={clickInspection} />
          ))}
        </View>
      </View>
      {curItem && (
        <InspectionModal
          data={curItem}
          visible={true}
          onClose={() => setCurItem(undefined)}
        />
      )}
      {visCreateTask && (
        <TaskModal
          visible={visCreateTask}
          onClose={() => {
            loadData();
            setVisCreateTask(false);
          }}
          data={{ due_date: filter.date }}
        />
      )}
      {viewTask && (
        <TaskModal
          visible={true}
          onClose={() => setViewTask(undefined)}
          taskData={viewTask}
        />
      )}
      {myTask && (
        <MyTaskModal
          visible={true}
          task={myTask as any}
          onClose={() => setMyTask(undefined)}
          onSuccess={loadData}
        />
      )}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  panel: {
    borderColor: COLORS.blueGrey,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    marginVertical: 8,
    padding: 10,
  },
  panel_header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  panel_label: {
    fontWeight: '600',
    fontSize: 18,
    marginLeft: 12,
  },
  task_touch: {
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    borderColor: COLORS.blueGrey,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
  },
  task_completed: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
    opacity: 0.7,
  },
  task_name: {
    fontSize: 18,
    fontWeight: '600',
  },
  task_assigned: {
    fontSize: 15,
    color: COLORS.greyBlue,
    fontStyle: 'italic',
  },
  task_categories: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default HomeScreen;
