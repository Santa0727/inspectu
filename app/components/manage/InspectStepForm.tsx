import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  IEntryStep,
  IInspectAnswer,
  IReviewStep,
  TQuestionType,
} from '../../lib/manage.entities';
import Modal from '../ui/Modal';
import Checkbox from '../ui/Checkbox';
import CommentBox from '../ui/CommentBox';
import { useState } from 'react';
import ImageBox from '../ui/ImageBox';
import TouchButton from '../ui/TouchButton';
import { COLORS } from '../../config/constants';
import RadioSelect from '../ui/RadioSelect';
import Input from '../ui/Input';

interface IOption {
  id: string;
  name: string;
}

interface QuestionProps {
  type: TQuestionType;
  visible: boolean;
  title: string;
  data: IInspectAnswer;
  options: IOption[];
  corrective?: any;
  onConfirm: (d: IInspectAnswer) => void;
  onClose: () => void;
}

const QuestionModal = ({
  type,
  visible,
  title,
  options,
  data,
  corrective,
  onConfirm,
  onClose,
}: QuestionProps) => {
  const [images, setImages] = useState(data.images ?? []);
  const [checked, setChecked] = useState(data.options ?? []);
  const [notes, setNotes] = useState(data.notes ?? '');
  const [values, setValues] = useState(data.options ?? []);
  const [correctiveComment, setCorrectiveComment] = useState(
    data.corrective_comment ?? '',
  );

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
  const updateValue = (id: string, v: string | boolean) => {
    let tmp = [...values];
    const i = tmp.findIndex((x) => x.id === id);
    if (i >= 0) {
      tmp[i].value = v;
    } else {
      tmp.push({ id, value: v });
    }
    setValues(tmp);
  };
  const radioSelectValue = (v: string | number) => {
    let tmp = values.map((x) => ({
      id: x.id,
      value: v === x.id,
    }));
    if (tmp.every((x) => x.id !== v)) {
      tmp.push({ id: v.toString(), value: true });
    }
    setValues(tmp);
  };
  const shouldShowCorrectiveComment = () => {
    if (!corrective || !corrective.requires_comment_when) return false;

    if (type === 'radio' && corrective.requires_comment_when.equals) {
      return values.some(
        (v) =>
          v.id === corrective.requires_comment_when.equals && v.value === true,
      );
    }

    if (
      (type === 'compliance' || type === 'checkbox') &&
      corrective.requires_comment_when.any_of
    ) {
      const selectedOptions = type === 'compliance' ? checked : values;
      return corrective.requires_comment_when.any_of.some((optionId: string) =>
        selectedOptions.some(
          (option) => option.id === optionId && option.value === true,
        ),
      );
    }

    return false;
  };

  const confirmClick = () => {
    const baseData = {
      ...data,
      corrective_comment: shouldShowCorrectiveComment()
        ? correctiveComment
        : undefined,
    };

    if (type === 'compliance') {
      onConfirm({
        ...baseData,
        options: checked,
        images,
        notes: notes ? notes : undefined,
      });
    } else {
      onConfirm({
        ...baseData,
        options: values,
      });
    }
  };

  return (
    <Modal
      visible={visible}
      title={title}
      showFooter={true}
      onClose={onClose}
      onConfirm={confirmClick}
      size="small">
      {type === 'compliance' ? (
        <>
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
        </>
      ) : type === 'checkbox' ? (
        <>
          {options.map((x) => (
            <Checkbox
              key={x.id}
              label={x.name}
              value={values.some((y) => y.value && y.id === x.id)}
              onChange={(v) => updateValue(x.id, v)}
              markPosition="right"
            />
          ))}
        </>
      ) : type === 'image' ? (
        <>
          {options.map((x) => (
            <ImageBox
              key={x.id}
              label={x.name}
              style={{ marginVertical: 5 }}
              image={
                values.find((y) => y.id === x.id)?.value as string | undefined
              }
              onChange={(v) => updateValue(x.id, v)}
            />
          ))}
        </>
      ) : type === 'multitext' || type === 'text' ? (
        <>
          {options.map((x) => (
            <Input
              key={x.id}
              label={x.name}
              value={
                (values.find((y) => y.id === x.id)?.value as
                  | string
                  | undefined) ?? ''
              }
              onChange={(v) => updateValue(x.id, v)}
            />
          ))}
        </>
      ) : type === 'radio' ? (
        <RadioSelect
          value={values.find((x) => x.value === true)?.id}
          options={options.map((x) => ({ id: x.id, label: x.name }))}
          onChange={(v) => radioSelectValue(v)}
        />
      ) : (
        <></>
      )}
      {shouldShowCorrectiveComment() && (
        <CommentBox
          label="Corrective Comment"
          style={styles.note}
          value={correctiveComment}
          onChange={setCorrectiveComment}
        />
      )}
    </Modal>
  );
};

interface ISelectedData {
  type: TQuestionType;
  options: IOption[];
  answer: IInspectAnswer;
  title: string;
  corrective?: any;
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
    showHeader={false}
    showFooter={false}
    onClose={onClose}
    size="small">
    <View style={{ alignItems: 'flex-end' }}>
      <TouchableOpacity style={styles.close_icon} onPress={onClose}>
        <FontAwesome name="close" size={24} color="black" />
      </TouchableOpacity>
    </View>
    <Text style={styles.name}>{'Select compliant status'}</Text>
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
    } else if (com?.options.some((x) => !!x.value)) {
      return COLORS.primary;
    } else {
      return undefined;
    }
  };
  const selectQuestion = (q: any) => {
    if (q.type === 'compliance') {
      setQueID(q.id);
    } else {
      let tmp = [...form];
      const i = tmp.findIndex((x) => x.question_id === q.id);
      if (i < 0) {
        tmp.push({
          question_id: q.id,
          options: [],
        });
        setForm(tmp);
      }
      const answer = i >= 0 ? tmp[i] : tmp[tmp.length - 1];
      setSelected({
        type: q.type,
        options: q.options ?? [],
        answer,
        title: q.name ?? '',
        corrective: q.corrective,
      });
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

    setSelected({
      type: 'compliance',
      options,
      answer,
      title: question?.name ?? '',
      corrective: question?.corrective,
    });
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
    <View style={styles.panel}>
      <View style={styles.header}>
        <Text style={{ fontSize: 19, fontWeight: '600' }}>Location</Text>
        <Text style={{ fontSize: 17, fontWeight: '500' }}>{data.name}</Text>
      </View>
      <View style={styles.body}>
        <TouchableOpacity style={styles.clear_btn} onPress={clearClick}>
          <AntDesign name="close" size={20} color="white" />
          <Text style={styles.clear_txt}>{'Clear'}</Text>
        </TouchableOpacity>
        <View style={styles.questions}>
          {questions.map((x, i) => (
            <TouchableOpacity
              key={x.id}
              style={styles.question}
              onPress={() => selectQuestion(x)}>
              <Text style={styles.question_name}>{`${i + 1}. ${x.name}`}</Text>
              <View
                style={[styles.check_box, { backgroundColor: getColor(x.id) }]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {selected && (
        <QuestionModal
          type={selected.type}
          visible={true}
          title={selected.title}
          options={selected.options}
          data={selected.answer}
          corrective={selected.corrective}
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
  panel: {
    backgroundColor: 'white',
    borderColor: COLORS.blueGrey,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  header: {
    marginHorizontal: 10,
    paddingBottom: 10,
  },
  body: {
    marginTop: 20,
    paddingHorizontal: 5,
  },
  clear_btn: {
    marginBottom: 20,
    alignSelf: 'flex-end',
    width: 100,
    backgroundColor: COLORS.dark,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  clear_txt: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
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
    flex: 1,
  },
  note: {
    marginVertical: 10,
  },
  images: {
    marginVertical: 20,
  },
  close_icon: {
    borderWidth: 2,
    borderColor: COLORS.blueGrey,
    borderRadius: 4,
    width: 43,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginVertical: 10,
    fontSize: 18,
    fontWeight: '600',
  },
  check_box: {
    width: 30,
    height: 30,
    borderColor: COLORS.greyBlue,
    borderWidth: 2,
    borderRadius: 4,
    backgroundColor: 'white',
  },
});

export default InspectStepForm;
