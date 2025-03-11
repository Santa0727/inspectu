import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MainContainer from '../components/container/MainContainer';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { sendRequest } from '../config/compose';
import { IInspection, IName, ISchool } from '../lib/entities';
import { defaultDateFormat } from '../lib/helper';
import SchoolViewModal from '../components/manage/SchoolViewModal';
import TouchButton from '../components/ui/TouchButton';
import { COLORS } from '../config/constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/AppStackParams';

type Props = NativeStackScreenProps<HomeStackParamList, 'Schedule'>;

const ScheduleScreen = ({ navigation }: Props) => {
  const [schools, setSchools] = useState<IName[]>();
  const [inspections, setInspections] = useState<IInspection[]>([]);
  const [curSchool, setCurSchool] = useState<ISchool>();
  const [disabled, setDisabled] = useState(false);

  const loadData = useCallback(() => {
    (async () => {
      const res = await sendRequest('api/member/schools', {}, 'GET');
      if (res.status) {
        setSchools(res.data);
      } else {
        alert(res.message ?? 'Server error');
      }
    })();
    (async () => {
      const res = await sendRequest('api/member/inspections', {}, 'GET');
      if (res.status) {
        setInspections(res.data.coming);
      } else {
        alert(res.message ?? 'Server error');
      }
    })();
  }, []);

  const clickSchool = async (id: number) => {
    setDisabled(true);
    const res = await sendRequest(`api/member/schools/${id}`, {}, 'GET');
    if (res.status) {
      setCurSchool(res.data);
    } else {
      alert(res.message ?? 'Server error');
    }
    setDisabled(false);
  };

  const goToInspection = (inspection: IInspection) => {
    if (inspection.status === 'publish') {
      navigation.navigate('InspectEntry', { inspectID: inspection.id });
    } else if (inspection.status === 'review_required') {
      navigation.navigate('InspectReview', { inspectID: inspection.id });
    }
  };

  useFocusEffect(loadData);

  return (
    <MainContainer style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.title}>Schools</Text>
        {schools?.map((x) => (
          <TouchableOpacity
            key={x.id}
            style={styles.school_btn}
            disabled={disabled}
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
              onPress={() => goToInspection(x)}
            />
          </View>
        ))}
      </View>
      {curSchool && (
        <SchoolViewModal
          visible={true}
          school={curSchool}
          onClose={() => setCurSchool(undefined)}
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
    borderColor: COLORS.blueGrey,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    padding: 15,
  },
  school_name: {
    color: COLORS.dark,
    fontSize: 16,
    fontWeight: '500',
  },
  ins_view: {
    borderColor: COLORS.blueGrey,
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
    color: COLORS.dark,
    fontSize: 16,
    fontWeight: '500',
  },
  ins_date: {
    color: COLORS.greyBlue,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ScheduleScreen;
