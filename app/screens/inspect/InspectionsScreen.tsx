import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MainContainer from '../../components/container/MainContainer';
import InspectsTable from '../../components/manage/InspectsTable';
import { InspectStackParamList } from '../../navigation/AppStackParams';
import { useCallback, useState } from 'react';
import { sendRequest } from '../../config/compose';
import { IInspection, IName, ISchool } from '../../lib/entities';
import { useFocusEffect } from '@react-navigation/native';
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SchoolViewModal from '../../components/manage/SchoolViewModal';

type Props = NativeStackScreenProps<InspectStackParamList, 'Inspections'>;

const InspectionsScreen = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(false);
  const [comingItems, setComingItems] = useState<IInspection[]>();
  const [pastItems, setPastItems] = useState<IInspection[]>();
  const [curSchool, setCurSchool] = useState<ISchool>();
  const [schools, setSchools] = useState<IName[]>();

  const loadData = useCallback(() => {
    (async () => {
      setLoading(true);

      let res = await sendRequest('api/member/inspections', {}, 'GET');
      if (res.status) {
        setComingItems(res.data.coming);
        setPastItems(res.data.passed);
      } else {
        alert(res.message ?? 'Server error');
      }

      res = await sendRequest('api/member/schools', {}, 'GET');
      if (res.status) {
        setSchools(res.data);
      } else {
        alert(res.message ?? 'Server error');
      }

      setLoading(false);
    })();
  }, []);

  const goToDetail = (t: 'InspectEntry' | 'InspectReview', id: number) =>
    navigation.navigate(t, { inspectID: id });
  const goToSchool = (id: number) =>
    navigation.navigate('School', { schoolID: id });

  const openSchool = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert('Unable to open');
      }
    } catch (error: any) {
      alert('An error occurred ' + error?.message);
    }
  };

  useFocusEffect(loadData);

  return (
    <MainContainer>
      {loading ? (
        <View style={{ paddingTop: '50%' }}>
          <ActivityIndicator size="large" color={'black'} />
        </View>
      ) : (
        <>
          <View style={{ padding: 10 }}>
            <Text style={styles.subtitle}>Schools</Text>
            {schools?.map((x) => (
              <TouchableOpacity
                key={x.id}
                onPress={goToSchool.bind(this, x.id)}>
                <Text style={styles.school_name}>{x.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <InspectsTable
            items={comingItems ?? []}
            status="upcoming"
            goToInspect={(t, id) => goToDetail(t, id)}
            onClickSchool={(s) => setCurSchool(s)}
          />
          <InspectsTable
            items={pastItems ?? []}
            status="past"
            goToInspect={(t, id) => goToDetail(t, id)}
            onClickSchool={(s) => setCurSchool(s)}
          />
        </>
      )}
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
  name: {
    marginVertical: 20,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  link: {
    marginVertical: 15,
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  subtitle: {
    fontSize: 22,
    marginVertical: 5,
    marginHorizontal: 10,
    fontWeight: '500',
  },
  school_name: {
    fontSize: 20,
    marginVertical: 8,
    marginHorizontal: 10,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
});

export default InspectionsScreen;
