import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MainContainer from '../components/container/MainContainer';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import TouchButton from '../components/ui/TouchButton';
import { InspectStackParamList } from '../navigation/AppStackParams';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { sendRequest } from '../config/compose';

type Props = NativeStackScreenProps<InspectStackParamList, 'PostDetail'>;

const PostDetailScreen = ({ navigation, route }: Props) => {
  const inspectID = route.params.inspectID;

  const [viewMode, setViewMode] = useState<'detail' | 'clarify'>('detail');
  const [disabled, setDisabled] = useState(false);

  const loadData = useCallback(() => {
    console.log(inspectID);
    sendRequest(`api/member/inspections/${inspectID}/review`, {}, 'GET').then(
      (res) => {
        console.log(res);
      },
    );
  }, [inspectID]);

  useFocusEffect(loadData);

  return (
    <MainContainer style={{ padding: 10 }}>
      {viewMode === 'detail' ? (
        <>
          <View style={{ margin: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.th}>{'Location: '}</Text>
              <Text style={styles.td}>{'School C'}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.th}>{'Submitted: '}</Text>
              <Text style={styles.td}>{'24-09-2023'}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.th}>{'Status: '}</Text>
              <Text style={styles.td}>{'Review required'}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.th}>{'Reviewed by: '}</Text>
              <Text style={styles.td}>{'Bob smith'}</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <View style={styles.label_btn_box}>
              <View style={styles.label_view}>
                <FontAwesome name="check" size={24} color="#8FD14F" />
                <Text style={styles.label_txt}>Freezer</Text>
              </View>
              <TouchableOpacity style={styles.touch_btn}>
                <Text style={styles.touch_txt}>View checklist</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.label_btn_box}>
              <View style={styles.label_view}>
                <FontAwesome name="warning" size={24} color="#f24726" />
                <Text style={styles.label_txt}>Fridge</Text>
              </View>
              <TouchableOpacity style={styles.touch_btn}>
                <Text style={styles.touch_txt}>Redo</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.label_btn_box}>
              <View style={styles.label_view}>
                <FontAwesome5 name="question" size={24} color="#fac710" />
                <Text style={styles.label_txt}>Sink</Text>
              </View>
              <TouchableOpacity
                style={styles.touch_btn}
                onPress={() => setViewMode('clarify')}>
                <Text style={styles.touch_txt}>Clarify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <View style={{ margin: 10 }}>
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
              <Text style={{ fontSize: 18, fontWeight: '400' }}>{'Sink'}</Text>
            </View>
          </View>
          <View style={clarifyStyle.text_view}>
            <Text style={clarifyStyle.text}>
              {'Please confirm that this is right sink'}
            </Text>
          </View>
          <TextInput
            placeholder="Add text"
            numberOfLines={Platform.OS === 'ios' ? undefined : 5}
            multiline={true}
            style={clarifyStyle.input}
          />
          <View style={clarifyStyle.btn_row}>
            <TouchButton
              style={clarifyStyle.send_btn}
              label="Send"
              scheme="success"
              disabled={disabled}
            />
            <TouchButton
              style={clarifyStyle.update_btn}
              label="Update details"
              size="small"
              disabled={disabled}
            />
          </View>
        </View>
      )}
      <View
        style={{
          marginVertical: 20,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: 20,
        }}>
        <TouchButton
          label="Go back"
          onPress={() =>
            viewMode === 'clarify' ? setViewMode('detail') : navigation.goBack()
          }
        />
      </View>
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

const clarifyStyle = StyleSheet.create({
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

export default PostDetailScreen;
