import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MainContainer from '../../components/container/MainContainer';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import TouchButton from '../../components/ui/TouchButton';
import { InspectStackParamList } from '../../navigation/AppStackParams';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { sendRequest } from '../../config/compose';
import { statusLabels } from '../../lib/lang';
import { IEntryStep } from '../../lib/entities';
import { defaultDateFormat } from '../../lib/helper';

interface IEntry {
  inspection_id: number;
  name: string;
  reviewed_by: string;
  date_submitted: string;
  status: 'publish' | 'pending_review' | 'review_required';
  steps: IEntryStep[];
}

type Props = NativeStackScreenProps<InspectStackParamList, 'PostDetail'>;

const PostDetailScreen = ({ navigation, route }: Props) => {
  const inspectID = route.params.inspectID;

  const [entry, setEntry] = useState<IEntry>();

  const loadData = useCallback(() => {
    sendRequest(`api/member/inspections/${inspectID}/review`, {}, 'GET').then(
      (res) => {
        if (res.status) {
          setEntry(res.data);
        } else {
          alert(res.message ?? 'Server error');
        }
      },
    );
  }, [inspectID]);

  useFocusEffect(loadData);

  return (
    <MainContainer style={{ padding: 10 }}>
      {entry ? (
        <>
          <View style={{ margin: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.th}>{'Location: '}</Text>
              <Text style={styles.td}>{entry.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.th}>{'Submitted: '}</Text>
              <Text style={styles.td}>
                {defaultDateFormat(entry.date_submitted)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.th}>{'Status: '}</Text>
              <Text style={styles.td}>
                {statusLabels[entry.status] ?? entry.status}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.th}>{'Reviewed by: '}</Text>
              <Text style={styles.td}>{entry.reviewed_by}</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            {entry.steps.map((x) => (
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
                <TouchableOpacity
                  style={styles.touch_btn}
                  onPress={() =>
                    navigation.navigate('InspectReview', {
                      inspectID,
                      entryStep: x,
                    })
                  }>
                  <Text style={styles.touch_txt}>
                    {x.status === 'approved'
                      ? 'View checklist'
                      : x.status === 'error'
                      ? 'Sink'
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

export default PostDetailScreen;
