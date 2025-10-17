import { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ReactSignature from 'react-native-signature-canvas';

interface Props {
  value?: string | null;
  onChange?: (v: string) => void;
  error?: boolean;
}

const SignaturePanel = ({ value, onChange, error }: Props) => {
  const [visible, setVisible] = useState(false);

  const handleSignDone = async (img: string) => {
    if (onChange) {
      onChange(img);
    }
    setVisible(false);
  };

  return (
    <View>
      <View style={[styles.input_big, error && styles.error_border]}>
        <Text style={styles.input_small}>{'Signature'}</Text>
        <TouchableWithoutFeedback onPress={() => setVisible(true)}>
          <Text style={[styles.click_txt, error && styles.error_text_input]}>
            {'Click here to sign'}
          </Text>
        </TouchableWithoutFeedback>
        {!!value && (
          <View style={{ alignItems: 'center' }}>
            <Image
              resizeMode="contain"
              style={{
                maxWidth: '100%',
                width: 600,
                aspectRatio: 1.7,
                backgroundColor: '#fef3c7',
              }}
              source={{ uri: value }}
              alt="Your Signature Image"
            />
          </View>
        )}
      </View>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => setVisible(!visible)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  maxWidth: '100%',
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height / 2.2,
                  backgroundColor: 'red',
                }}>
                <ReactSignature
                  onOK={handleSignDone}
                  descriptionText="Sign Above"
                  clearText={'Clear'}
                  confirmText={'Save'}
                  webStyle={`.m-signature-pad {margin:0px;}.m-signature-pad--footer .button {background-color: red;color: #FFF;}`}
                  autoClear={true}
                  imageType={'image/png'}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input_big: {
    marginVertical: 20,
  },
  input_small: {
    fontSize: 22,
  },
  click_txt: {
    borderColor: '#F5F7F9',
    borderWidth: 1,
    backgroundColor: '#FAFBFC',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    marginVertical: 20,
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'lightgrey',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  error_border: {
    borderWidth: 2,
    borderColor: '#f44336',
    borderRadius: 8,
    padding: 8,
  },
  error_text_input: {
    borderColor: '#f44336',
    borderWidth: 2,
  },
});

export default SignaturePanel;
