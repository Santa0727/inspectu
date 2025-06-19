import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IInspection } from '../../lib/manage.entities';
import { COLORS } from '../../config/constants';
import moment from 'moment';

interface Props {
  data: IInspection;
  onClick?: (data: IInspection) => void;
}

const InspectionCard = ({ data, onClick }: Props) => (
  <TouchableOpacity
    style={styles.panel}
    onPress={() => onClick && onClick(data)}>
    <View style={styles.item_header}>
      <View
        style={[
          styles.item_dot,
          {
            backgroundColor:
              data.status === 'approved'
                ? COLORS.approved
                : data.status === 'pending_review'
                ? COLORS.pending
                : data.status === 'review_required'
                ? COLORS.danger
                : COLORS.inactive,
          },
        ]}
      />
      <Text style={styles.item_time}>{moment(data.due_date).calendar()}</Text>
    </View>
    <Text style={styles.item_title}>{data.name}</Text>
    <Text style={styles.item_subtitle}>{data.school.name}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  panel: {
    borderColor: COLORS.blueGrey,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    marginVertical: 8,
    padding: 10,
  },
  item_header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  item_dot: {
    width: 15,
    height: 15,
    borderRadius: 7,
  },
  item_time: {
    marginHorizontal: 6,
    color: COLORS.greyBlue,
    fontSize: 12,
    fontWeight: '400',
  },
  item_title: {
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: '600',
    margin: 3,
  },
  item_subtitle: {
    fontSize: 14,
    color: COLORS.greyBlue,
    marginHorizontal: 3,
  },
});

export default InspectionCard;
