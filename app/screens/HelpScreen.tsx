import { StyleSheet, Text, View } from 'react-native';
import MainContainer from '../components/container/MainContainer';

const HelpScreen = () => {
  return (
    <MainContainer style={{ padding: 10 }}>
      <View style={{ marginVertical: 10 }}>
        <Text style={styles.title}>View training materials</Text>
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

export default HelpScreen;
