import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MainContainer from '../components/container/MainContainer';
import { HomeStackParamList } from '../navigation/AppStackParams';
import { useState } from 'react';
import { ISchool } from '../lib/entities';
import { StyleSheet, Text, View } from 'react-native';
import SchoolViewModal from '../components/manage/SchoolViewModal';
import { AntDesign } from '@expo/vector-icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const [curSchool, setCurSchool] = useState<ISchool>();

  return (
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
      {curSchool && (
        <SchoolViewModal
          visible={true}
          school={curSchool}
          onClose={() => setCurSchool(undefined)}
        />
      )}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  name: {
    marginVertical: 20,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  link: {
    marginVertical: 15,
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  subtitle: {
    fontSize: 22,
    marginVertical: 5,
    marginHorizontal: 10,
    fontWeight: '500',
  },
  school_name: {
    fontSize: 20,
    marginVertical: 8,
    marginHorizontal: 10,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
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
