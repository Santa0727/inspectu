import { PropsWithChildren } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../../config/constants';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  onPress?: (d?: any) => void;
  label?: string;
  disabled?: boolean;
  scheme?: 'primary' | 'secondary' | 'danger' | 'success' | 'yellow';
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
    scheme === 'primary'
      ? styles.primary_btn
      : scheme === 'secondary'
      ? styles.sec_btn
      : scheme === 'danger'
      ? styles.danger_btn
      : scheme === 'success'
      ? styles.success_btn
      : scheme === 'yellow'
      ? styles.yellow_btn
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
    backgroundColor: '#414BB2',
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
    backgroundColor: COLORS.primary,
  },
  sec_btn: {
    backgroundColor: COLORS.secondary,
  },
  disabled: {
    backgroundColor: COLORS.disabled,
  },
  danger_btn: {
    backgroundColor: COLORS.danger,
  },
  success_btn: {
    backgroundColor: COLORS.success,
  },
  yellow_btn: {
    backgroundColor: COLORS.yellow,
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
