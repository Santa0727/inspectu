import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IInspection } from '../../lib/manage.entities';
import Modal from '../ui/Modal';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../config/constants';
import { statusLabel } from '../../lib/lang';
import { defaultFormat } from 'moment';
import { defaultDateFormat } from '../../lib/helper';

interface Props {
  data: IInspection;
  visible: boolean;
  onClose: () => void;
}

const InspectionModal = ({ data, visible, onClose }: Props) => (
  <Modal
    visible={visible}
    title={''}
    showHeader={false}
    showFooter={false}
    onClose={onClose}>
    <View>
      <View style={{ alignItems: 'flex-end' }}>
        <TouchableOpacity style={styles.close_icon} onPress={onClose}>
          <FontAwesome name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.tr}>
        <Text style={[styles.th, { fontSize: 20 }]}>{data.name}</Text>
      </View>
      <View style={styles.tr}>
        <Text style={styles.th}>{'Status'}</Text>
        <Text style={styles.td}>{statusLabel(data.status)}</Text>
      </View>
      <View style={styles.tr}>
        <Text style={styles.th}>{'Due to'}</Text>
        <Text style={styles.td}>{defaultDateFormat(data.due_date)}</Text>
      </View>
      <View style={styles.tr}>
        <Text style={styles.th}>{'School'}</Text>
        <Text style={styles.td}>{data.school.name}</Text>
      </View>
      {data.school.visit && (
        <>
          <View style={styles.tr}>
            <Text style={styles.th}>{'Visited by'}</Text>
            <Text style={styles.td}>{data.school.visit.name}</Text>
          </View>
          <View style={styles.tr}>
            <Text style={styles.th}>{'Visited at'}</Text>
            <Text style={styles.td}>{data.school.visit.date}</Text>
          </View>
        </>
      )}
      <View style={{ height: 20 }} />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  tr: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderBottomWidth: 1,
    borderColor: COLORS.blueGrey,
    paddingVertical: 3,
  },
  th: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  td: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  close_icon: {
    borderWidth: 2,
    borderColor: COLORS.blueGrey,
    borderRadius: 4,
    width: 43,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default InspectionModal;
