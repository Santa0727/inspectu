import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IInspection } from '../../lib/entities';
import { defaultDateFormat } from '../../config/helper';
import { statusLabels } from '../../lib/lang';
import { COLORS } from '../../config/constants';

interface Props {
  items: IInspection[];
  status: 'upcoming' | 'past';
  goToInspect: (t: 'InspectEntry' | 'PostDetail', id: number) => void;
}

const InspectsTable = ({ items, status, goToInspect }: Props) => (
  <View style={styles.table}>
    <Text style={styles.title}>
      {`${status === 'past' ? 'Past' : 'Upcoming'} inspections`}
    </Text>
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
            <Text style={styles.td_txt}>{x.school.name}</Text>
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
            <Text style={styles.td_txt}>{defaultDateFormat(x.due_date)}</Text>
          </View>
          <View style={[styles.td_cell, { paddingVertical: 3 }]}>
            {x.status === 'publish' ? (
              <TouchableOpacity
                style={styles.start_btn}
                onPress={() => goToInspect('InspectEntry', x.id)}>
                <Text style={styles.start_txt}>Start</Text>
              </TouchableOpacity>
            ) : (
              <View>
                <Text
                  style={[
                    styles.td_txt,
                    {
                      fontSize: 15,
                      color:
                        x.status === 'pending_review'
                          ? COLORS.pending
                          : x.status === 'review_required'
                          ? COLORS.danger
                          : x.status === 'approved'
                          ? COLORS.success
                          : 'black',
                    },
                  ]}>
                  {statusLabels[x.status] ?? x.status}
                </Text>
                {x.status === 'review_required' && (
                  <TouchableOpacity
                    style={styles.view_btn}
                    onPress={() => goToInspect('PostDetail', x.id)}>
                    <Text style={styles.view_txt}>View</Text>
                  </TouchableOpacity>
                )}
              </View>
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
