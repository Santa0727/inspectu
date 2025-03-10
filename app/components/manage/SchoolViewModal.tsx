import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ISchool } from '../../lib/entities';
import Modal from '../ui/Modal';
import { FontAwesome, Fontisto } from '@expo/vector-icons';
import { COLORS } from '../../config/constants';

interface Props {
  visible: boolean;
  school: ISchool;
  onClose: () => void;
}

const SchoolViewModal = ({ visible, school, onClose }: Props) => {
  const openSchool = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert('Unable to open');
      }
    } catch (error: any) {
      alert('An error occurred ' + error?.message);
    }
  };

  return (
    <Modal
      visible={visible}
      title="School info"
      showHeader={false}
      showFooter={false}
      onClose={onClose}>
      <View>
        <View style={{ alignItems: 'flex-end' }}>
          <TouchableOpacity style={styles.close_icon} onPress={onClose}>
            <FontAwesome name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{school.name}</Text>
        <TouchableOpacity
          style={styles.link_row}
          onPress={() => openSchool(`mailto:${school.email}`)}>
          <View style={{ width: 35 }}>
            <Fontisto name="email" size={24} color={COLORS.greyBlue} />
          </View>
          <Text style={styles.link_txt}>{school.email}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link_row}
          onPress={() => openSchool(`tel:${school.phone}`)}>
          <View style={{ width: 35 }}>
            <FontAwesome name="phone" size={24} color={COLORS.greyBlue} />
          </View>
          <Text style={styles.link_txt}>{school.phone}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link_row}
          onPress={() =>
            openSchool(`http://maps.google.com/?q=${school.location}`)
          }>
          <View style={{ width: 35 }} />
          <Text style={styles.link_txt}>{school.address}</Text>
        </TouchableOpacity>
        {school.visit && (
          <Text style={styles.info}>
            {`Visited by ${school.visit.name} on ${school.visit.date}`}
          </Text>
        )}
        <View style={{ height: 20 }} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  name: {
    marginVertical: 10,
    fontSize: 18,
    fontWeight: '600',
  },
  link_row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  link_txt: {
    fontSize: 18,
    fontWeight: '400',
  },
  info: {
    marginVertical: 15,
    fontSize: 17,
    fontWeight: '400',
    color: COLORS.dark,
    backgroundColor: '#FFE3E3',
    borderRadius: 8,
    paddingHorizontal: 22,
    paddingVertical: 16,
    lineHeight: 24,
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

export default SchoolViewModal;
