import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface Props {
  value: boolean;
  onChange?: (c: boolean) => void;
  label: string;
  style?: StyleProp<ViewStyle>;
}

const Checkbox = ({ value, onChange, label, style }: Props) => (
  <View style={style}>
    <TouchableOpacity
      style={styles.touch_view}
      onPress={() => onChange && onChange(!value)}>
      {value ? (
        <MaterialCommunityIcons
          name="checkbox-outline"
          size={28}
          color="black"
        />
      ) : (
        <MaterialIcons name="check-box-outline-blank" size={28} color="black" />
      )}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
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
    fontSize: 19,
    marginLeft: 5,
  },
});

export default Checkbox;
