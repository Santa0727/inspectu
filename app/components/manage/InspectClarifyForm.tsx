import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { IReviewStep } from '../../lib/entities';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import TouchButton from '../ui/TouchButton';
import { sendRequest } from '../../config/compose';

interface Props {
  inspectID: number;
  data: IReviewStep;
  onClose: () => void;
}

const InspectClarifyForm = ({ inspectID, data, onClose }: Props) => {
  const [disabled, setDisabled] = useState(false);
  const [msg, setMsg] = useState('');

  const sendClick = async () => {
    if (!msg) {
      alert('Please fill the message');
      return;
    }
    setDisabled(true);
    const res = await sendRequest(
      'api/member/inspections/review/message/submit',
      { inspection_id: inspectID, step_id: data.id, message: msg },
      'POST',
    );
    if (res.status) {
      onClose();
    } else {
      alert(res.message ?? 'Server error');
      setDisabled(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="home" size={30} />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 22, fontWeight: '500' }}>Location</Text>
          <Text style={{ fontSize: 18, fontWeight: '400' }}>{data.name}</Text>
        </View>
      </View>
      <View style={styles.text_view}>
        <Text style={styles.text}>{data.adminMessage ?? ''}</Text>
      </View>
      <TextInput
        placeholder="Add text"
        numberOfLines={Platform.OS === 'ios' ? undefined : 5}
        multiline={true}
        style={styles.input}
        value={msg}
        onChangeText={(t) => setMsg(t)}
      />
      <TouchButton
        style={styles.send_btn}
        label="Send"
        scheme="success"
        disabled={disabled}
        onPress={() => sendClick()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
  },
  header: {
    flexDirection: 'row',
    borderColor: '#d1d1d1',
    borderBottomWidth: 1,
    marginHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 10,
  },
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
  send_btn: {
    marginVertical: 20,
    marginHorizontal: 15,
  },
});

export default InspectClarifyForm;
