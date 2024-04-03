import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InspectStackParamList } from '../../navigation/AppStackParams';
import { IReviewStep } from '../../lib/entities';
import { sendRequest } from '../../config/compose';
import { useFocusEffect } from '@react-navigation/native';
import MainContainer from '../../components/container/MainContainer';
import { defaultDateFormat } from '../../lib/helper';
import { statusLabel } from '../../lib/lang';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import TouchButton from '../../components/ui/TouchButton';

interface IEntryData {
  inspection_id: string;
  name: string;
  reviewed_by: string;
  date_submitted: string;
  status: string;
  entry: IReviewStep[];
}

type Props = NativeStackScreenProps<InspectStackParamList, 'InspectReview'>;

const InspectReviewScreen = ({ navigation, route }: Props) => {
  const inspectID = route.params.inspectID;

  const [entryData, setEntryData] = useState<IEntryData>();

  const loadData = useCallback(() => {
    (async () => {
      const res = await sendRequest(
        `api/member/inspections/${inspectID}/review`,
        {},
        'GET',
      );
      if (res.status) {
        setEntryData(res.data);
      } else {
        alert(res.message ?? 'Server error');
      }
    })();
  }, [inspectID]);

  useFocusEffect(loadData);

  return (
    <MainContainer style={{ padding: 5 }}>
      {entryData ? (
        <>
          <View style={{ margin: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.th}>{'Location: '}</Text>
              <Text style={styles.td}>{entryData.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.th}>{'Submitted: '}</Text>
              <Text style={styles.td}>
                {defaultDateFormat(entryData.date_submitted)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.th}>{'Status: '}</Text>
              <Text style={styles.td}>{statusLabel(entryData.status)}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.th}>{'Reviewed by: '}</Text>
              <Text style={styles.td}>{entryData.reviewed_by}</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            {entryData.entry.map((x) => (
              <View key={x.id} style={styles.label_btn_box}>
                <View style={styles.label_view}>
                  {x.status === 'approved' ? (
                    <FontAwesome name="check" size={24} color="#8FD14F" />
                  ) : x.status === 'error' ? (
                    <FontAwesome name="warning" size={24} color="#f24726" />
                  ) : (
                    <FontAwesome5 name="question" size={24} color="#fac710" />
                  )}
                  <Text style={styles.label_txt}>{x.name}</Text>
                </View>
                <TouchableOpacity style={styles.touch_btn} onPress={() => {}}>
                  <Text style={styles.touch_txt}>
                    {x.status === 'approved'
                      ? 'View checklist'
                      : x.status === 'error'
                      ? 'Retry'
                      : 'Clarify'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View
            style={{
              marginVertical: 20,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingHorizontal: 20,
            }}>
            <TouchButton label="Go back" onPress={() => navigation.goBack()} />
          </View>
        </>
      ) : (
        <View style={{ paddingTop: '50%' }}>
          <ActivityIndicator size="large" color={'black'} />
        </View>
      )}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  th: {
    fontSize: 20,
    fontWeight: '600',
  },
  td: {
    fontSize: 20,
  },
  label_btn_box: {
    paddingVertical: 15,
  },
  label_view: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#d1d1d1',
  },
  label_txt: {
    fontSize: 20,
    marginLeft: 20,
  },
  touch_btn: {
    backgroundColor: '#414BB2',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginHorizontal: 20,
  },
  touch_txt: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
  },
});

export default InspectReviewScreen;
