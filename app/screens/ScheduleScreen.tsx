import { StyleSheet, Text, View } from 'react-native';
import MainContainer from '../components/container/MainContainer';
import Calendar from '../components/ui/Calendar';

const ScheduleScreen = () => {
  return (
    <MainContainer style={{ padding: 10 }}>
      <View style={{ marginVertical: 20 }}>
        <Text style={styles.title}>Upcoming deadlines</Text>
      </View>
      <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
        <Text>1. 20 November - School A</Text>
        <Text>2. 11 December - School B</Text>
        <Text>3. 21 January - School C</Text>
      </View>
      <Calendar style={{ marginVertical: 20 }} />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
});

export default ScheduleScreen;
