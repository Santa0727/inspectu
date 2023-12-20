import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';
import { IInspectStep } from '../../lib/entities';
import ImageBox from '../ui/ImageBox';
import RadioSelect from '../ui/RadioSelect';
import Checkbox from '../ui/Checkbox';

interface Props {
  form?: any;
  setForm?: (d: any) => void;
  data: IInspectStep;
}

const InspectStep = ({ form, setForm, data }: Props) => {
  const disabled = !setForm;

  const changeImage = (id: string, img: string) => {
    if (setForm) setForm({ ...form, [id]: img });
  };
  const toggleCheck = (id: string, c: boolean) => {
    if (setForm) setForm({ ...form, [id]: c });
  };
  const selectRadio = (c: string) => {
    const v = data.options.find((x) => !!form[x.id]);
    let tmp = { ...form };
    if (v) {
      tmp[v.id] = false;
    }
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
        value={data.text}
      />
      {data.type === 'multipleimage' ? (
        data.options.map((x) => (
          <View key={x.id} style={styles.card}>
            <ImageBox
              image={(form ?? {})[x.id] ?? x.answer ?? undefined}
              onChange={(m) => changeImage(x.id, m)}
              disabled={disabled}
            />
            <View style={styles.name_view}>
              <Text style={styles.time}>{x.name}</Text>
              <Text style={styles.name}>{''}</Text>
            </View>
          </View>
        ))
      ) : data.type === 'checkbox' ? (
        <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 21, fontWeight: '600', marginBottom: 5 }}>
            {'Did you check this'}
          </Text>
          {data.options.map((x) => (
            <Checkbox
              key={x.id}
              value={(form ?? {})[x.id] ?? !!x.answer}
              label={x.name}
              onChange={(c) => toggleCheck(x.id, c)}
              disabled={disabled}
            />
          ))}
        </View>
      ) : (
        <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 21, fontWeight: '600', marginBottom: 5 }}>
            {'Which one it is'}
          </Text>
          <RadioSelect
            options={data.options.map((x) => ({ id: x.id, label: x.name }))}
            value={data.options.find((x) => !!(form ?? {})[x.id])?.id}
            onChange={(c) => selectRadio(c.toString())}
            disabled={disabled}
          />
        </View>
      )}
      {data.checklist && data.checklist.length > 0 && (
        <View style={{ marginVertical: 20, paddingHorizontal: 10 }}>
          {data.checklist.map((x) => (
            <Checkbox
              key={x.id}
              value={x.checked}
              label={x.name}
              disabled={true}
            />
          ))}
        </View>
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
