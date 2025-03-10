import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MainContainer from '../components/container/MainContainer';
import { HomeStackParamList } from '../navigation/AppStackParams';
import { StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '../config/constants';
import { useCallback, useState } from 'react';
import { IInspection } from '../lib/entities';
import { sendRequest } from '../config/compose';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import InspectionCard from '../components/manage/InspectionCard';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const navBar = useNavigation<any>();
  const [upItems, setUpItems] = useState<IInspection[]>();
  const [pastItems, setPastItems] = useState<IInspection[]>();

  const loadData = useCallback(() => {
    (async () => {
      const res = await sendRequest(
        'api/member/inspections',
        { per_page: 50 },
        'GET',
      );
      if (res.status) {
        setUpItems(res.data.coming ?? []);
        setPastItems(res.data.passed ?? []);
      } else {
        alert(res.message ?? 'Server error');
      }
    })();
  }, []);

  const clickInspection = (item: IInspection) =>
    navBar.navigate('Inspect', {
      screen: item.status === 'publish' ? 'InspectEntry' : 'InspectReview',
      params: { inspectID: item.id },
    });

  useFocusEffect(loadData);

  return (
    <MainContainer>
      <View style={styles.panel}>
        <View style={styles.panel_header}>
          <AntDesign name="clockcircle" size={24} color={COLORS.greyBlue} />
          <Text style={styles.panel_label}>Schedule</Text>
        </View>
        <View style={{ minHeight: 100, paddingVertical: 10 }}>
          {upItems?.map((x) => (
            <InspectionCard
              key={x.id}
              inspection={x}
              onClick={clickInspection}
            />
          ))}
        </View>
      </View>
      <View style={styles.panel}>
        <View style={styles.panel_header}>
          <AntDesign name="clockcircle" size={24} color={COLORS.greyBlue} />
          <Text style={styles.panel_label}>Inspections</Text>
        </View>
        <View style={{ minHeight: 100, paddingVertical: 10 }}>
          {pastItems?.map((x) => (
            <InspectionCard
              key={x.id}
              inspection={x}
              onClick={clickInspection}
            />
          ))}
        </View>
      </View>
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
