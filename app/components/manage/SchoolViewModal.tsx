import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ISchool } from '../../lib/entities';
import Modal from '../ui/Modal';

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
      showFooter={false}
      onClose={onClose}>
      <View>
        <Text style={styles.name}>{school.name}</Text>
        <TouchableOpacity onPress={() => openSchool(`mailto:${school.email}`)}>
          <Text style={styles.link}>{school.email}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openSchool(`tel:${school.phone}`)}>
          <Text style={styles.link}>{school.phone}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            openSchool(`http://maps.google.com/?q=${school.location}`)
          }>
          <Text style={styles.link}>{school.address}</Text>
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
    marginVertical: 20,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  link: {
    marginVertical: 15,
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  info: {
    marginVertical: 15,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default SchoolViewModal;
