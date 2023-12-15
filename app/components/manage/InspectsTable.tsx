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
  goToInspect?: () => void;
}

const InspectsTable = ({ items, status, goToInspect }: Props) => (
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
          <View style={styles.td_cell}>
            <Text style={styles.td_txt}>{x.location}</Text>
          </View>
          <View
            style={[
              styles.td_cell,
              {
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: '#A9A9A9',
              },
            ]}>
            <Text style={styles.td_txt}>{x.date}</Text>
          </View>
          <View style={[styles.td_cell, { paddingVertical: 3 }]}>
            {x.status ? (
              <View>
                <Text style={[styles.td_txt, { fontSize: 15 }]}>
                  {x.status}
                </Text>
                <TouchableOpacity style={styles.view_btn}>
                  <Text style={styles.view_txt}>View</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.start_btn} onPress={goToInspect}>
                <Text style={styles.start_txt}>Start</Text>
              </TouchableOpacity>
            )}
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
    alignItems: 'stretch',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderTopWidth: 0,
  },
  th_cell: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  th_txt: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
  },
  td_cell: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  td_txt: {
    fontSize: 17,
    textAlign: 'center',
  },
  start_btn: {
    borderRadius: 50,
    backgroundColor: '#414BB2',
    paddingVertical: 6,
  },
  start_txt: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: 21,
  },
  view_btn: {
    borderRadius: 50,
    backgroundColor: '#414BB2',
    paddingVertical: 5,
    marginTop: 3,
  },
  view_txt: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: 17,
  },
});

export default InspectsTable;
