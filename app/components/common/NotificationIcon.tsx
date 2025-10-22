import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../config/constants';
import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  loadNotes,
  readNotes,
  selectHasNew,
  selectNotes,
} from '../../store/ui/uiSlice';
import { INote } from '../../lib/ui.entities';
import { useNavigation } from '@react-navigation/native';

interface ModalProps {
  onClose: () => void;
}

const NotesModal = ({ onClose }: ModalProps) => {
  const navigator = useNavigation<any>();
  const notes = useAppSelector(selectNotes);

  const clickNote = (note: INote) => {
    if (note.data.link.includes('/messages')) {
      navigator.navigate('Message');
    }
  };

  return (
    <Modal visible={true} title="Notifications" onClose={onClose}>
      {notes.map((note) => (
        <TouchableOpacity key={note.id} onPress={() => clickNote(note)}>
          <View style={styles.note_view}>
            <Text style={styles.note_txt}>{note.data.message}</Text>
            <Text style={styles.note_time}>
              {moment.utc(note.created_at).format('MM-DD-YYYY HH:mm')}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </Modal>
  );
};

let LoadingNotesTimer: NodeJS.Timeout | null = null;

const NotificationIcon = () => {
  const dispatch = useAppDispatch();
  const hasNew = useAppSelector(selectHasNew);

  const [visible, setVisible] = useState(false);

  const clickIcon = () => {
    dispatch(readNotes());
    setVisible(true);
  };

  useEffect(() => {
    if (LoadingNotesTimer === null) {
      dispatch(loadNotes());

      LoadingNotesTimer = setInterval(() => dispatch(loadNotes()), 10000);
    }

    return () => {
      if (LoadingNotesTimer) {
        clearInterval(LoadingNotesTimer);
        LoadingNotesTimer = null;
      }
    };
  }, []);

  return (
    <TouchableOpacity style={styles.header_notify} onPress={clickIcon}>
      {hasNew && <View style={styles.notify_dot} />}
      <Ionicons name="notifications" size={28} color={COLORS.greyBlue} />
      {visible && <NotesModal onClose={() => setVisible(false)} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header_notify: {
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notify_dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#FF0000',
    position: 'absolute',
    top: 12,
    right: 8,
  },
  note_view: {
    marginBottom: 5,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  note_txt: {
    fontSize: 18,
  },
  note_time: {
    fontSize: 14,
    marginTop: 5,
    paddingHorizontal: 5,
  },
});

export default NotificationIcon;
