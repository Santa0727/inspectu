import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = PropsWithChildren<{
  style?: Object;
  onPress?: (d?: any) => void;
  label?: string;
  disabled?: boolean;
  scheme?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'default' | 'small';
}>;

const TouchButton = ({
  children,
  scheme,
  style,
  label,
  onPress,
  disabled,
  size,
}: Props) => {
  const btnStyle =
    scheme === 'secondary'
      ? styles.sec_btn
      : scheme === 'danger'
      ? styles.danger_btn
      : scheme === 'success'
      ? styles.success_btn
      : scheme === 'primary'
      ? styles.primary_btn
      : {};

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        btnStyle,
        size === 'small' ? smallStyle.btn : {},
        disabled ? styles.disabled : {},
        style,
      ]}
      disabled={disabled}
      onPress={onPress}>
      {label && (
        <Text style={[styles.label, size === 'small' ? smallStyle.label : {}]}>
          {label}
        </Text>
      )}
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: 3,
    backgroundColor: '#172f84',
    textAlign: 'center',
    minHeight: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  primary_btn: {
    backgroundColor: '#0891b2',
  },
  sec_btn: {
    backgroundColor: '#71ba3a',
  },
  disabled: {
    backgroundColor: '#737373',
  },
  danger_btn: {
    backgroundColor: '#e11d48',
  },
  success_btn: {
    backgroundColor: '#16a34a',
  },
});

const smallStyle = StyleSheet.create({
  btn: {
    minHeight: 18,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  label: {
    fontSize: 18,
  },
});

export default TouchButton;
