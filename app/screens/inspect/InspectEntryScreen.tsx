import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MainContainer from '../../components/container/MainContainer';
import { useCallback, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { sendRequest } from '../../config/compose';
import { useFocusEffect } from '@react-navigation/native';
import ReactNativeHtmlView from 'react-native-htmlview';
import { IEntryStep, IInspectAnswer } from '../../lib/manage.entities';
import { COLORS } from '../../config/constants';
import InspectStepForm from '../../components/manage/InspectStepForm';
import ImageBox from '../../components/ui/ImageBox';
import Input from '../../components/ui/Input';
import { MaterialIcons } from '@expo/vector-icons';
import { HomeStackParamList } from '../../navigation/AppStackParams';

const HTMLView: any = ReactNativeHtmlView as any;

interface IEntry {
  first: string;
  steps_intro: string | null;
  steps: IEntryStep[];
  last: string;
}

interface ReviewProps {
  answers: IInspectAnswer[];
  step: IEntryStep;
  onClick: () => void;
}

const ReviewQuestionCard = ({ answers, step, onClick }: ReviewProps) => {
  const data = step.questions.map((question) => {
    const answer = answers.find((x) => x.question_id === question.id);
    const options =
      question.type === 'compliance' ||
      question.type === 'checkbox' ||
      question.type === 'radio'
        ? question.options?.filter((x) =>
            answer?.options?.some((y) => y.id === x.id),
          ) ?? []
        : [];
    const labels =
      question.type === 'text' || question.type === 'multitext'
        ? question.options?.map((x) => ({
            id: x.id,
            label: x.name,
            value: answer?.options.find((y) => y.id === x.id)?.value as
              | string
              | undefined,
          })) ?? []
        : [];
    const images =
      question.type === 'image'
        ? question.options?.map((x) => ({
            id: x.id,
            label: x.name,
            value: answer?.options.find((y) => y.id === x.id)?.value as
              | string
              | undefined,
          }))
        : answer?.images?.map((x, j) => ({
            id: j.toString(),
            label: '',
            value: x,
          }));

    return {
      id: question.id,
      name: question.name,
      options,
      labels,
      notes: answer?.notes,
      images,
      color:
        answer?.compliance_status === 'c'
          ? COLORS.success
          : answer?.compliance_status === 'n/c'
          ? COLORS.danger
          : answer?.compliance_status === 'n/a'
          ? COLORS.yellow
          : 'black',
    };
  });

  return (
    <View style={{ marginBottom: 20, marginTop: 5 }}>
      <Text style={{ fontSize: 20, fontWeight: '600', paddingLeft: 5 }}>
        {step.name}
      </Text>
      <TouchableOpacity style={styles.card_container} onPress={onClick}>
        {data.map((item, i) => (
          <View key={item.id}>
            <Text style={[styles.question_name, { color: item.color }]}>
              {`${i + 1}) ${item.name}`}
            </Text>
            <View style={styles.question_body}>
              {item.options.map((x) => (
                <Text key={x.id} style={styles.question_option}>
                  {x.name}
                </Text>
              ))}
              {!!item.notes && (
                <>
                  <Text style={{ fontSize: 18, fontWeight: '500' }}>Notes</Text>
                  <Text style={styles.question_note}>{item.notes}</Text>
                </>
              )}
              {item.labels.map((x) => (
                <Input
                  key={x.id}
                  label={x.label}
                  value={x.value ?? ''}
                  disabled={true}
                />
              ))}
              {item.images?.map((x, i) => (
                <ImageBox
                  key={i}
                  style={{ marginVertical: 5 }}
                  label={x.label}
                  image={x.value}
                  disabled={true}
                />
              ))}
            </View>
          </View>
        ))}
      </TouchableOpacity>
    </View>
  );
};

const StepSector = ({ isActive }: { isActive: boolean }) => (
  <>
    <View style={isActive ? styles.step_line : styles.inactive_line} />
    <View style={isActive ? styles.step_circle : styles.inactive_circle} />
  </>
);

type Props = NativeStackScreenProps<HomeStackParamList, 'InspectEntry'>;

const InspectEntryScreen = ({ navigation, route }: Props) => {
  const inspectID = route.params.inspectID;

  const storageKey = `__inspect_form_${inspectID}`;

  const [step, setStep] = useState(0);
  const [entry, setEntry] = useState<IEntry>();
  const [form, setForm] = useState<IInspectAnswer[]>([]);
  const [disabled, setDisabled] = useState(false);

  const validForm = () => {
    return {
      inspection_id: inspectID,
      questions: form,
    };
  };

  const updateForm = (data: IInspectAnswer[]) => {
    AsyncStorage.setItem(storageKey, JSON.stringify(data));
    setForm(data);
  };
  const nextClick = async () => {
    if (!entry) return;
    if (step === entry.steps.length + 1) {
      const data = validForm();
      if (!data) return;

      setDisabled(true);
      const res = await sendRequest(
        'api/member/inspections/submit',
        data,
        'POST',
      );
      if (!res.status) {
        alert(res.message ?? 'Server error');
      } else {
        try {
          await AsyncStorage.removeItem(storageKey);
        } catch (e) {}
        setStep(step + 1);
      }
      setDisabled(false);
    } else if (step === entry.steps.length + 2) {
      navigation.goBack();
    } else if (step === 0) {
      setDisabled(true);
      const res = await sendRequest(
        'api/member/inspections/start',
        { inspection_id: inspectID },
        'POST',
      );
      if (res.status) {
        setStep(step + 1);
      } else {
        alert(res.message ?? 'Server error');
      }
      setDisabled(false);
    } else {
      setStep(step + 1);
    }
  };

  const loadData = useCallback(() => {
    (async () => {
      const res = await sendRequest(
        `api/member/inspections/${inspectID}`,
        {},
        'GET',
      );
      if (res.status) {
        setEntry(res.data);
        try {
          const saved = await AsyncStorage.getItem(storageKey);
          if (saved) {
            const parsed = JSON.parse(saved) as IInspectAnswer[];
            if (Array.isArray(parsed) && parsed.length > 0) {
              setForm(parsed);
            }
          }
        } catch (e) {}
      } else {
        alert(res.message ?? 'Server error');
      }
    })();
  }, [inspectID, storageKey]);

  useFocusEffect(loadData);

  return (
    <MainContainer style={{ padding: 5 }}>
      {entry ? (
        <>
          <View style={styles.steps_view}>
            <TouchableOpacity
              style={styles.step_touch}
              onPress={() =>
                step <= 0 ? navigation.goBack() : setStep(step - 1)
              }
              disabled={disabled || step > entry.steps.length + 1}>
              <MaterialIcons
                name="navigate-before"
                size={26}
                color={
                  disabled || step > entry.steps.length + 1
                    ? COLORS.disabled
                    : COLORS.dark
                }
              />
            </TouchableOpacity>
            <View style={styles.steps_bar}>
              <View style={styles.step_circle} />
              {Array.from(
                { length: entry.steps.length + 2 },
                (_, id) => id + 1,
              ).map((x) => (
                <StepSector key={x} isActive={step >= x} />
              ))}
            </View>
            <TouchableOpacity
              style={styles.step_touch}
              onPress={nextClick}
              disabled={disabled}>
              <MaterialIcons
                name="navigate-next"
                size={26}
                color={disabled ? COLORS.disabled : COLORS.dark}
              />
            </TouchableOpacity>
          </View>
          <View style={{ padding: 10, minHeight: 300 }}>
            {step === 0 ? (
              <View style={styles.panel}>
                <Text style={{ fontSize: 20, fontWeight: '600' }}>
                  {'Read before you start'}
                </Text>
                <HTMLView style={{ marginTop: 10 }} value={entry.first} />
              </View>
            ) : step === entry.steps.length + 2 ? (
              <View>
                <Text style={{ fontSize: 24, fontWeight: '600' }}>
                  {'Thank you for your submitting report'}
                </Text>
                <HTMLView style={{ marginTop: 10 }} value={entry.last} />
              </View>
            ) : step === entry.steps.length + 1 ? (
              <View>
                <Text style={{ fontSize: 24, fontWeight: '600' }}>Review</Text>
                <HTMLView
                  style={{ marginTop: 10 }}
                  value={entry.steps_intro ?? ''}
                />
                {entry.steps.map((x, i) => (
                  <ReviewQuestionCard
                    key={i}
                    answers={form}
                    step={x}
                    onClick={() => setStep(i + 1)}
                  />
                ))}
              </View>
            ) : (
              <>
                {!!entry.steps_intro && (
                  <HTMLView
                    style={{ marginVertical: 20, marginHorizontal: 10 }}
                    value={entry.steps_intro ?? ''}
                  />
                )}
                <InspectStepForm
                  data={entry.steps[step - 1]}
                  form={form}
                  setForm={updateForm}
                />
              </>
            )}
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
    paddingBottom: 30,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  step_touch: {
    width: 43,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: COLORS.blueGrey,
    backgroundColor: '#FFFFFF',
  },
  steps_bar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 25,
    height: 43,
  },
  step_circle: {
    backgroundColor: COLORS.dark,
    width: 20,
    height: 20,
    borderRadius: 20,
    margin: -5,
    zIndex: 1,
  },
  step_line: {
    flex: 1,
    height: 5,
    backgroundColor: COLORS.dark,
  },
  inactive_circle: {
    backgroundColor: '#C4CFE5',
    width: 20,
    height: 20,
    borderRadius: 20,
    margin: -5,
    zIndex: 1,
  },
  inactive_line: {
    flex: 1,
    height: 5,
    backgroundColor: '#C4CFE5',
  },
  card_container: {
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 5,
  },
  question_name: {
    fontSize: 20,
    fontWeight: '500',
  },
  question_body: {
    marginVertical: 10,
    paddingLeft: 15,
  },
  question_option: {
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 5,
  },
  question_note: {
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 10,
  },
  panel: {
    borderColor: COLORS.blueGrey,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 15,
  },
});

export default InspectEntryScreen;
