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

const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
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
  value: number;
  label: string | number;
  date_str: string;
  isActive: boolean;
}

interface IMarker {
  date: string;
  color: string;
}

interface Props {
  markers?: IMarker[];
  style?: StyleProp<ViewStyle>;
}

const ViewCalendar = ({ markers, style }: Props) => {
  const [year, setYear] = useState(moment().toDate().getFullYear());
  const [month, setMonth] = useState(moment().toDate().getMonth());

  const grid = useMemo(() => {
    const day = `${year}-${zeroPad(month + 1)}-01`;
    const fW = new Date(day).getDay();
    const lD = new Date(year, month + 1, 0).getDate();
    let result: ICell[][] = [],
      rows: ICell[] = [];

    for (let i = 0; i < fW; i++) {
      const mt = moment(new Date(year, month, i - fW + 1));
      rows.push({
        value: mt.toDate().getTime(),
        label: mt.format('D'),
        date_str: mt.format('YYYY-MM-DD'),
        isActive: false,
      });
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
        isActive: true,
      });
      if (rows.length >= 7) {
        result.push(rows);
        rows = [];
      }
    }
    if (rows.length > 0) {
      for (let i = 0; rows.length < 7; i++) {
        const mt = moment(`${year}-${zeroPad(month + 1)}-${zeroPad(i + 1)}`);
        rows.push({
          value: mt.toDate().getTime(),
          label: mt.format('D'),
          date_str: mt.format('YYYY-MM-DD'),
          isActive: false,
        });
      }
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
        <TouchableOpacity
          style={styles.year_move_touch}
          onPress={() => monthMove(-1)}>
          <FontAwesome name="chevron-left" size={20} color={COLORS.dark} />
        </TouchableOpacity>
        <View>
          <Text style={styles.year_txt}>{monthNames[month]}</Text>
          <Text style={styles.month_txt}>{year}</Text>
        </View>
        <TouchableOpacity
          style={styles.year_move_touch}
          onPress={() => monthMove(1)}>
          <FontAwesome name="chevron-right" size={20} color={COLORS.dark} />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 10 }}>
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
                <View
                  style={[
                    styles.touch,
                    cell.date_str &&
                    markers &&
                    markers.some((x) => x.date === cell.date_str)
                      ? {
                          backgroundColor: markers.find(
                            (x) => x.date === cell.date_str,
                          )?.color,
                        }
                      : {},
                  ]}>
                  <Text
                    style={[
                      styles.day_txt,
                      { color: cell.isActive ? undefined : COLORS.greyBlue },
                    ]}>
                    {cell.label}
                  </Text>
                </View>
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
    borderRadius: 5,
    paddingVertical: 10,
  },
  week_txt: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.greyBlue,
  },
  touch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    width: 36,
    alignSelf: 'center',
    borderRadius: 5,
  },
  year_txt: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
  },
  month_txt: {
    textAlign: 'center',
    color: '2025',
    fontSize: 14,
    fontWeight: '400',
  },
  year_move_touch: {
    borderWidth: 1,
    borderColor: COLORS.blueGrey,
    borderRadius: 4,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  control_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  day_txt: {
    textAlign: 'center',
    fontSize: 15,
    color: COLORS.dark,
    fontWeight: '500',
  },
});

export default ViewCalendar;
