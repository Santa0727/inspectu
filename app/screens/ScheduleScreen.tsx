import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MainContainer from '../components/container/MainContainer';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { sendRequest } from '../config/compose';
import { IInspection, IName } from '../lib/entities';
import { defaultDateFormat } from '../lib/helper';
import SchoolViewModal from '../components/manage/SchoolViewModal';
import TouchButton from '../components/ui/TouchButton';

const ScheduleScreen = () => {
  const [schools, setSchools] = useState<IName[]>();
  const [inspections, setInspections] = useState<IInspection[]>([]);
  const [curDate, setCurDate] = useState<string>();
  const [curInspect, setCurInspect] = useState<IInspection>();

  const loadData = useCallback(() => {
    (async () => {
      const res = await sendRequest('api/member/schools', {}, 'GET');
      if (res.status) {
        setSchools(res.data);
      }
    })();
    (async () => {
      const res = await sendRequest('api/member/inspections', {}, 'GET');
      if (res.status) {
        setInspections(res.data.coming);
      }
    })();
  }, []);

  const clickSchool = async (id: number) => {};

  useFocusEffect(loadData);

  return (
    <MainContainer style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.title}>Schools</Text>
        {schools?.map((x) => (
          <TouchableOpacity
            key={x.id}
            style={styles.school_btn}
            onPress={() => clickSchool(x.id)}>
            <Text style={styles.school_name}>{x.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.title}>Upcoming Inspections</Text>
        {inspections.map((x) => (
          <View key={x.id} style={styles.ins_view}>
            <View style={styles.ins_left}>
              <Text style={styles.ins_name}>{x.name}</Text>
              <Text style={styles.ins_date}>
                {defaultDateFormat(x.due_date)}
              </Text>
            </View>
            <TouchButton
              label="Start"
              scheme={
                x.due_date.slice(0, 10) < new Date().toISOString().slice(0, 10)
                  ? 'danger'
                  : 'primary'
              }
            />
          </View>
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
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  school_btn: {
    borderColor: '#DDE6F8',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    padding: 15,
  },
  school_name: {
    color: '#222B45',
    fontSize: 16,
    fontWeight: '500',
  },
  ins_view: {
    borderColor: '#DDE6F8',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
  },
  ins_left: {
    flex: 1,
    justifyContent: 'space-between',
  },
  ins_name: {
    color: '#222B45',
    fontSize: 16,
    fontWeight: '500',
  },
  ins_date: {
    color: '#8F9BB3',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ScheduleScreen;
