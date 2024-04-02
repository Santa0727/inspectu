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
  colorScheme?: 'success' | 'danger';
  markPosition?: 'left' | 'right';
}

const Checkbox = ({
  value,
  onChange,
  label,
  style,
  disabled,
  colorScheme,
  markPosition,
}: Props) => (
  <View style={style}>
    <TouchableOpacity
      style={styles.touch_view}
      onPress={() => onChange && onChange(!value)}
      disabled={disabled}>
      {markPosition === 'right' && (
        <Text
          style={[styles.left_label, colorScheme ? styles[colorScheme] : {}]}>
          {label}
        </Text>
      )}
      {value ? (
        <MaterialCommunityIcons
          name="checkbox-outline"
          size={28}
          color={colorScheme ? COLORS[colorScheme] : 'black'}
        />
      ) : (
        <MaterialIcons
          name="check-box-outline-blank"
          size={28}
          color={colorScheme ? COLORS[colorScheme] : 'black'}
        />
      )}
      {markPosition !== 'right' && (
        <Text
          style={[styles.right_label, colorScheme ? styles[colorScheme] : {}]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  touch_view: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    marginVertical: 3,
    justifyContent: 'space-between',
  },
  right_label: {
    fontSize: 19,
    marginLeft: 5,
    maxWidth: '85%',
  },
  left_label: {
    fontSize: 19,
    marginRight: 5,
    maxWidth: '85%',
  },
  success: {
    color: COLORS.success,
  },
  danger: {
    color: COLORS.danger,
  },
});

export default Checkbox;
