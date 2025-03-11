import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MainContainer from '../../components/container/MainContainer';
import { InspectStackParamList } from '../../navigation/AppStackParams';
import { useCallback, useState } from 'react';
import { sendRequest } from '../../config/compose';
import { IInspection } from '../../lib/entities';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { COLORS } from '../../config/constants';
import ViewCalendar from '../../components/ui/ViewCalendar';
import InspectionCard from '../../components/manage/InspectionCard';
import InspectionModal from '../../components/manage/InspectionModal';

type Props = NativeStackScreenProps<InspectStackParamList, 'Inspections'>;

const InspectionsScreen = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<IInspection[]>();
  const [curItem, setCurItem] = useState<IInspection>();

  const loadData = useCallback(() => {
    (async () => {
      setLoading(true);

      const res = await sendRequest(
        'api/member/inspections',
        { per_page: 50 },
        'GET',
      );
      if (res.status) {
        const comings = res.data.coming ?? [],
          passed = res.data.passed ?? [];
        setItems([...comings, ...passed]);
      } else {
        alert(res.message ?? 'Server error');
      }

      setLoading(false);
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

  useFocusEffect(loadData);

  return (
    <MainContainer>
      {loading ? (
        <View style={{ paddingTop: '50%' }}>
          <ActivityIndicator size="large" color={'black'} />
        </View>
      ) : (
        <>
          <View style={styles.panel}>
            <ViewCalendar
              markers={items?.map((x) => ({
                date: x.due_date.slice(0, 10),
                color:
                  x.status === 'approved'
                    ? COLORS.approved
                    : x.status === 'pending_review'
                    ? COLORS.pending
                    : x.status === 'review_required'
                    ? COLORS.danger
                    : COLORS.inactive,
              }))}
            />
          </View>
          {items?.map((item) => (
            <InspectionCard
              key={item.id}
              data={item}
              onClick={clickInspection}
            />
          ))}
          <View style={{ height: 20 }} />
        </>
      )}
      {curItem && (
        <InspectionModal
          data={curItem}
          visible={true}
          onClose={() => setCurItem(undefined)}
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
});

export default InspectionsScreen;
