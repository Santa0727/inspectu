import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MainContainer from '../components/container/MainContainer';
import InspectsTable from '../components/manage/InspectsTable';
import { InspectStackParamList } from '../navigation/AppStackParams';
import { useCallback, useState } from 'react';
import { sendRequest } from '../config/compose';
import { IInspection } from '../lib/entities';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';

type Props = NativeStackScreenProps<InspectStackParamList, 'Inspections'>;

const HomeScreen = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(false);
  const [comingItems, setComingItems] = useState<IInspection[]>();
  const [pastItems, setPastItems] = useState<IInspection[]>();

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
          />
          <InspectsTable
            items={pastItems ?? []}
            status="past"
            goToInspect={(t, id) => goToDetail(t, id)}
          />
        </>
      )}
    </MainContainer>
  );
};

export default HomeScreen;
