import { StyleSheet, Text, View } from 'react-native';
import MainContainer from '../components/container/MainContainer';

const ScheduleScreen = () => {
  return (
    <MainContainer style={{ padding: 10 }}>
      <View style={{ marginVertical: 20 }}>
        <Text style={styles.title}>Upcoming deadlines</Text>
      </View>
      <View>
        <Text>1. 20 November - School A</Text>
        <Text>2. 11 December - School B</Text>
        <Text>3. 21 January - School C</Text>
      </View>
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
