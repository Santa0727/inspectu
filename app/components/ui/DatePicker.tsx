import { useState } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { COLORS } from '../../config/constants';
import { defaultDateFormat } from '../../lib/helper';

interface Props {
  label?: string;
  value?: string;
  onChange: (val: string) => void;
  style?: any;
}

const CustomDatePickerAndroid = ({ label, value, onChange, style }: Props) => {
  const [visible, setVisible] = useState(false);

  const handleChange = (event: any, date: Date | undefined) => {
    setVisible(false);

    if (!date) return;
    onChange(moment(date).format('YYYY-MM-DD'));
  };

  return (
    <View style={{ paddingVertical: 10 }}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.date_btn}
        onPress={() => setVisible(true)}>
        <Text style={[styles.date_txt, value ? undefined : styles.placeholder]}>
          {value ? defaultDateFormat(value) : 'Click to enter date'}
        </Text>
      </TouchableOpacity>
      {visible && (
        <DateTimePicker
          value={moment(value).toDate()}
          mode="date"
          onChange={handleChange}
          style={style ?? styles.dateStyle}
        />
      )}
    </View>
  );
};

const CustomDatePickerIOS = ({ label, value, onChange, style }: Props) => {
  const handleChange = (event: any, date: Date | undefined) => {
    if (!date) return;
    onChange(moment(date).format('YYYY-MM-DD'));
  };

  return (
    <View style={{ padding: 10 }}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <DateTimePicker
        value={moment(value).toDate()}
        mode="date"
        onChange={handleChange}
        style={style ?? styles.dateStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dateStyle: {
    width: 140,
    alignSelf: 'flex-start',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
  },
  date_btn: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.blueGrey,
    borderRadius: 5,
  },
  date_txt: {
    textAlign: 'center',
    fontSize: 18,
  },
  placeholder: {
    color: COLORS.disabled,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 5,
  },
});

export default Platform.OS === 'android'
  ? CustomDatePickerAndroid
  : CustomDatePickerIOS;
