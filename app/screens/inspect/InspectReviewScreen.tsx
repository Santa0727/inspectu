import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InspectStackParamList } from '../../navigation/AppStackParams';
import { IInspectAnswer, IReviewStep } from '../../lib/entities';
import { sendRequest } from '../../config/compose';
import { useFocusEffect } from '@react-navigation/native';
import MainContainer from '../../components/container/MainContainer';
import { defaultDateFormat } from '../../lib/helper';
import { statusLabel } from '../../lib/lang';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import TouchButton from '../../components/ui/TouchButton';
import InspectClarifyForm from '../../components/manage/InspectClarifyForm';
import { COLORS } from '../../config/constants';
import ImageBox from '../../components/ui/ImageBox';
import Checkbox from '../../components/ui/Checkbox';
import InspectStepForm from '../../components/manage/InspectStepForm';

const itemColor = (status: string) => {
  if (status === 'c') {
    return COLORS.success;
  } else if (status === 'n/c') {
    return COLORS.primary;
  } else if (status === 'n/a') {
    return COLORS.secondary;
  } else {
    return 'black';
  }
};

interface ViewBoxProps {
  data: IReviewStep;
}

const InspectViewBox = ({ data }: ViewBoxProps) => (
  <View style={styles.box_view}>
    <View style={styles.box_header}>
      <FontAwesome name="home" size={30} />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: '500' }}>Location</Text>
        <Text style={{ fontSize: 18, fontWeight: '400' }}>{data.name}</Text>
      </View>
    </View>
    {data.questions.map((item, i) => (
      <View key={item.id}>
        <Text
          style={[
            styles.question_name,
            { color: itemColor(item.compliance_status) },
          ]}>
          {`${i + 1}) ${item.name}`}
        </Text>
        <View style={styles.question_body}>
          {item.options?.map((x) => (
            <Checkbox
              key={x.id}
              label={x.name}
              value={x.answer}
              disabled={true}
              markPosition="right"
            />
          ))}
          {!!item.notes && (
            <>
              <Text style={{ fontSize: 18, fontWeight: '500' }}>Notes</Text>
              <Text style={styles.question_note}>{item.notes}</Text>
            </>
          )}
          {item.images?.map((x, i) => (
            <ImageBox
              key={i}
              style={{ marginVertical: 5 }}
              image={x}
              disabled={true}
            />
          ))}
        </View>
      </View>
    ))}
  </View>
);

interface IEntryData {
  inspection_id: string;
  name: string;
  reviewed_by: string;
  date_submitted: string;
  status: string;
  entry: IReviewStep[];
}

type Props = NativeStackScreenProps<InspectStackParamList, 'InspectReview'>;

const InspectReviewScreen = ({ navigation, route }: Props) => {
  const inspectID = route.params.inspectID;

  const [entryData, setEntryData] = useState<IEntryData>();
  const [clarifyData, setClarifyData] = useState<IReviewStep>();
  const [retryData, setRetryData] = useState<IReviewStep>();
  const [viewData, setViewData] = useState<IReviewStep>();
  const [retryForm, setRetryForm] = useState<IInspectAnswer[]>([]);
  const [disabled, setDisabled] = useState(false);

  const reviewClick = (step: IReviewStep) => {
    if (step.status === 'approved') {
      setViewData(step);
      setClarifyData(undefined);
      setRetryData(undefined);
    } else if (step.status === 'clarify') {
      setClarifyData(step);
      setViewData(undefined);
      setRetryData(undefined);
    } else if (step.status === 'error') {
      setRetryData(step);
      setClarifyData(undefined);
      setViewData(undefined);
    } else {
      alert('Invalid step');
    }
  };
  const submitRetryForm = async () => {
    if (!retryData) return;
    for (let i = 0; i < retryData.questions.length; i++) {
      const answer = retryForm.find(
        (x) => x.question_id === retryData.questions[i].id,
      );
      if (!answer) {
        alert('Please fill all questions');
        return;
      }
    }
    setDisabled(true);
    const data = {
      inspection_id: inspectID,
      questions: retryForm,
    };
    const res = await sendRequest(
      `api/member/inspections/review/submit`,
      data,
      'POST',
    );
    if (res.status) {
      navigation.goBack();
    } else {
      alert(res.message ?? 'Server error');
      setDisabled(false);
    }
  };

  const loadData = useCallback(() => {
    (async () => {
      const res = await sendRequest(
        `api/member/inspections/${inspectID}/review`,
        {},
        'GET',
      );
      if (res.status) {
        setEntryData(res.data);
      } else {
        alert(res.message ?? 'Server error');
      }
    })();
  }, [inspectID]);

  useFocusEffect(loadData);

  return (
    <MainContainer style={{ padding: 5 }}>
      {entryData ? (
        <>
          {clarifyData ? (
            <InspectClarifyForm
              inspectID={inspectID}
              data={clarifyData}
              onClose={() => navigation.goBack()}
            />
          ) : retryData ? (
            <View style={{ marginBottom: 20 }}>
              <InspectStepForm
                data={retryData}
                form={retryForm}
                setForm={setRetryForm}
                isReview={true}
              />
              <TouchButton
                style={{ marginHorizontal: 12, marginVertical: 20 }}
                label="Submit"
                scheme="success"
                onPress={submitRetryForm}
                disabled={disabled}
              />
            </View>
          ) : viewData ? (
            <InspectViewBox data={viewData} />
          ) : (
            <>
              <View style={{ margin: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.th}>{'Location: '}</Text>
                  <Text style={styles.td}>{entryData.name}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.th}>{'Submitted: '}</Text>
                  <Text style={styles.td}>
                    {defaultDateFormat(entryData.date_submitted)}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.th}>{'Status: '}</Text>
                  <Text style={styles.td}>{statusLabel(entryData.status)}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.th}>{'Reviewed by: '}</Text>
                  <Text style={styles.td}>{entryData.reviewed_by}</Text>
                </View>
              </View>
              <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                {entryData.entry.map((x) => (
                  <View key={x.id} style={styles.label_btn_box}>
                    <View style={styles.label_view}>
                      {x.status === 'approved' ? (
                        <FontAwesome name="check" size={24} color="#8FD14F" />
                      ) : x.status === 'error' ? (
                        <FontAwesome name="warning" size={24} color="#f24726" />
                      ) : (
                        <FontAwesome5
                          name="question"
                          size={24}
                          color="#fac710"
                        />
                      )}
                      <Text style={styles.label_txt}>{x.name}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.touch_btn}
                      onPress={reviewClick.bind(this, x)}>
                      <Text style={styles.touch_txt}>
                        {x.status === 'approved'
                          ? 'View checklist'
                          : x.status === 'error'
                          ? 'Retry'
                          : 'Clarify'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </>
          )}
          <View style={styles.go_back_btn}>
            <TouchButton
              size="small"
              label="Go back"
              onPress={() => {
                if (viewData || clarifyData || retryData) {
                  setViewData(undefined);
                  setClarifyData(undefined);
                  setRetryData(undefined);
                } else {
                  navigation.goBack();
                }
              }}
              disabled={disabled}
            />
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
  th: {
    fontSize: 20,
    fontWeight: '600',
  },
  td: {
    fontSize: 20,
  },
  label_btn_box: {
    paddingVertical: 15,
  },
  label_view: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#d1d1d1',
  },
  label_txt: {
    fontSize: 20,
    marginLeft: 20,
  },
  touch_btn: {
    backgroundColor: '#414BB2',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginHorizontal: 20,
  },
  touch_txt: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
  },
  go_back_btn: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  box_view: {
    marginVertical: 5,
    padding: 10,
  },
  box_header: {
    flexDirection: 'row',
    borderColor: '#d1d1d1',
    borderBottomWidth: 1,
    marginHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 20,
  },
  question_name: {
    fontSize: 20,
    fontWeight: '500',
  },
  question_body: {
    marginVertical: 10,
    paddingLeft: 15,
  },
  question_note: {
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 10,
  },
});

export default InspectReviewScreen;
