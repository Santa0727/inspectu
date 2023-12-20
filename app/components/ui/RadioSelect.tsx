import { Ionicons } from '@expo/vector-icons';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface Props {
  value?: string | number;
  options: Array<{ id: string | number; label: string }>;
  onChange?: (v: string | number) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const RadioSelect = ({ value, options, onChange, style, disabled }: Props) => (
  <View style={style}>
    {options.map((x) => (
      <TouchableOpacity
        key={x.id}
        style={styles.touch_view}
        onPress={() => onChange && onChange(x.id)}>
        <Ionicons
          name={`radio-button-${value === x.id ? 'on' : 'off'}`}
          size={24}
          color="black"
        />
        <Text style={styles.label}>{x.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  touch_view: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    marginVertical: 3,
  },
  label: {
    marginLeft: 5,
    fontSize: 19,
  },
});

export default RadioSelect;
