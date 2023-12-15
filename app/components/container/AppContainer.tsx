import { PropsWithChildren } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type Props = PropsWithChildren<{ style?: Object }>;

const AppContainer = ({ children, style }: Props) => (
  <KeyboardAvoidingView
    style={styles.wrapper}
    behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
    <ScrollView style={styles.scroll} keyboardShouldPersistTaps={'always'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={style}>{children}</View>
      </TouchableWithoutFeedback>
    </ScrollView>
  </KeyboardAvoidingView>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scroll: {
    paddingVertical: 15,
  },
});

export default AppContainer;
