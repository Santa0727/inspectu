import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Modal from 'react-native-modal';

interface IOption {
  label: string | number;
  value: string | number;
}

interface Props {
  options: IOption[];
  label: string;
  value?: string[] | number[];
  onChange: (v: Array<string | number>) => void;
}

const MultiSelect = ({ label, options, value, onChange }: Props) => {
  const selected = options.filter((x) => value?.some((y) => y === x.value));

  const [show, setShow] = useState(false);

  const toggleClick = (v: string | number) => {
    const tmp = !value
      ? [v]
      : value.some((x) => x === v)
      ? value.filter((x) => x !== v)
      : [...value, v];
    onChange(tmp);
  };

  return (
    <View>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.select_btn} onPress={() => setShow(true)}>
        {selected.map((x) => (
          <Text key={x.value} style={styles.select_txt}>
            {x.label}
          </Text>
        ))}
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
              {options.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.item_btn}
                  onPress={() => toggleClick(item.value)}>
                  <FontAwesome
                    name={
                      value?.some((x) => x === item.value)
                        ? 'check-square-o'
                        : 'square-o'
                    }
                    size={24}
                    color="white"
                  />
                  <Text style={styles.item_txt}>{item.label}</Text>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 5,
  },
  label: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: '600',
  },
  select_btn: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E5E7E9',
    backgroundColor: '#FAFBFC',
    minHeight: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  select_txt: {
    margin: 3,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f0f0f0',
    fontSize: 17,
  },
  item_btn: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 12,
    alignItems: 'center',
    backgroundColor: '#34d399',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  item_txt: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
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

export default MultiSelect;
