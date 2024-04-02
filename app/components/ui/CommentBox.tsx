import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';

interface Props {
  label?: string;
  placeholder?: string;
  value?: string | null;
  style?: StyleProp<ViewStyle>;
  onChange: (v: string) => void;
}

const CommentBox = ({ label, placeholder, value, style, onChange }: Props) => (
  <View style={style}>
    {!!label && <Text style={styles.label}>{label}</Text>}
    <TextInput
      placeholder={placeholder}
      numberOfLines={Platform.OS === 'ios' ? undefined : 5}
      multiline={true}
      style={styles.input}
      value={value ?? ''}
      onChangeText={(t) => onChange(t)}
    />
  </View>
);

const styles = StyleSheet.create({
  label: {
    fontSize: 20,
    marginBottom: 2,
  },
  input: {
    fontSize: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#d9d9d9',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingTop: 12,
    minHeight: 120,
  },
});

export default CommentBox;
