import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MainContainer from '../components/container/MainContainer';
import InspectsTable from '../components/manage/InspectsTable';
import { InspectStackParamList } from '../navigation/AppStackParams';
import { useCallback, useState } from 'react';
import { sendRequest } from '../config/compose';
import { IInspection, ISchool } from '../lib/entities';
import { useFocusEffect } from '@react-navigation/native';
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from '../components/ui/Modal';

type Props = NativeStackScreenProps<InspectStackParamList, 'Inspections'>;

const HomeScreen = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(false);
  const [comingItems, setComingItems] = useState<IInspection[]>();
  const [pastItems, setPastItems] = useState<IInspection[]>();
  const [school, setSchool] = useState<ISchool>();

  const loadData = useCallback(() => {
    setLoading(true);
    sendRequest('api/member/inspections', {}, 'GET').then((res) => {
      if (res.status) {
        setComingItems(res.data.coming);
        setPastItems(res.data.passed);
        setLoading(false);
      } else {
        alert(res.message ?? 'Server error');
      }
    });
  }, []);

  const goToDetail = (t: 'InspectEntry' | 'PostDetail', id: number) =>
    navigation.navigate(t, { inspectID: id });

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
          <InspectsTable
            items={comingItems ?? []}
            status="upcoming"
            goToInspect={(t, id) => goToDetail(t, id)}
            onClickSchool={(s) => setSchool(s)}
          />
          <InspectsTable
            items={pastItems ?? []}
            status="past"
            goToInspect={(t, id) => goToDetail(t, id)}
            onClickSchool={(s) => setSchool(s)}
          />
        </>
      )}
      {school && (
        <Modal
          visible={true}
          title="School info"
          showFooter={false}
          onClose={() => setSchool(undefined)}>
          <View>
            <Text style={styles.name}>{school.name}</Text>
            <TouchableOpacity
              onPress={() => openSchool(`mailto:${school.email}`)}>
              <Text style={styles.link}>{school.email}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openSchool(`tel:${school.phone}`)}>
              <Text style={styles.link}>{school.phone}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginBottom: 30 }}
              onPress={() =>
                openSchool(`http://maps.google.com/?q=${school.location}`)
              }>
              <Text style={styles.link}>{school.address}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
});

export default HomeScreen;
