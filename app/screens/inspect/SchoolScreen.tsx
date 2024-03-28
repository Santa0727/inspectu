import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InspectStackParamList } from '../../navigation/AppStackParams';
import MainContainer from '../../components/container/MainContainer';
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import { useCallback, useState, FC } from 'react';
import { ISchool } from '../../lib/entities';
import { useFocusEffect } from '@react-navigation/native';
import { sendRequest } from '../../config/compose';

const OverviewRoute: FC<{ school: ISchool }> = ({ school }) => {
  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert('Unable to open');
      }
    } catch (error: any) {
      alert('An error occurred ' + error?.message);
    }
  };

  return (
    <ScrollView style={styles.tab_view}>
      <View style={styles.row}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{school.name}</Text>
      </View>
      <TouchableOpacity
        style={styles.row}
        onPress={() => openLink(`tel:${school.phone}`)}>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{school.phone}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.row}
        onPress={() => openLink(`mailto:${school.email}`)}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{school.email}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.row}
        onPress={() =>
          openLink(`http://maps.google.com/?q=${school.location}`)
        }>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>{school.address}</Text>
      </TouchableOpacity>
      {!!school.notes && (
        <View style={styles.row}>
          <Text style={styles.label}>Notes</Text>
          <Text style={styles.value}>{school.notes}</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.label}>Visit information</Text>
        <Text style={styles.value}>{school.visit?.name}</Text>
        <Text style={styles.value}>{school.visit?.date}</Text>
      </View>
      <View style={{ height: 15 }} />
    </ScrollView>
  );
};

interface IComing {
  id: number;
  name: string;
  due_date: string;
}

const InspectionsRoute: FC<{ comes: IComing[] }> = ({ comes }) => (
  <ScrollView style={styles.tab_view}>
    {comes.map((come) => (
      <View key={come.id} style={styles.row}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{come.name}</Text>
        <Text style={styles.label}>Due date</Text>
        <Text style={styles.value}>{come.due_date}</Text>
      </View>
    ))}
    <View style={{ height: 15 }} />
  </ScrollView>
);

const statusLabel = (s: string) => {
  switch (s) {
    case 'publish':
      return 'Published';
    case 'pending_review':
      return 'Pending review';
    case 'review_required':
      return 'Review required';
    case 'approved':
      return 'Approved';
    default:
      return s;
  }
};

interface IHistory {
  id: number;
  name: string;
  due_date: string;
  date_submitted: string;
  approval_date: string | null;
  status: string;
}

const HistoryRoute: FC<{ histories: IHistory[] }> = ({ histories }) => (
  <ScrollView style={styles.tab_view}>
    {histories.map((history) => (
      <View key={history.id} style={styles.row}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{history.name}</Text>
        <Text style={styles.label}>Due date</Text>
        <Text style={styles.value}>{history.due_date}</Text>
        <Text style={styles.label}>Date submitted</Text>
        <Text style={styles.value}>{history.date_submitted}</Text>
        <Text style={styles.label}>Approval date</Text>
        <Text style={styles.value}>
          {history.approval_date ?? 'Not approved'}
        </Text>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{statusLabel(history.status)}</Text>
      </View>
    ))}
    <View style={{ height: 15 }} />
  </ScrollView>
);

const routes = [
  { key: 'overview', title: 'Overview' },
  { key: 'inspections', title: 'Coming Inspections' },
  { key: 'history', title: 'History' },
];

type Props = NativeStackScreenProps<InspectStackParamList, 'School'>;

const SchoolScreen = ({ navigation, route }: Props) => {
  const [index, setIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState<ISchool>();
  const [comes, setComes] = useState<IComing[]>([]);
  const [histories, setHistories] = useState<IHistory[]>([]);

  const loadData = useCallback(() => {
    (async () => {
      setLoading(true);

      let res = await sendRequest(
        `api/member/schools/${route.params.schoolID}`,
        {},
        'GET',
      );
      if (res.status) {
        setSchoolInfo(res.data);
      } else {
        alert(res.message ?? 'Server error');
      }

      res = await sendRequest(
        `api/member/schools/${route.params.schoolID}/inspections`,
        {},
        'GET',
      );
      if (res.status) {
        setComes(res.data);
      } else {
        alert(res.message ?? 'Server error');
      }

      res = await sendRequest(
        `api/member/schools/${route.params.schoolID}/history`,
        {},
        'GET',
      );
      if (res.status) {
        setHistories(res.data);
      } else {
        alert(res.message ?? 'Server error');
      }

      setLoading(false);
    })();
  }, []);

  useFocusEffect(loadData);

  return (
    <MainContainer>
      {loading ? (
        <View style={{ paddingTop: '50%' }}>
          <ActivityIndicator size="large" color={'black'} />
        </View>
      ) : (
        schoolInfo && (
          <TabView
            style={{ height: Dimensions.get('screen').height - 170 }}
            navigationState={{ index, routes }}
            renderScene={SceneMap({
              overview: () => <OverviewRoute school={schoolInfo} />,
              inspections: () => <InspectionsRoute comes={comes} />,
              history: () => <HistoryRoute histories={histories} />,
            })}
            onIndexChange={setIndex}
          />
        )
      )}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  tab_view: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  row: {
    marginVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#0284c7',
  },
  value: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default SchoolScreen;
