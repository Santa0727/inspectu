import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../../config/constants';

interface Props {
  value: boolean;
  onChange?: (c: boolean) => void;
  label: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  colorScheme?: 'green' | 'red';
}

const Checkbox = ({
  value,
  onChange,
  label,
  style,
  disabled,
  colorScheme,
}: Props) => (
  <View style={style}>
    <TouchableOpacity
      style={styles.touch_view}
      onPress={() => onChange && onChange(!value)}
      disabled={disabled}>
      {value ? (
        <MaterialCommunityIcons
          name="checkbox-outline"
          size={28}
          color={
            colorScheme === 'green'
              ? COLORS.success
              : colorScheme === 'red'
              ? COLORS.danger
              : 'black'
          }
        />
      ) : (
        <MaterialIcons
          name="check-box-outline-blank"
          size={28}
          color={
            colorScheme === 'green'
              ? COLORS.success
              : colorScheme === 'red'
              ? COLORS.danger
              : 'black'
          }
        />
      )}
      <Text
        style={[
          styles.label,
          colorScheme === 'green'
            ? styles.green
            : colorScheme === 'red'
            ? styles.danger
            : {},
        ]}>
        {label}
      </Text>
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
  green: {
    color: COLORS.success,
  },
  danger: {
    color: COLORS.danger,
  },
});

export default Checkbox;
