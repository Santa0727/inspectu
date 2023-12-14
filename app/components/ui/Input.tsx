import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
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
  disabled,
}: Props) => (
  <View style={[styles.view, style]}>
    {!!label && <Text style={styles.label}>{label}</Text>}
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
  text_input: {
    fontSize: 20,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderStyle: 'solid',
    borderWidth: 1.5,
    borderColor: '#a8a29e',
    borderRadius: 5,
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
