import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { PropsWithChildren } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type Props = PropsWithChildren<{ style?: Object }>;

const MainContainer = ({ children, style }: Props) => (
  <KeyboardAvoidingView
    style={styles.wrapper}
    behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.header_logo}>
        <Image
          source={require('../../images/header-logo.png')}
          style={styles.header_img}
        />
      </TouchableOpacity>
      <View style={styles.header_icons}>
        <TouchableOpacity style={styles.header_btn}>
          <Ionicons name="notifications" size={45} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.header_btn}>
          <FontAwesome name="user-circle" size={42} color="black" />
        </TouchableOpacity>
      </View>
    </View>
    <ScrollView style={styles.scroll} keyboardShouldPersistTaps={'always'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={style}>{children}</View>
      </TouchableWithoutFeedback>
    </ScrollView>
    <View style={styles.footer}>
      <TouchableOpacity style={[styles.footer_btn, styles.footer_left]}>
        <Text style={styles.footer_txt}>Inspections</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.footer_btn, styles.footer_center]}>
        <Text style={styles.footer_txt}>Schedule</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.footer_btn, styles.footer_right]}>
        <Text style={styles.footer_txt}>Help</Text>
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scroll: {
    paddingVertical: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  header_logo: {
    minHeight: 100,
  },
  header_img: {
    width: 190,
    resizeMode: 'contain',
    flex: 1,
  },
  header_icons: {
    flexDirection: 'row',
  },
  header_btn: {
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  footer_btn: {
    backgroundColor: '#666666',
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer_txt: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  footer_left: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  footer_center: {
    marginHorizontal: 5,
  },
  footer_right: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
});

export default MainContainer;
