import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IEntryStep, IInspectAnswer, IReviewStep } from '../../lib/entities';
import Modal from '../ui/Modal';
import Checkbox from '../ui/Checkbox';
import CommentBox from '../ui/CommentBox';
import { useState } from 'react';
import ImageBox from '../ui/ImageBox';
import TouchButton from '../ui/TouchButton';
import { COLORS } from '../../config/constants';

interface IOption {
  id: string;
  name: string;
}

interface QuestionProps {
  visible: boolean;
  title: string;
  data: IInspectAnswer;
  options: IOption[];
  onConfirm: (d: IInspectAnswer) => void;
  onClose: () => void;
}

const QuestionModal = ({
  visible,
  title,
  options,
  data,
  onConfirm,
  onClose,
}: QuestionProps) => {
  const [images, setImages] = useState(data.images ?? []);
  const [checked, setChecked] = useState(data.options ?? []);
  const [notes, setNotes] = useState(data.notes ?? '');

  const toggleCheck = (id: string, c: boolean) => {
    let tmp = checked.filter((x) => x.id !== id);
    if (c) {
      tmp.push({ id, value: c });
    }
    setChecked(tmp);
  };
  const changeImage = (i: number, img: string) => {
    let tmp = [...images];
    tmp[i] = img;
    setImages(tmp);
  };
  const addImage = (img: string) => {
    setImages([...images, img]);
  };
  const confirmClick = () =>
    onConfirm({
      ...data,
      options: checked,
      images,
      notes: notes ? notes : undefined,
    });

  return (
    <Modal
      visible={visible}
      title={title}
      showFooter={true}
      onClose={onClose}
      onConfirm={confirmClick}
      size="small">
      {options.map((x) => (
        <Checkbox
          key={x.id}
          label={x.name}
          value={checked.some((y) => y.value && y.id === x.id)}
          onChange={(v) => toggleCheck(x.id, v)}
          markPosition="right"
        />
      ))}
      <CommentBox
        label="Notes"
        style={styles.note}
        value={notes}
        onChange={(v) => setNotes(v)}
      />
      <View style={styles.images}>
        {images.map((x, i) => (
          <ImageBox
            style={{ marginVertical: 5 }}
            key={i}
            image={x}
            onChange={(v) => changeImage(i, v)}
          />
        ))}
        <ImageBox onChange={(v) => addImage(v)} />
      </View>
    </Modal>
  );
};

interface ISelectedData {
  options: IOption[];
  answer: IInspectAnswer;
  title: string;
}

interface CompliantProps {
  compliantClick: () => void;
  nonCompliantClick: (type: 'NA' | 'NC') => void;
  onClose: () => void;
}

const CompliantModal = ({
  compliantClick,
  nonCompliantClick,
  onClose,
}: CompliantProps) => (
  <Modal
    visible={true}
    title="Select compliant status"
    showFooter={false}
    onClose={onClose}
    size="small">
    <TouchButton
      style={{ marginVertical: 10 }}
      label="Compliant"
      scheme="success"
      size="small"
      onPress={compliantClick}
    />
    <TouchButton
      style={{ marginVertical: 10 }}
      label="N/C"
      scheme="danger"
      size="small"
      onPress={() => nonCompliantClick('NC')}
    />
    <TouchButton
      style={{ marginVertical: 10 }}
      label="N/A"
      scheme="yellow"
      size="small"
      onPress={() => nonCompliantClick('NA')}
    />
  </Modal>
);

interface Props {
  form: IInspectAnswer[];
  setForm: (d: IInspectAnswer[]) => void;
  data: IEntryStep | IReviewStep;
  isReview?: boolean;
}

const InspectStepForm = ({ form, setForm, data, isReview }: Props) => {
  const [queID, setQueID] = useState<string>();
  const [selected, setSelected] = useState<ISelectedData>();

  const getColor = (id: string) => {
    const com = form.find((x) => x.question_id === id);
    if (com?.compliance_status === 'c') {
      return COLORS.success;
    } else if (com?.compliance_status === 'n/c') {
      return COLORS.danger;
    } else if (com?.compliance_status === 'n/a') {
      return COLORS.yellow;
    } else {
      return 'black';
    }
  };
  const compliantClick = () => {
    if (!queID) return;
    let tmp = [...form];
    const i = tmp.findIndex((x) => x.question_id === queID);
    if (i >= 0) {
      tmp[i].compliance_status = 'c';
    } else {
      tmp.push({
        question_id: queID,
        compliance_status: 'c',
        options: [],
      });
    }
    setForm(tmp);
    setSelected(undefined);
    setQueID(undefined);
  };
  const nonCompliantClick = (type: 'NA' | 'NC') => {
    if (!queID) return;
    let tmp = [...form];
    const i = tmp.findIndex((x) => x.question_id === queID);
    if (i >= 0) {
      tmp[i].compliance_status = type === 'NA' ? 'n/a' : 'n/c';
    } else {
      tmp.push({
        question_id: queID,
        compliance_status: type === 'NA' ? 'n/a' : 'n/c',
        options: [],
      });
    }
    setForm(tmp);
    const question = data.questions.find((x) => x.id === queID);
    const options = question?.options?.filter((x) => x.qType === type) ?? [];
    const answer = i >= 0 ? tmp[i] : tmp[tmp.length - 1];

    setSelected({ options, answer, title: question?.name ?? '' });
    setQueID(undefined);
  };
  const clearClick = () => {
    let tmp = form.filter(
      (x) => !data.questions.some((y) => y.id === x.question_id),
    );
    setForm(tmp);
    setQueID(undefined);
    setSelected(undefined);
  };
  const confirmModal = (d: IInspectAnswer) => {
    let tmp = [...form];
    const i = tmp.findIndex((x) => x.question_id === d.question_id);
    if (i >= 0) {
      tmp[i] = d;
    } else {
      tmp.push(d);
    }
    setForm(tmp);
    setQueID(undefined);
    setSelected(undefined);
  };

  const questions = isReview
    ? (data as IReviewStep).questions.filter((x) => !!x.review_flagged)
    : data.questions;

  return (
    <View>
      <View style={styles.header}>
        <FontAwesome name="home" size={30} />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 22, fontWeight: '500' }}>Location</Text>
          <Text style={{ fontSize: 18, fontWeight: '400' }}>{data.name}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <TouchButton
          style={styles.clear_button}
          label="Clear"
          scheme="danger"
          size="small"
          onPress={clearClick}
        />
        <View style={styles.questions}>
          {questions.map((x, i) => (
            <TouchableOpacity
              key={x.id}
              style={styles.question}
              onPress={() => setQueID(x.id)}>
              <Text style={[styles.question_name, { color: getColor(x.id) }]}>
                {`${i + 1}) ${x.name}`}
              </Text>
              <FontAwesome
                name={queID === x.id ? 'check-circle-o' : 'circle-o'}
                size={28}
                color={getColor(x.id)}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {selected && (
        <QuestionModal
          visible={true}
          title={selected.title}
          options={selected.options}
          data={selected.answer}
          onConfirm={confirmModal}
          onClose={() => {
            setQueID(undefined);
            setSelected(undefined);
          }}
        />
      )}
      {!!queID && (
        <CompliantModal
          compliantClick={compliantClick}
          nonCompliantClick={nonCompliantClick}
          onClose={() => setQueID(undefined)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    borderColor: '#d1d1d1',
    borderBottomWidth: 1,
    marginHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 10,
  },
  body: {
    marginTop: 20,
    paddingHorizontal: 5,
  },
  clear_button: {
    marginBottom: 20,
  },
  questions: {
    marginVertical: 10,
  },
  question: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderColor: '#d1d1d1',
    borderBottomWidth: 1,
  },
  question_name: {
    fontSize: 20,
    fontWeight: '500',
  },
  note: {
    marginVertical: 10,
  },
  images: {
    marginVertical: 20,
  },
});

export default InspectStepForm;
