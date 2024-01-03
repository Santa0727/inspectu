import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { InspectStackParamList } from '../../navigation/AppStackParams';
import { IEntryStep } from '../../lib/entities';
import MainContainer from '../../components/container/MainContainer';
import { FontAwesome } from '@expo/vector-icons';
import TouchButton from '../../components/ui/TouchButton';
import { sendRequest } from '../../config/compose';
import InspectStep from '../../components/manage/InspectStep';

const CommentForm = ({
  entry,
  disabled,
  updateClick,
  sendClick,
}: {
  entry: IEntryStep;
  disabled?: boolean;
  updateClick: () => void;
  sendClick: (message: string) => void;
}) => {
  const [msg, setMsg] = useState('');

  return (
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
        value={msg}
        onChangeText={(t) => setMsg(t)}
      />
      <View style={styles.btn_row}>
        <TouchButton
          style={styles.send_btn}
          label="Send"
          scheme="success"
          disabled={disabled}
          onPress={() => sendClick(msg)}
        />
        <TouchButton
          style={styles.update_btn}
          label="Update details"
          size="small"
          onPress={updateClick}
          disabled={disabled}
        />
      </View>
    </>
  );
};

type Props = NativeStackScreenProps<InspectStackParamList, 'InspectReview'>;

const InspectReviewScreen = ({ navigation, route }: Props) => {
  const { inspectID, entryStep } = route.params;

  const [form, setForm] = useState<any>({});
  const [disabled, setDisabled] = useState(false);
  const [needUpdate, setNeedUpdate] = useState(entryStep.status === 'error');

  const buttonClick = async () => {
    if (needUpdate) {
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
  const sendClick = async (message: string) => {
    if (!message) {
      alert('Please fill the message');
      return;
    }
    setDisabled(true);
    const res = await sendRequest(
      'api/member/inspections/review/message/submit',
      { inspection_id: inspectID, step_id: entryStep.id, message },
      'POST',
    );
    if (res.status) {
      navigation.popToTop();
    } else {
      alert(res.message ?? 'Server error');
      setDisabled(false);
    }
  };

  return (
    <MainContainer style={{ padding: 5 }}>
      <View style={{ margin: 10 }}>
        {entryStep.status === 'approved' ? (
          <InspectStep data={entryStep} />
        ) : needUpdate ? (
          <InspectStep form={form} setForm={setForm} data={entryStep} />
        ) : (
          <CommentForm
            disabled={disabled}
            entry={entryStep}
            updateClick={() => setNeedUpdate(true)}
            sendClick={sendClick}
          />
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
          label={needUpdate ? 'Update' : 'Go back'}
          onPress={buttonClick}
          disabled={disabled}
        />
      </View>
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
