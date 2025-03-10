import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MainContainer from '../../components/container/MainContainer';
import { InspectStackParamList } from '../../navigation/AppStackParams';
import { useCallback, useState } from 'react';
import { sendRequest } from '../../config/compose';
import { IInspection } from '../../lib/entities';
import { useFocusEffect } from '@react-navigation/native';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../config/constants';
import ViewCalendar from '../../components/ui/ViewCalendar';
import moment from 'moment';

type Props = NativeStackScreenProps<InspectStackParamList, 'Inspections'>;

const InspectionsScreen = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<IInspection[]>();

  const loadData = useCallback(() => {
    (async () => {
      setLoading(true);

      let res = await sendRequest(
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

  const goToDetail = (t: 'InspectEntry' | 'InspectReview', id: number) =>
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
            <TouchableOpacity
              key={item.id}
              style={styles.panel}
              onPress={() =>
                goToDetail(
                  item.status === 'publish' ? 'InspectEntry' : 'InspectReview',
                  item.id,
                )
              }>
              <View style={styles.item_header}>
                <View
                  style={[
                    styles.item_dot,
                    {
                      backgroundColor:
                        item.status === 'approved'
                          ? COLORS.approved
                          : item.status === 'pending_review'
                          ? COLORS.pending
                          : item.status === 'review_required'
                          ? COLORS.danger
                          : COLORS.inactive,
                    },
                  ]}
                />
                <Text style={styles.item_time}>
                  {moment(item.due_date).calendar()}
                </Text>
              </View>
              <Text style={styles.item_title}>{item.name}</Text>
              <Text style={styles.item_subtitle}>{item.school.name}</Text>
            </TouchableOpacity>
          ))}
          <View style={{ height: 20 }} />
        </>
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
  item_header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  item_dot: {
    width: 15,
    height: 15,
    borderRadius: 7,
  },
  item_time: {
    marginHorizontal: 6,
    color: COLORS.greyBlue,
    fontSize: 12,
    fontWeight: '400',
  },
  item_title: {
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: '600',
    margin: 3,
  },
  item_subtitle: {
    fontSize: 14,
    color: COLORS.greyBlue,
    marginHorizontal: 3,
  },
});

export default InspectionsScreen;
