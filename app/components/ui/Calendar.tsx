import moment from 'moment';
import { useMemo, useState } from 'react';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { zeroPad } from '../../lib/helper';
import { StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../config/constants';

const weeks = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

interface ICell {
  value?: number;
  label?: string | number;
  date_str?: string;
}

interface Props {
  markers?: string[];
  style?: StyleProp<ViewStyle>;
  onSelectDate?: (date: string) => void;
}

const Calendar = ({ markers, style, onSelectDate }: Props) => {
  const [year, setYear] = useState(moment().toDate().getFullYear());
  const [month, setMonth] = useState(moment().toDate().getMonth());
  const valStr = moment().format('YYYY-MM-DD');

  const grid = useMemo(() => {
    const day = `${year}-${zeroPad(month + 1)}-01`;
    const fW = new Date(day).getDay();
    const lD = new Date(year, month + 1, 0).getDate();
    let result: ICell[][] = [],
      rows: ICell[] = [];

    for (let i = 0; i < fW; i++) {
      rows.push({});
    }
    for (let i = 1; i <= lD; i++) {
      rows.push({
        value: moment(`${year}-${zeroPad(month + 1)}-${zeroPad(i)}`)
          .toDate()
          .getTime(),
        label: i,
        date_str: moment(`${year}-${zeroPad(month + 1)}-${zeroPad(i)}`).format(
          'YYYY-MM-DD',
        ),
      });
      if (rows.length >= 7) {
        result.push(rows);
        rows = [];
      }
    }
    if (rows.length > 0) {
      for (let i = 0; rows.length < 7; i++) rows.push({});
      result.push(rows);
    }
    return result;
  }, [year, month]);

  const monthMove = (k: -1 | 1) => {
    let m = month + k;
    if (m < 0) {
      m += 12;
      setYear(year - 1);
    } else if (m > 11) {
      m -= 12;
      setYear(year + 1);
    }
    setMonth(m);
  };

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.control_row}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.year_move_touch}
            onPress={() => monthMove(-1)}>
            <FontAwesome name="chevron-left" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.year_move_touch}
            onPress={() => monthMove(1)}>
            <FontAwesome name="chevron-right" size={22} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.year_txt}>{monthNames[month]}</Text>
        <Text style={styles.year_txt}>{year}</Text>
      </View>
      <View style={{ flexDirection: 'row', padding: 5 }}>
        {weeks.map((x) => (
          <Text key={x} style={styles.week_txt}>
            {x}
          </Text>
        ))}
      </View>
      {grid.map((rows, i) => (
        <View key={i} style={{ flexDirection: 'row' }}>
          {rows.map((cell, j) => (
            <View key={j} style={{ flex: 1 }}>
              {!!cell.label && (
                <TouchableOpacity
                  style={[
                    cell.date_str === valStr ? styles.sel_touch : styles.touch,
                    cell.date_str && markers && markers.includes(cell.date_str)
                      ? styles.marked
                      : {},
                  ]}
                  onPress={() =>
                    cell.date_str && onSelectDate && onSelectDate(cell.date_str)
                  }>
                  <Text
                    style={{
                      color: cell.date_str === valStr ? 'white' : 'black',
                      textAlign: 'center',
                    }}>
                    {cell.label}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 5,
    paddingVertical: 16,
  },
  week_txt: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  sel_touch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#da2127',
    minHeight: 36,
    borderColor: '#f8f8f8',
    borderWidth: 1,
  },
  touch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e1e1e1',
    borderColor: '#f8f8f8',
    borderWidth: 1,
    minHeight: 36,
  },
  btn_touch: {
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  year_txt: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#a8a29e',
    minWidth: 80,
    textAlign: 'center',
    fontSize: 18,
    padding: 3,
    color: '#27272a',
  },
  year_move_touch: {
    paddingHorizontal: 12,
  },
  control_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  marked: {
    backgroundColor: COLORS.yellow,
  },
});

export default Calendar;
