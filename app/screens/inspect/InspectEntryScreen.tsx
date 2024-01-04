import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MainContainer from '../../components/container/MainContainer';
import { FC, useCallback, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InspectStackParamList } from '../../navigation/AppStackParams';
import { sendRequest } from '../../config/compose';
import { useFocusEffect } from '@react-navigation/native';
import HTMLView from 'react-native-htmlview';
import { IEntryStep } from '../../lib/entities';
import { FontAwesome } from '@expo/vector-icons';
import ImageBox from '../../components/ui/ImageBox';
import { COLORS } from '../../config/constants';

const FormStep: FC<{
  data: IEntryStep;
  form: any;
  setForm: (d: any) => void;
  goToReview: (d: IEntryStep) => void;
  disabled?: boolean;
}> = ({ data, form, setForm, goToReview, disabled }) => {
  const changeImage = (img: string) => {
    setForm({ ...form, [data.options.id]: img });
  };
  return (
    <View style={styles.card}>
      <ImageBox
        image={
          (form ?? {})[data.options.id] ?? data.options.answer ?? undefined
        }
        onChange={(m) => changeImage(m)}
        disabled={disabled}
      />
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          marginHorizontal: 20,
          alignItems: 'center',
          paddingBottom: 10,
        }}
        onPress={() => goToReview(data)}>
        <FontAwesome name="home" size={30} />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 22, fontWeight: '500' }}>Location</Text>
          <Text style={{ fontSize: 18, fontWeight: '400' }}>{data.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

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

  const goToReview = (step: IEntryStep) =>
    navigation.navigate('InspectReview', {
      inspectID,
      entryStep: step,
      initialForm: form,
      onConfirm: (d) => setForm(d),
    });

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
    if (step === 1) {
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
    } else if (step === 2) {
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
            ) : step > 1 ? (
              <View>
                <Text style={{ fontSize: 24, fontWeight: '600' }}>
                  {'Thank you for your submitting report'}
                </Text>
                <HTMLView style={{ marginTop: 10 }} value={entry.last} />
              </View>
            ) : (
              <>
                {!!entry.steps_intro && (
                  <HTMLView
                    style={{ marginVertical: 20, marginHorizontal: 10 }}
                    value={entry.steps_intro ?? ''}
                  />
                )}
                {entry.steps.map((step) => (
                  <FormStep
                    key={step.id}
                    data={step}
                    form={form}
                    setForm={setForm}
                    goToReview={goToReview}
                    disabled={disabled}
                  />
                ))}
              </>
            )}
          </View>
          <View style={styles.steps_view}>
            <View style={styles.steps_btn}>
              {step < 2 ? (
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
                  {step === 1 ? 'Submit' : step === 2 ? 'Finish' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.steps_bar}>
              <View style={styles.step_circle} />
              {Array.from({ length: 2 }, (_, id) => id + 1).map((x) => (
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
    backgroundColor: COLORS.inactive,
    width: 15,
    height: 15,
    borderRadius: 15,
    margin: -5,
    zIndex: 1,
  },
  inactive_line: {
    flex: 1,
    height: 5,
    backgroundColor: COLORS.inactive,
  },
  disabled: {
    backgroundColor: COLORS.disabled,
  },
  card: {
    borderWidth: 3,
    borderColor: '#d1d1d1',
    flexDirection: 'row',
    marginVertical: 8,
  },
});

export default InspectEntryScreen;
