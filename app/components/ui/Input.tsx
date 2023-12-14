import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  label?: string;
  placeholder?: string;
  style?: Object;
  type?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  security?: boolean;
  value: string;
  onChange?: (t: string) => void;
  error?: string;
  disabled?: boolean;
  icon?: 'email' | 'eye-on' | 'eye-off';
  onIconTouch?: () => void;
}

const Input = ({
  label,
  style,
  placeholder,
  type,
  autoCapitalize,
  security,
  value,
  onChange,
  error,
  icon,
  onIconTouch,
  disabled,
}: Props) => (
  <View style={[styles.view, style]}>
    {!!label && <Text style={styles.label}>{label}</Text>}
    <View style={styles.input_row}>
      {icon === 'email' ? (
        <TouchableOpacity onPress={onIconTouch}>
          <MaterialIcons
            name="email"
            size={28}
            color="black"
            style={styles.icon}
          />
        </TouchableOpacity>
      ) : icon === 'eye-on' ? (
        <TouchableOpacity onPress={onIconTouch}>
          <Ionicons name="eye" size={30} color="black" style={styles.icon} />
        </TouchableOpacity>
      ) : icon === 'eye-off' ? (
        <TouchableOpacity onPress={onIconTouch}>
          <Ionicons
            name="eye-off"
            size={30}
            color="black"
            style={styles.icon}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}
      <TextInput
        keyboardType={type}
        style={[styles.text_input, disabled ? styles.disabled_input : {}]}
        placeholder={placeholder}
        autoCapitalize={autoCapitalize}
        secureTextEntry={security}
        value={value}
        onChangeText={onChange}
        editable={!disabled}
      />
    </View>
    {!!error && <Text style={styles.error}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  view: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 5,
  },
  input_row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1.5,
    borderColor: '#a8a29e',
    borderRadius: 5,
  },
  icon: {
    marginLeft: 10,
    marginRight: 3,
    marginVertical: 5,
  },
  text_input: {
    fontSize: 20,
    paddingHorizontal: 8,
    paddingVertical: 10,
    flex: 1,
  },
  error: {
    fontSize: 15,
    paddingVertical: 5,
    color: '#dc2626',
  },
  disabled_input: {
    color: '#737373',
  },
});

export default Input;
