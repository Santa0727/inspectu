import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { InspectStackParamList } from '../../navigation/AppStackParams';
import { IInspectStep } from '../../lib/entities';
import MainContainer from '../../components/container/MainContainer';
import { FontAwesome } from '@expo/vector-icons';
import TouchButton from '../../components/ui/TouchButton';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { sendRequest } from '../../config/compose';
import InspectStep from '../../components/manage/InspectStep';

interface IEntry {
  inspection_id: number;
  name: string;
  status: 'publish' | 'pending_review' | 'review_required';
  step: IInspectStep;
}

const CommentForm = ({ entry }: { entry: IEntry }) => (
  <>
    <View
      style={{
        flexDirection: 'row',
        borderColor: '#d1d1d1',
        borderBottomWidth: 1,
        marginHorizontal: 20,
        alignItems: 'center',
        paddingBottom: 10,
      }}>
      <FontAwesome name="home" size={30} />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: '500' }}>Location</Text>
        <Text style={{ fontSize: 18, fontWeight: '400' }}>{entry.name}</Text>
      </View>
    </View>
    <View style={styles.text_view}>
      <Text style={styles.text}>
        {'Please confirm that this is right sink'}
      </Text>
    </View>
    <TextInput
      placeholder="Add text"
      numberOfLines={Platform.OS === 'ios' ? undefined : 5}
      multiline={true}
      style={styles.input}
    />
    <View style={styles.btn_row}>
      <TouchButton style={styles.send_btn} label="Send" scheme="success" />
      <TouchButton
        style={styles.update_btn}
        label="Update details"
        size="small"
      />
    </View>
  </>
);

type Props = NativeStackScreenProps<InspectStackParamList, 'InspectReview'>;

const InspectReviewScreen = ({ navigation, route }: Props) => {
  const { inspectID, stepID } = route.params;

  const [entry, setEntry] = useState<IEntry>();
  const [form, setForm] = useState<any>({});
  const [disabled, setDisabled] = useState(false);

  const loadData = useCallback(() => {
    sendRequest(
      `api/member/inspections/${inspectID}/review/${stepID}`,
      {},
      'GET',
    ).then((res) => {
      if (res.status) {
        setEntry(res.data);
      } else {
        alert(res.message ?? 'Server error');
      }
    });
  }, []);

  useFocusEffect(loadData);

  const buttonClick = async () => {
    if (entry?.step.status === 'error') {
      setDisabled(true);
      const res = await sendRequest(
        'api/member/inspections/review/submit',
        { ...form, inspection_id: inspectID },
        'POST',
      );
      if (res.status) {
        navigation.popToTop();
      } else {
        alert(res.message ?? 'Server error');
        setDisabled(false);
      }
    } else {
      navigation.goBack();
    }
  };

  return (
    <MainContainer style={{ padding: 5 }}>
      {entry ? (
        <>
          <View style={{ margin: 10 }}>
            {entry.step.status === 'approved' ? (
              <InspectStep data={entry.step} />
            ) : entry.step.status === 'error' ? (
              <InspectStep form={form} setForm={setForm} data={entry.step} />
            ) : (
              <CommentForm entry={entry} />
            )}
          </View>
          <View
            style={{
              marginVertical: 20,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingHorizontal: 20,
            }}>
            <TouchButton
              label={entry.step.status === 'error' ? 'Update' : 'Go back'}
              onPress={buttonClick}
              disabled={disabled}
            />
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
  text_view: {
    backgroundColor: '#666666',
    alignSelf: 'flex-end',
    maxWidth: 300,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 20,
    borderRadius: 5,
  },
  text: {
    color: 'white',
    fontWeight: '600',
    fontSize: 22,
  },
  input: {
    fontSize: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#d9d9d9',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingTop: 12,
    minHeight: 120,
  },
  btn_row: {
    flexDirection: 'row',
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  send_btn: {
    flex: 1,
    marginRight: 5,
  },
  update_btn: {
    flex: 1,
    marginLeft: 5,
  },
});

export default InspectReviewScreen;
