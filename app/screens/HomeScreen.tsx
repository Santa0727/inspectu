import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MainContainer from '../components/container/MainContainer';
import InspectsTable from '../components/manage/InspectsTable';
import { InspectStackParamList } from '../navigation/AppStackParams';

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

type Props = NativeStackScreenProps<InspectStackParamList, 'Inspections'>;

const HomeScreen = ({ navigation }: Props) => (
  <MainContainer>
    <InspectsTable
      items={upcoming_demo}
      status="upcoming"
      goToInspect={(t) => navigation.navigate(t)}
    />
    <InspectsTable
      items={past_demo}
      status="past"
      goToInspect={(t) => navigation.navigate(t)}
    />
  </MainContainer>
);

export default HomeScreen;
