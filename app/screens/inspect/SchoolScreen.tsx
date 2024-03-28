import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InspectStackParamList } from '../../navigation/AppStackParams';
import MainContainer from '../../components/container/MainContainer';
import { Text, View } from 'react-native';

type Props = NativeStackScreenProps<InspectStackParamList, 'School'>;

const SchoolScreen = ({ navigation, route }: Props) => {
  return (
    <MainContainer>
      <View>
        <Text style={{ fontSize: 30 }}>School Screen</Text>
      </View>
    </MainContainer>
  );
};

export default SchoolScreen;
