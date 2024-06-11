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
import { IEntryStep, IInspectAnswer } from '../../lib/entities';
import { COLORS } from '../../config/constants';
import InspectStepForm from '../../components/manage/InspectStepForm';
import ImageBox from '../../components/ui/ImageBox';
import Input from '../../components/ui/Input';

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
          ? COLORS.primary
          : answer?.compliance_status === 'n/a'
          ? COLORS.secondary
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

type Props = NativeStackScreenProps<InspectStackParamList, 'InspectEntry'>;

const InspectEntryScreen = ({ navigation, route }: Props) => {
  const inspectID = route.params.inspectID;

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
      if (
        entry.steps[step - 1].questions.every(
          (x) => !form.some((y) => y.question_id === x.id),
        )
      ) {
        alert('Please answer for at least one question');
        return;
      }
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
      } else {
        alert(res.message ?? 'Server error');
      }
    })();
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
                  setForm={setForm}
                />
              </>
            )}
          </View>
          <View style={styles.steps_view}>
            <View style={styles.steps_btn}>
              {step < entry.steps.length + 2 ? (
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
                    ? 'Review'
                    : step === entry.steps.length + 1
                    ? 'Submit'
                    : step === entry.steps.length + 2
                    ? 'Finish'
                    : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.steps_bar}>
              <View style={styles.step_circle} />
              {Array.from(
                { length: entry.steps.length + 2 },
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
});

export default InspectEntryScreen;
