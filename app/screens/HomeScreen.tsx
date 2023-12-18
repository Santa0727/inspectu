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
  const [items, setItems] = useState<IInspection[]>();

  const loadData = useCallback(() => {
    setLoading(true);
    sendRequest('api/inspections', {}, 'GET').then((res) => {
      if (res.status) {
        setItems(res.data);
        setLoading(false);
      } else {
        alert(res.message ?? 'Server error');
      }
    });
  }, []);

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
            items={items?.filter((x) => x.status === 'publish') ?? []}
            status="upcoming"
            goToInspect={(t) => navigation.navigate(t)}
          />
          <InspectsTable
            items={items?.filter((x) => x.status !== 'publish') ?? []}
            status="past"
            goToInspect={(t) => navigation.navigate(t)}
          />
        </>
      )}
    </MainContainer>
  );
};

export default HomeScreen;
