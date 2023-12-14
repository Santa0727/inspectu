import { FontAwesome } from '@expo/vector-icons';
import { PropsWithChildren } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import TouchButton from './TouchButton';

type Props = PropsWithChildren<{
  visible: boolean;
  title: string;
  showFooter?: boolean;
  onClose?: (d?: any) => void;
  onConfirm?: (d?: any) => void;
  disabled?: boolean;
}>;

const Modal = ({
  visible,
  title,
  showFooter,
  onClose,
  onConfirm,
  children,
  disabled,
}: Props) => (
  <ReactNativeModal isVisible={visible} onBackdropPress={onClose}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.modal_wrap}>
        <View style={styles.modal_header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity style={styles.close_button} onPress={onClose}>
            <FontAwesome name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.modal_body}>{children}</View>
        {showFooter && (
          <View style={styles.modal_footer}>
            <View style={{ marginHorizontal: 10 }}>
              <TouchButton
                label="Close"
                scheme="danger"
                onPress={onClose}
                disabled={disabled}
              />
            </View>
            <View style={{ marginHorizontal: 10 }}>
              <TouchButton
                label="Confirm"
                scheme="success"
                onPress={onConfirm}
                disabled={disabled}
              />
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  </ReactNativeModal>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 5,
  },
  modal_wrap: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  modal_header: {
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  close_button: {
    padding: 5,
    marginBottom: 10,
  },
  modal_body: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  modal_footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'black',
  },
});

export default Modal;
