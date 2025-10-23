import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MainContainer from '../components/container/MainContainer';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { sendRequest } from '../config/compose';
import { IInspection, ISchool } from '../lib/manage.entities';
import { defaultDateFormat } from '../lib/helper';
import SchoolViewModal from '../components/manage/SchoolViewModal';
import TouchButton from '../components/ui/TouchButton';
import { COLORS } from '../config/constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/AppStackParams';
import { IName } from '../lib/general.entities';
import { FontAwesome } from '@expo/vector-icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'Schedule'>;

const ScheduleScreen = ({ navigation }: Props) => {
  const [schools, setSchools] = useState<IName[]>();
  const [inspections, setInspections] = useState<IInspection[]>([]);
  const [districts, setDistricts] = useState<IName[]>([]);
  const [curSchool, setCurSchool] = useState<ISchool>();
  const [disabled, setDisabled] = useState(false);
  const [selectedSchools, setSelectedSchools] = useState<number[]>([]);

  const loadData = useCallback(() => {
    (async () => {
      const res = await sendRequest('api/member/schools', {}, 'GET');
      if (res.status) {
        setSchools(res.data);
      } else {
        alert(res.message ?? 'Server error');
      }
    })();
    (async () => {
      const res = await sendRequest('api/member/inspections', {}, 'GET');
      if (res.status) {
        setInspections(res.data.coming);
      } else {
        alert(res.message ?? 'Server error');
      }
    })();
    (async () => {
      const res = await sendRequest('api/district', {}, 'GET');
      if (res.status) {
        setDistricts(res.data?.data ?? []);
      } else {
        console.warn('Failed to load districts:', res.message);
      }
    })();
  }, []);

  const clickSchool = async (id: number) => {
    setDisabled(true);
    const res = await sendRequest(`api/member/schools/${id}`, {}, 'GET');
    if (res.status) {
      setCurSchool(res.data);
    } else {
      alert(res.message ?? 'Server error');
    }
    setDisabled(false);
  };

  const toggleSchoolSelection = (schoolId: number) => {
    setSelectedSchools((prev) => {
      if (prev.includes(schoolId)) {
        return prev.filter((id) => id !== schoolId);
      } else {
        return [...prev, schoolId];
      }
    });
  };

  const clearAllSelections = () => {
    setSelectedSchools([]);
  };

  const selectAllSchools = () => {
    if (schools) {
      setSelectedSchools(schools.map((school) => school.id));
    }
  };

  const goToInspection = (inspection: IInspection) => {
    if (inspection.status === 'publish') {
      navigation.navigate('InspectEntry', { inspectID: inspection.id });
    } else if (inspection.status === 'review_required') {
      navigation.navigate('InspectReview', { inspectID: inspection.id });
    }
  };

  const getDistrictName = (districtId: number): string => {
    const district = districts.find((d) => d.id === districtId);
    return district?.name ?? 'Unknown District';
  };

  const groupInspectionsBySite = () => {
    const grouped: { [key: string]: IInspection[] } = {};

    const filteredInspections =
      selectedSchools.length > 0
        ? inspections.filter((inspection) =>
            selectedSchools.includes(inspection.school.id),
          )
        : inspections;

    filteredInspections.forEach((inspection) => {
      const siteName = inspection.school?.name ?? 'Unknown Site';
      if (!grouped[siteName]) {
        grouped[siteName] = [];
      }
      grouped[siteName].push(inspection);
    });

    Object.keys(grouped).forEach((siteName) => {
      grouped[siteName].sort(
        (a, b) =>
          new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
      );
    });

    return grouped;
  };

  useFocusEffect(loadData);

  const groupedInspections = groupInspectionsBySite();

  return (
    <MainContainer style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
      <View style={{ marginBottom: 15 }}>
        <View style={styles.sites_header}>
          <Text style={styles.title}>Sites</Text>
        </View>
        {schools?.map((x) => (
          <View key={x.id} style={styles.site_container}>
            <TouchableOpacity
              style={styles.site_btn}
              disabled={disabled}
              onPress={() => clickSchool(x.id)}>
              <Text style={styles.site_name}>{x.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkbox_btn}
              onPress={() => toggleSchoolSelection(x.id)}>
              <FontAwesome
                name={
                  selectedSchools.includes(x.id) ? 'check-square-o' : 'square-o'
                }
                size={24}
                color={
                  selectedSchools.includes(x.id)
                    ? COLORS.primary
                    : COLORS.greyBlue
                }
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.title}>
          {selectedSchools.length > 0
            ? `Scheduled Inspections (${selectedSchools.length} site${
                selectedSchools.length > 1 ? 's' : ''
              } selected)`
            : 'Scheduled Inspections (All Sites)'}
        </Text>
        {Object.keys(groupedInspections).length === 0 ? (
          <Text style={styles.no_inspections}>
            {'No scheduled inspections'}
          </Text>
        ) : (
          Object.entries(groupedInspections).map(
            ([siteName, siteInspections]) => (
              <View key={siteName} style={{ marginBottom: 20 }}>
                <Text style={styles.site_header}>{siteName}</Text>
                {siteInspections.map((x) => (
                  <View key={x.id} style={styles.ins_view}>
                    <View style={styles.ins_left}>
                      <Text style={styles.ins_name}>
                        {`${x.name} (${getDistrictName(x.school.district_id)})`}
                      </Text>
                      <Text style={styles.ins_date}>
                        {defaultDateFormat(x.due_date)}
                      </Text>
                    </View>
                    <TouchButton
                      label="Start"
                      scheme={
                        x.due_date.slice(0, 10) <
                        new Date().toISOString().slice(0, 10)
                          ? 'danger'
                          : 'primary'
                      }
                      onPress={() => goToInspection(x)}
                    />
                  </View>
                ))}
              </View>
            ),
          )
        )}
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  sites_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  site_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: COLORS.blueGrey,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  site_btn: {
    padding: 15,
    flex: 1,
    marginRight: 10,
  },
  checkbox_btn: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  site_name: {
    color: COLORS.dark,
    fontSize: 16,
    fontWeight: '500',
  },
  site_header: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    backgroundColor: COLORS.blueGrey + '20',
    padding: 10,
    borderRadius: 8,
  },
  no_inspections: {
    fontSize: 16,
    color: COLORS.greyBlue,
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  ins_view: {
    borderColor: COLORS.blueGrey,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    marginBottom: 8,
  },
  ins_left: {
    flex: 1,
    justifyContent: 'space-between',
  },
  ins_name: {
    color: COLORS.dark,
    fontSize: 16,
    fontWeight: '500',
  },
  ins_date: {
    color: COLORS.greyBlue,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ScheduleScreen;
