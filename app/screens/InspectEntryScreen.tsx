import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MainContainer from '../components/container/MainContainer';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import Checkbox from '../components/ui/Checkbox';
import RadioSelect from '../components/ui/RadioSelect';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InspectStackParamList } from '../navigation/AppStackParams';

const StepOneView = () => (
  <View style={{ paddingHorizontal: 10 }}>
    <Text style={{ fontSize: 24, fontWeight: '600' }}>Read before start</Text>
    <Text style={{ marginVertical: 10, fontSize: 19 }}>
      {
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam accumsan accumsan lorem, nec lobortis est tincidunt vel. Donec lobortis porttitor dapibus. Praesent pretium suscipit nulla. Fusce mollis hendrerit risus vel tincidunt. Quisque mattis ac lacus non posuere. Morbi facilisis fringilla lorem ac consequat. Ut vitae consequat tortor, sit amet laoreet felis. Nunc eleifend, nunc eget laoreet faucibus, erat mi fringilla'
      }
    </Text>
    <View style={{ flexDirection: 'row', paddingLeft: 10, paddingTop: 10 }}>
      <Text style={{ fontSize: 19 }}>{'1. '}</Text>
      <Text style={{ fontSize: 19 }}>
        {
          'Quisque auctor leo nec eros faucibus tincidunt et et tellus. In ut ultrices nibh'
        }
      </Text>
    </View>
    <View style={{ flexDirection: 'row', paddingLeft: 10, paddingTop: 10 }}>
      <Text style={{ fontSize: 19 }}>{'2. '}</Text>
      <Text style={{ fontSize: 19 }}>
        {
          'Donec neque ex, eleifend ut ipsum vel, finibus malesuada sapien. Quisque non dui sit amet sapien porta fringilla.'
        }
      </Text>
    </View>
    <View style={{ flexDirection: 'row', paddingLeft: 10, paddingTop: 10 }}>
      <Text style={{ fontSize: 19 }}>{'3. '}</Text>
      <Text style={{ fontSize: 19 }}>
        {
          'Aenean enim nisl, venenatis non enim bibendum, accumsan pellentesque eros. Nulla rhoncus tortor metus, ac rhoncus lacus cursus et.'
        }
      </Text>
    </View>
  </View>
);

const StepTwoView = () => (
  <View>
    <View
      style={{
        flexDirection: 'row',
        borderColor: '#d1d1d1',
        borderBottomWidth: 1,
        marginHorizontal: 20,
        alignItems: 'center',
        paddingBottom: 10,
      }}>
      <FontAwesome name="home" size={30} />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: '500' }}>Location</Text>
        <Text style={{ fontSize: 18, fontWeight: '400' }}>Freezer</Text>
      </View>
    </View>
    <Text style={{ fontSize: 20, marginVertical: 20, marginHorizontal: 10 }}>
      {
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam accumsan accumsan lorem, nec lobortis est tincidunt vel.'
      }
    </Text>
    <View style={cardStyle.card}>
      <Image
        source={require('../images/demo-school-image.png')}
        style={cardStyle.img}
      />
      <View style={cardStyle.name_view}>
        <Text style={cardStyle.time}>{'28-Oct 10:24 am'}</Text>
        <Text style={cardStyle.name}>{'Picture of inside of freezer'}</Text>
      </View>
    </View>
    <View style={cardStyle.card}>
      <Image
        source={require('../images/demo-school-image.png')}
        style={cardStyle.img}
      />
      <View style={cardStyle.name_view}>
        <Text style={cardStyle.time}>{'28-Oct 10:24 am'}</Text>
        <Text style={cardStyle.name}>{'Picture of inside of freezer'}</Text>
      </View>
    </View>
    <View style={cardStyle.card}>
      <Image
        source={require('../images/demo-school-image.png')}
        style={cardStyle.img}
      />
      <View style={cardStyle.name_view}>
        <Text style={cardStyle.time}>{'28-Oct 10:24 am'}</Text>
        <Text style={cardStyle.name}>{'Picture of inside of freezer'}</Text>
      </View>
    </View>
  </View>
);

const radioOptions = [
  { id: 1, label: 'This one' },
  { id: 2, label: 'Or this one' },
];

const StepThreeView = () => (
  <View>
    <View
      style={{
        flexDirection: 'row',
        borderColor: '#d1d1d1',
        borderBottomWidth: 1,
        marginHorizontal: 20,
        alignItems: 'center',
        paddingBottom: 10,
      }}>
      <FontAwesome name="home" size={30} />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: '500' }}>Location</Text>
        <Text style={{ fontSize: 18, fontWeight: '400' }}>Freezer</Text>
      </View>
    </View>
    <Text style={{ fontSize: 20, marginVertical: 20, marginHorizontal: 10 }}>
      {'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
    </Text>
    <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
      <Text style={{ fontSize: 21, fontWeight: '600', marginBottom: 5 }}>
        {'Did you check this'}
      </Text>
      <Checkbox value={true} label="I confirm that this is checked" />
      <Checkbox value={false} label="I confirm that this is checked" />
    </View>
    <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
      <Text style={{ fontSize: 21, fontWeight: '600', marginBottom: 5 }}>
        {'Which one it is'}
      </Text>
      <RadioSelect options={radioOptions} value={1} />
    </View>
  </View>
);

const StepFourView = () => (
  <View style={{ paddingHorizontal: 10 }}>
    <Text style={{ fontSize: 24, fontWeight: '600' }}>
      {'Thank you for your submitting report'}
    </Text>
    <Text style={{ marginVertical: 10, fontSize: 19 }}>
      {
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam accumsan accumsan lorem, nec lobortis est tincidunt vel. Donec lobortis porttitor dapibus. Praesent pretium suscipit nulla. Fusce mollis hendrerit risus vel tincidunt. Quisque mattis ac lacus non posuere. Morbi facilisis fringilla lorem ac consequat. Ut vitae consequat tortor, sit amet laoreet felis. Nunc eleifend, nunc eget laoreet faucibus, erat mi fringilla'
      }
    </Text>
    <View style={{ flexDirection: 'row', paddingLeft: 10, paddingTop: 10 }}>
      <Text style={{ fontSize: 19 }}>{'1. '}</Text>
      <Text style={{ fontSize: 19 }}>
        {
          'Quisque auctor leo nec eros faucibus tincidunt et et tellus. In ut ultrices nibh'
        }
      </Text>
    </View>
    <View style={{ flexDirection: 'row', paddingLeft: 10, paddingTop: 10 }}>
      <Text style={{ fontSize: 19 }}>{'2. '}</Text>
      <Text style={{ fontSize: 19 }}>
        {
          'Donec neque ex, eleifend ut ipsum vel, finibus malesuada sapien. Quisque non dui sit amet sapien porta fringilla.'
        }
      </Text>
    </View>
    <View style={{ flexDirection: 'row', paddingLeft: 10, paddingTop: 10 }}>
      <Text style={{ fontSize: 19 }}>{'3. '}</Text>
      <Text style={{ fontSize: 19 }}>
        {
          'Aenean enim nisl, venenatis non enim bibendum, accumsan pellentesque eros. Nulla rhoncus tortor metus, ac rhoncus lacus cursus et.'
        }
      </Text>
    </View>
  </View>
);

type Props = NativeStackScreenProps<InspectStackParamList, 'InspectEntry'>;

const InspectEntryScreen = ({ navigation }: Props) => {
  const [step, setStep] = useState(1);

  const nextClick = () => {
    if (step >= 4) {
      navigation.goBack();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <MainContainer style={{ padding: 5 }}>
      {step === 1 ? (
        <StepOneView />
      ) : step === 2 ? (
        <StepTwoView />
      ) : step === 3 ? (
        <StepThreeView />
      ) : (
        <StepFourView />
      )}
      <View style={styles.steps_view}>
        <View style={styles.steps_btn}>
          {step > 1 ? (
            <TouchableOpacity
              style={styles.next_btn}
              onPress={() => setStep(Math.max(1, step - 1))}>
              <Text style={styles.next_txt}>Previous</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          <TouchableOpacity style={styles.next_btn} onPress={nextClick}>
            <Text style={styles.next_txt}>
              {step === 4 ? 'Finish' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.steps_bar}>
          <View style={styles.step_circle} />
          <View style={step > 1 ? styles.step_line : styles.inactive_line} />
          <View
            style={step > 1 ? styles.step_circle : styles.inactive_circle}
          />
          <View style={step > 2 ? styles.step_line : styles.inactive_line} />
          <View
            style={step > 2 ? styles.step_circle : styles.inactive_circle}
          />
          <View style={step > 3 ? styles.step_line : styles.inactive_line} />
          <View
            style={step > 3 ? styles.step_circle : styles.inactive_circle}
          />
        </View>
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  steps_view: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  steps_btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  next_btn: {
    backgroundColor: '#414BB2',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 5,
  },
  next_txt: {
    color: 'white',
    fontSize: 19,
  },
  steps_bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  step_circle: {
    backgroundColor: '#414BB2',
    width: 15,
    height: 15,
    borderRadius: 15,
    margin: -5,
    zIndex: 1,
  },
  step_line: {
    flex: 1,
    height: 5,
    backgroundColor: '#414BB2',
  },
  inactive_circle: {
    backgroundColor: '#d9dbf0',
    width: 15,
    height: 15,
    borderRadius: 15,
    margin: -5,
    zIndex: 1,
  },
  inactive_line: {
    flex: 1,
    height: 5,
    backgroundColor: '#d9dbf0',
  },
});

const cardStyle = StyleSheet.create({
  card: {
    borderWidth: 3,
    borderColor: '#d1d1d1',
    flexDirection: 'row',
    marginVertical: 8,
  },
  img: {
    width: 150,
    height: 95,
    resizeMode: 'contain',
  },
  name_view: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  time: {
    fontSize: 22,
    fontWeight: '600',
  },
  name: {
    fontSize: 18,
  },
});

export default InspectEntryScreen;
