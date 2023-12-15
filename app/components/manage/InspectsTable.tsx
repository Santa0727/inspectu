import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IItem {
  id: number;
  location: string;
  date: string;
  status?: string;
}

interface Props {
  items: IItem[];
  status: 'upcoming' | 'past';
}

const InspectsTable = ({ items, status }: Props) => (
  <View style={styles.table}>
    <Text style={styles.title}>{`${status} inspections`}</Text>
    <View style={styles.tbody}>
      <View style={[styles.tr, { borderTopWidth: 1 }]}>
        <TouchableOpacity style={styles.th_cell}>
          <Text style={styles.th_txt}>Location</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.th_cell,
            { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#A9A9A9' },
          ]}>
          <Text style={styles.th_txt}>Date</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.th_cell}>
          <Text style={styles.th_txt}>Action</Text>
        </TouchableOpacity>
      </View>
      {items.map((x) => (
        <View key={x.id} style={styles.tr}>
          <View
            style={[
              styles.td_cell,
              { borderRightWidth: 1, borderColor: '#A9A9A9' },
            ]}>
            <Text style={styles.td_txt}>{x.location}</Text>
          </View>
          <View style={styles.td_cell}>
            <Text style={styles.td_txt}>{x.date}</Text>
          </View>
          <View
            style={[
              styles.td_cell,
              { borderLeftWidth: 1, borderColor: '#A9A9A9' },
            ]}>
            <Text style={styles.td_txt}>{x.status}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  table: {
    paddingVertical: 15,
  },
  title: {
    fontSize: 22,
    marginVertical: 5,
    marginHorizontal: 10,
    fontWeight: '500',
  },
  tbody: {
    paddingHorizontal: 5,
  },
  tr: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderTopWidth: 0,
  },
  th_cell: {
    flex: 1,
    padding: 10,
  },
  th_txt: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
  },
  td_cell: {
    flex: 1,
    padding: 10,
  },
  td_txt: {
    fontSize: 17,
    textAlign: 'center',
  },
});

export default InspectsTable;
