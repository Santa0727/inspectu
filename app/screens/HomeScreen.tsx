import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MainContainer from '../components/container/MainContainer';
import { HomeStackParamList } from '../navigation/AppStackParams';
import { StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => (
  <MainContainer>
    <View style={styles.panel}>
      <View style={styles.panel_header}>
        <AntDesign name="clockcircle" size={24} color="#8F9BB3" />
        <Text style={styles.panel_label}>Schedule</Text>
      </View>
      <View style={{ height: 100 }} />
    </View>
    <View style={styles.panel}>
      <View style={styles.panel_header}>
        <AntDesign name="clockcircle" size={24} color="#8F9BB3" />
        <Text style={styles.panel_label}>Inspections</Text>
      </View>
      <View style={{ height: 100 }} />
    </View>
  </MainContainer>
);

const styles = StyleSheet.create({
  panel: {
    borderColor: '#DDE6F8',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    marginVertical: 8,
    padding: 10,
  },
  panel_header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  panel_label: {
    fontWeight: '600',
    fontSize: 18,
    marginLeft: 12,
  },
});

export default HomeScreen;
