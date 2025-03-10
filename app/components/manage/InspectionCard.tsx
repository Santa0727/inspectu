import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IInspection } from '../../lib/entities';
import { COLORS } from '../../config/constants';
import moment from 'moment';

interface Props {
  inspection: IInspection;
  onClick?: (data: IInspection) => void;
}

const InspectionCard = ({ inspection, onClick }: Props) => (
  <TouchableOpacity
    style={styles.panel}
    onPress={() => onClick && onClick(inspection)}>
    <View style={styles.item_header}>
      <View
        style={[
          styles.item_dot,
          {
            backgroundColor:
              inspection.status === 'approved'
                ? COLORS.approved
                : inspection.status === 'pending_review'
                ? COLORS.pending
                : inspection.status === 'review_required'
                ? COLORS.danger
                : COLORS.inactive,
          },
        ]}
      />
      <Text style={styles.item_time}>
        {moment(inspection.due_date).calendar()}
      </Text>
    </View>
    <Text style={styles.item_title}>{inspection.name}</Text>
    <Text style={styles.item_subtitle}>{inspection.school.name}</Text>
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
