import MainContainer from '../components/container/MainContainer';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { loadSchools } from '../store/manage/manage.actions';
import { selectSchools } from '../store/manage/manage.selector';
import TouchButton from '../components/ui/TouchButton';
import { ISchool } from '../lib/entities';
import SchoolModal from '../components/manage/SchoolModal';
import { sendRequest } from '../config/compose';

interface CardProps {
  school: ISchool;
  onEditClick: (d: ISchool) => void;
  loadData: () => void;
}

const SchoolCard = ({ school, onEditClick, loadData }: CardProps) => {
  const [disabled, setDisabled] = useState(false);

  const deleteClick = async () => {
    setDisabled(true);
    const res = await sendRequest(
      `api/director/schools/delete/${school.id}`,
      {},
      'DELETE',
    );
    if (res.status) {
      await loadData();
    } else {
      setDisabled(false);
      alert(res.message ?? 'Server error');
    }
  };

  return (
    <View style={styles.school_card}>
      <Text style={styles.school_name}>{school.name}</Text>
      <Text style={styles.users_cnt}>
        {`Number of users: ${school.users_count}`}
      </Text>
      <View style={styles.btn_row}>
        <TouchButton
          size="small"
          label="Update"
          scheme="primary"
          disabled={disabled}
          onPress={() => onEditClick(school)}
        />
        <View style={{ width: 5 }} />
        <TouchButton
          size="small"
          label="Delete"
          scheme="danger"
          disabled={disabled}
          onPress={deleteClick}
        />
      </View>
    </View>
  );
};

const SchoolListScreen = () => {
  const dispatch = useDispatch<any>();
  const schools = useSelector(selectSchools);

  const [loading, setLoading] = useState(true);
  const [editSchool, setEditSchool] = useState<ISchool>();
  const [addShow, setAddShow] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    await dispatch(loadSchools());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <MainContainer style={styles.container}>
      {loading ? (
        <View style={{ paddingTop: '50%' }}>
          <ActivityIndicator size="large" color={'black'} />
        </View>
      ) : (
        <>
          <View style={{ paddingHorizontal: 5 }}>
            {schools.map((x) => (
              <SchoolCard
                key={x.id}
                school={x}
                onEditClick={(d) => setEditSchool(d)}
                loadData={loadData}
              />
            ))}
          </View>
          <View style={styles.bottom_btn}>
            <TouchButton
              label="Add new school"
              scheme="success"
              onPress={() => setAddShow(true)}
            />
          </View>
        </>
      )}
      {editSchool && (
        <SchoolModal
          visible={true}
          updateID={editSchool.id}
          data={editSchool}
          onClose={() => setEditSchool(undefined)}
        />
      )}
      {addShow && (
        <SchoolModal visible={true} onClose={() => setAddShow(false)} />
      )}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  school_card: {
    marginVertical: 10,
    marginHorizontal: 8,
    borderColor: '#b3b3b3',
    borderWidth: 1,
    borderRadius: 3,
    padding: 10,
  },
  school_name: {
    fontSize: 20,
    fontWeight: '600',
  },
  users_cnt: {
    marginVertical: 5,
    fontSize: 19,
    fontWeight: '600',
  },
  btn_row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  bottom_btn: {
    paddingTop: 20,
    paddingBottom: 30,
    maxWidth: 300,
    alignSelf: 'center',
  },
});

export default SchoolListScreen;
