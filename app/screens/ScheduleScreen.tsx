import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MainContainer from '../components/container/MainContainer';
import Calendar from '../components/ui/Calendar';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { sendRequest } from '../config/compose';
import { IInspection } from '../lib/entities';
import { defaultDateFormat } from '../lib/helper';
import SchoolViewModal from '../components/manage/SchoolViewModal';

const ScheduleScreen = () => {
  const [inspections, setInspections] = useState<IInspection[]>([]);
  const [curDate, setCurDate] = useState<string>();
  const [curInspect, setCurInspect] = useState<IInspection>();

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
      <Calendar
        style={{ marginBottom: 20 }}
        markers={inspections.map((x) => x.due_date.slice(0, 10))}
        onSelectDate={setCurDate}
      />
      {curDate && (
        <View style={{ marginVertical: 10 }}>
          <Text style={styles.title}>
            Inspections for {defaultDateFormat(curDate)}
          </Text>
        </View>
      )}
      <View style={{ padding: 10 }}>
        {inspections
          .filter((x) => x.due_date.slice(0, 10) === curDate)
          .map((x) => (
            <TouchableOpacity
              key={x.id}
              style={styles.inspection_touch}
              onPress={() => setCurInspect(x)}>
              <Text style={styles.subtitle}>
                {`${x.name} - ${x.school.name}`}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
      {curInspect && (
        <SchoolViewModal
          visible={true}
          school={curInspect.school}
          onClose={() => setCurInspect(undefined)}
        />
      )}
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
    textAlign: 'center',
  },
  inspection_touch: {
    borderColor: '#e0e0e0',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default ScheduleScreen;
