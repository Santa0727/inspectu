import { useState } from 'react';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Modal from 'react-native-modal';

interface IOption {
  label: string | number;
  value: string | number;
}

interface Props {
  options: IOption[];
  label: string;
  value?: string | number;
  onChange: (v: string | number) => void;
}

const SingleSelect = ({ options, label, value, onChange }: Props) => {
  const [show, setShow] = useState(false);

  return (
    <View>
      <TouchableOpacity style={styles.type_touch} onPress={() => setShow(true)}>
        <Text
          style={
            options.some((x) => x.value === value)
              ? styles.label
              : styles.placeholder
          }>
          {options.find((x) => x.value === value)?.label ?? label}
        </Text>
        <Feather name="chevron-down" size={24} color="#A2A0A0" />
      </TouchableOpacity>
      {show && (
        <Modal isVisible={true} onBackdropPress={() => setShow(false)}>
          <View style={styles.modal_wrap}>
            <View style={styles.modal_header}>
              <Text style={styles.title}>{label}</Text>
              <TouchableOpacity
                style={styles.close_button}
                onPress={() => setShow(false)}>
                <FontAwesome name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.modal_body}>
              {options.map((x) => (
                <TouchableOpacity
                  key={x.value}
                  style={x.value === value ? styles.sel_touch : styles.type_row}
                  onPress={() => {
                    onChange(x.value);
                    setShow(false);
                  }}>
                  <Text
                    style={[
                      styles.row_label,
                      { color: value === x.value ? 'white' : 'black' },
                    ]}>
                    {x.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  type_touch: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 2,
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  type_row: {
    borderColor: '#C3BEB2',
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
  },
  sel_touch: {
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#E01860',
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    color: 'black',
  },
  placeholder: {
    fontSize: 18,
    fontWeight: '500',
    color: '#a8a29e',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 5,
  },
  row_label: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
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
});

export default SingleSelect;
