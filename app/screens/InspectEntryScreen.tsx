import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MainContainer from '../components/container/MainContainer';
import { FontAwesome } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import Checkbox from '../components/ui/Checkbox';
import RadioSelect from '../components/ui/RadioSelect';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InspectStackParamList } from '../navigation/AppStackParams';
import { sendRequest } from '../config/compose';
import { useFocusEffect } from '@react-navigation/native';
import HTMLView from 'react-native-htmlview';
import ImageBox from '../components/ui/ImageBox';

interface IStep {
  id: string;
  name: string;
  text: string;
  type: 'multipleimage' | 'checkbox' | 'radio';
  options: Array<{ id: string; name: string }>;
}

interface IEntry {
  first: string;
  steps: IStep[];
  last: string;
}

interface FormProps {
  form: any;
  setForm: (d: any) => void;
  step: IStep;
}

const StepForm = ({ form, setForm, step }: FormProps) => {
  const changeImage = (id: string, img: string) => {
    setForm({ ...form, [id]: img });
  };
  const toggleCheck = (id: string, c: boolean) => {
    setForm({ ...form, [id]: c });
  };
  const selectRadio = (c: string) => {
    const v = step.options.find((x) => !!form[x.id]);
    let tmp = { ...form };
    if (v) {
      tmp[v.id] = false;
    }
    tmp[c] = true;
    setForm(tmp);
  };

  return (
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
          <Text style={{ fontSize: 18, fontWeight: '400' }}>{step.name}</Text>
        </View>
      </View>
      <HTMLView
        style={{ marginVertical: 20, marginHorizontal: 10 }}
        value={step.text}
      />
      {step.type === 'multipleimage' ? (
        step.options.map((x) => (
          <View key={x.id} style={cardStyle.card}>
            <ImageBox
              image={form[x.id] ?? undefined}
              onChange={(m) => changeImage(x.id, m)}
            />
            <View style={cardStyle.name_view}>
              <Text style={cardStyle.time}>{x.name}</Text>
              <Text style={cardStyle.name}>{''}</Text>
            </View>
          </View>
        ))
      ) : step.type === 'checkbox' ? (
        <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 21, fontWeight: '600', marginBottom: 5 }}>
            {'Did you check this'}
          </Text>
          {step.options.map((x) => (
            <Checkbox
              key={x.id}
              value={form[x.id] ?? false}
              label={x.name}
              onChange={(c) => toggleCheck(x.id, c)}
            />
          ))}
        </View>
      ) : (
        <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 21, fontWeight: '600', marginBottom: 5 }}>
            {'Which one it is'}
          </Text>
          <RadioSelect
            options={step.options.map((x) => ({ id: x.id, label: x.name }))}
            value={step.options.find((x) => !!form[x.id])?.id}
            onChange={(c) => selectRadio(c.toString())}
          />
        </View>
      )}
    </View>
  );
};

const StepSector = ({ isActive }: { isActive: boolean }) => (
  <>
    <View style={isActive ? styles.step_line : styles.inactive_line} />
    <View style={isActive ? styles.step_circle : styles.inactive_circle} />
  </>
);

type Props = NativeStackScreenProps<InspectStackParamList, 'InspectEntry'>;

const InspectEntryScreen = ({ navigation, route }: Props) => {
  const inspectID = route.params.inspectID;

  const [step, setStep] = useState(0);
  const [entry, setEntry] = useState<IEntry>();
  const [form, setForm] = useState<any>({});
  const [disabled, setDisabled] = useState(false);

  const validForm = () => {
    if (!entry) return null;
    let result: any = { inspection_id: inspectID };
    for (let s of entry.steps) {
      if (s.type === 'multipleimage') {
        for (let o of s.options) {
          if (!form[o.id]) {
            alert(`Please pick image for ${o.name}`);
            return null;
          }
          result[o.id] = form[o.id];
        }
      } else {
        for (let o of s.options) {
          result[o.id] = form[o.id] ?? false;
        }
      }
    }
    return result;
  };

  const nextClick = async () => {
    if (!entry) return;
    if (step === entry.steps.length) {
      const data = validForm();
      if (!data) return;

      setDisabled(true);
      const res = await sendRequest(
        'api/member/inspections/submit',
        data,
        'POST',
      );
      setDisabled(false);
      if (!res.status) {
        alert(res.message ?? 'Server error');
      } else {
        setStep(step + 1);
      }
    } else if (step > entry.steps.length) {
      navigation.goBack();
    } else {
      setStep(step + 1);
    }
  };

  const loadData = useCallback(() => {
    sendRequest(`api/member/inspections/${inspectID}`, {}, 'GET').then(
      (res) => {
        if (res.status) {
          setEntry(res.data);
        } else {
          alert(res.message ?? 'Server error');
        }
      },
    );
  }, [inspectID]);

  useFocusEffect(loadData);

  return (
    <MainContainer style={{ padding: 5 }}>
      {entry ? (
        <>
          <View style={{ padding: 10, minHeight: 300 }}>
            {step === 0 ? (
              <View>
                <Text style={{ fontSize: 24, fontWeight: '600' }}>
                  Read before start
                </Text>
                <HTMLView style={{ marginTop: 10 }} value={entry.first} />
              </View>
            ) : step > entry.steps.length ? (
              <View>
                <Text style={{ fontSize: 24, fontWeight: '600' }}>
                  {'Thank you for your submitting report'}
                </Text>
                <HTMLView style={{ marginTop: 10 }} value={entry.last} />
              </View>
            ) : (
              <StepForm
                form={form}
                setForm={setForm}
                step={entry.steps[step - 1]}
              />
            )}
          </View>
          <View style={styles.steps_view}>
            <View style={styles.steps_btn}>
              {step > 0 && step <= entry.steps.length ? (
                <TouchableOpacity
                  style={[styles.next_btn, disabled ? styles.disabled : {}]}
                  onPress={() => setStep(Math.max(0, step - 1))}
                  disabled={disabled}>
                  <Text style={styles.next_txt}>Previous</Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}
              <TouchableOpacity
                style={[styles.next_btn, disabled ? styles.disabled : {}]}
                onPress={nextClick}
                disabled={disabled}>
                <Text style={styles.next_txt}>
                  {step === entry.steps.length
                    ? 'Submit'
                    : step === entry.steps.length + 1
                    ? 'Finish'
                    : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.steps_bar}>
              <View style={styles.step_circle} />
              {Array.from(
                { length: entry.steps.length + 1 },
                (_, id) => id + 1,
              ).map((x) => (
                <StepSector key={x} isActive={step >= x} />
              ))}
            </View>
          </View>
        </>
      ) : (
        <View style={{ paddingTop: '50%' }}>
          <ActivityIndicator size="large" color={'black'} />
        </View>
      )}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  steps_view: {
    paddingVertical: 30,
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
    marginTop: 20,
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
  disabled: {
    backgroundColor: '#737373',
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
