import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MainContainer from '../components/container/MainContainer';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import TouchButton from '../components/ui/TouchButton';
import { InspectStackParamList } from '../navigation/AppStackParams';

type Props = NativeStackScreenProps<InspectStackParamList, 'PostDetail'>;

const PostDetailScreen = ({ navigation }: Props) => (
  <MainContainer style={{ padding: 10 }}>
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
        <TouchableOpacity style={styles.touch_btn}>
          <Text style={styles.touch_txt}>Clarify</Text>
        </TouchableOpacity>
      </View>
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
  </MainContainer>
);

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
