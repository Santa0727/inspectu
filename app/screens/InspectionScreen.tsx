import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MainContainer from '../components/container/MainContainer';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';

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
    <View>
      <FontAwesome name="home" size={30} />
      <View>
        <Text>Location</Text>
        <Text>Freezer</Text>
      </View>
    </View>
    <Text>
      {
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam accumsan accumsan lorem, nec lobortis est tincidunt vel.'
      }
    </Text>
  </View>
);

const InspectionScreen = () => {
  const [step, setStep] = useState(1);

  return (
    <MainContainer style={{ padding: 5 }}>
      {step === 1 ? <StepOneView /> : <StepTwoView />}
      <View style={styles.steps_view}>
        <TouchableOpacity style={styles.next_btn}>
          <Text style={styles.next_txt}>Next</Text>
        </TouchableOpacity>
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
          <View style={step > 4 ? styles.step_line : styles.inactive_line} />
          <View
            style={step > 4 ? styles.step_circle : styles.inactive_circle}
          />
          <View style={step > 5 ? styles.step_line : styles.inactive_line} />
          <View
            style={step > 5 ? styles.step_circle : styles.inactive_circle}
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
  next_btn: {
    alignSelf: 'flex-end',
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

export default InspectionScreen;
