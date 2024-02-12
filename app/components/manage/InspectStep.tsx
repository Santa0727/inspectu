import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';
import { IEntryStep } from '../../lib/entities';
import ImageBox from '../ui/ImageBox';
import RadioSelect from '../ui/RadioSelect';
import Checkbox from '../ui/Checkbox';

const checkedRadio = (form: any, options: any[]) => {
  for (let x of options) {
    if (form && !!form[x.id]) return x.id;
  }
  return options.find((x) => !!x.answer)?.id ?? undefined;
};

interface Props {
  form?: any;
  stepsIntro?: string | null;
  setForm?: (d: any) => void;
  data: IEntryStep;
}

const InspectStep = ({ form, setForm, stepsIntro, data }: Props) => {
  const disabled = !setForm;

  const changeImage = (img: string) => {
    if (setForm) setForm({ ...form, [data.options.id]: img });
  };
  const toggleCheck = (id: string, c: boolean) => {
    if (setForm) setForm({ ...form, [id]: c });
  };
  const selectRadio = (qID: string, c: string) => {
    let tmp = { ...form };
    const q = data.questions.find((x) => x.id === qID);

    q?.options.forEach((e) => {
      tmp[e.id] = false;
    });
    tmp[c] = true;

    if (setForm) setForm(tmp);
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
          <Text style={{ fontSize: 18, fontWeight: '400' }}>{data.name}</Text>
        </View>
      </View>
      <HTMLView
        style={{ marginVertical: 20, marginHorizontal: 10 }}
        value={stepsIntro ?? ''}
      />
      {!(data.status === undefined && form && !!form[data.options.id]) && (
        <View style={styles.card}>
          <ImageBox
            image={
              (form ?? {})[data.options.id] ?? data.options.answer ?? undefined
            }
            onChange={(m) => changeImage(m)}
            disabled={disabled}
          />
          <View style={styles.name_view}>
            <Text style={styles.time}>{data.name}</Text>
            <Text style={styles.name}>{''}</Text>
          </View>
        </View>
      )}
      {data.questions.map((question) =>
        question.type === 'checkbox' ? (
          <View
            key={question.id}
            style={{ marginVertical: 10, paddingHorizontal: 10 }}>
            <Text style={{ fontSize: 21, fontWeight: '600', marginBottom: 5 }}>
              {question.name}
            </Text>
            <HTMLView style={{ marginVertical: 5 }} value={question.text} />
            {question.options.map((x) => (
              <Checkbox
                key={x.id}
                value={(form ?? {})[x.id] ?? x.answer}
                label={x.name}
                onChange={(c) => toggleCheck(x.id, c)}
                disabled={disabled}
                colorScheme={
                  question.status === true
                    ? 'success'
                    : question.status === false
                    ? 'danger'
                    : undefined
                }
              />
            ))}
          </View>
        ) : (
          <View
            key={question.id}
            style={{ marginVertical: 10, paddingHorizontal: 10 }}>
            <Text style={{ fontSize: 21, fontWeight: '600', marginBottom: 5 }}>
              {question.name}
            </Text>
            <HTMLView style={{ marginVertical: 5 }} value={question.text} />
            <RadioSelect
              options={question.options.map((x) => ({
                id: x.id,
                label: x.name,
              }))}
              value={checkedRadio(form, question.options)}
              onChange={(c) => selectRadio(question.id, c.toString())}
              disabled={disabled}
              colorScheme={
                question.status === true
                  ? 'success'
                  : question.status === false
                  ? 'danger'
                  : undefined
              }
            />
          </View>
        ),
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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

export default InspectStep;
