import { StyleSheet } from 'react-native';
import { MainStackParamList } from '../navigation/AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MainContainer from '../components/container/MainContainer';
import InspectsTable from '../components/manage/InspectsTable';

const upcoming_demo = [
    { id: 1, location: 'School A', date: '23-10-2023' },
    { id: 2, location: 'School B', date: '24-11-2023' },
    { id: 3, location: 'School C', date: '01-12-2023' },
  ],
  past_demo = [
    { id: 1, location: 'School A', date: '01-09-2023', status: 'Approved' },
    {
      id: 2,
      location: 'School B',
      date: '12-09-2023',
      status: 'Pending review',
    },
    {
      id: 3,
      location: 'School C',
      date: '24-09-2023',
      status: 'Pending review',
    },
  ];

type Props = NativeStackScreenProps<MainStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  return (
    <MainContainer>
      <InspectsTable items={upcoming_demo} status="upcoming" />
      <InspectsTable items={past_demo} status="past" />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: 30,
    marginVertical: 30,
  },
});

export default HomeScreen;
