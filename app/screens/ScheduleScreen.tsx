import { StyleSheet, Text, View } from 'react-native';
import MainContainer from '../components/container/MainContainer';
import Calendar from '../components/ui/Calendar';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { sendRequest } from '../config/compose';
import { IInspection } from '../lib/entities';

const ScheduleScreen = () => {
  const [inspections, setInspections] = useState<IInspection[]>([]);
  const [curDate, setCurDate] = useState<string>();

  const loadData = useCallback(() => {
    (async () => {
      const res = await sendRequest('api/member/inspections', {}, 'GET');
      if (res.status) {
        setInspections(res.data.coming);
      }
    })();
  }, []);

  useFocusEffect(loadData);

  return (
    <MainContainer style={{ padding: 10 }}>
      {curDate && (
        <View style={{ marginVertical: 20 }}>
          <Text style={styles.title}>Inspections for {curDate}</Text>
        </View>
      )}
      <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
        {inspections
          .filter((x) => x.due_date.slice(0, 10) === curDate)
          .map((x) => (
            <Text key={x.id} style={styles.subtitle}>
              {`${x.name} - ${x.school.name}`}
            </Text>
          ))}
      </View>
      <Calendar
        style={{ marginVertical: 20 }}
        markers={inspections.map((x) => x.due_date.slice(0, 10))}
        onSelectDate={setCurDate}
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 5,
  },
});

export default ScheduleScreen;
