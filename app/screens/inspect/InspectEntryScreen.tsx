import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MainContainer from '../../components/container/MainContainer';
import { useCallback, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InspectStackParamList } from '../../navigation/AppStackParams';
import { sendRequest } from '../../config/compose';
import { useFocusEffect } from '@react-navigation/native';
import HTMLView from 'react-native-htmlview';
import InspectStep from '../../components/manage/InspectStep';
import { IEntryStep } from '../../lib/entities';

interface IEntry {
  first: string;
  steps_intro: string | null;
  steps: IEntryStep[];
  last: string;
}

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
    let result: any = { inspection_id: inspectID, ...form };
    for (let s of entry.steps) {
      if (!form[s.options.id]) {
        alert(`Please pick image for ${s.name}`);
        return null;
      }
      s.questions.forEach((e) => {
        e.options.forEach((t) => {
          if (result[t.id] === undefined) result[t.id] = false;
        });
      });
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
      if (step > 0 && !form[entry.steps[step - 1].options.id]) {
        alert(`Please pick image`);
      } else {
        setStep(step + 1);
      }
    }
  };

  const loadData = useCallback(() => {
    sendRequest(`api/member/inspections/${inspectID}`, {}, 'GET').then(
      (res) => {
        if (res.status) {
          let tmp = { ...res.data };
          tmp.steps = [];
          for (const k in res.data.steps) {
            tmp.steps.push(res.data.steps[k]);
          }
          setEntry(tmp);
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
              <InspectStep
                form={form}
                setForm={setForm}
                data={entry.steps[step - 1]}
                stepsIntro={entry.steps_intro}
              />
            )}
          </View>
          <View style={styles.steps_view}>
            <View style={styles.steps_btn}>
              {step <= entry.steps.length ? (
                <TouchableOpacity
                  style={[styles.next_btn, disabled ? styles.disabled : {}]}
                  onPress={() =>
                    step <= 0 ? navigation.goBack() : setStep(step - 1)
                  }
                  disabled={disabled}>
                  <Text style={styles.next_txt}>
                    {step <= 0 ? 'Go Back' : 'Previous'}
                  </Text>
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

export default InspectEntryScreen;
