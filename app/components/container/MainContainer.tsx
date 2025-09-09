import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Foundation,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { PropsWithChildren } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { COLORS } from '../../config/constants';
import NotificationIcon from '../common/NotificationIcon';
import { StatusBar } from 'expo-status-bar';
import { useAppSelector } from '../../store/hooks';
import { selectProfile } from '../../store/auth/authSlice';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

const MainContainer = ({ children, style }: Props) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const profile = useAppSelector(selectProfile);

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'android' ? undefined : 'padding'}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.header_logo}
          onPress={() =>
            navigation.navigate('Home', { screen: 'Inspections' })
          }>
          <Image
            source={require('../../images/login-logo.png')}
            style={styles.header_img}
          />
        </TouchableOpacity>
        <View style={styles.header_icons}>
          <TouchableOpacity
            style={styles.header_btn}
            onPress={() => navigation.navigate('Message')}>
            <MaterialCommunityIcons
              name="android-messages"
              size={30}
              color={COLORS.dark}
            />
          </TouchableOpacity>
          <NotificationIcon />
          <TouchableOpacity
            style={styles.header_btn}
            onPress={() => navigation.navigate('Profile')}>
            {!profile?.avatar ? (
              <FontAwesome name="user-circle" size={42} color="black" />
            ) : (
              <Image
                source={{ uri: profile.avatar }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 1,
                  borderColor: '#1C2434',
                }}
                resizeMode="cover"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scroll} keyboardShouldPersistTaps={'always'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={style}>{children}</View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footer_btn}
          onPress={() =>
            navigation.navigate('Home', { screen: 'Inspections' })
          }>
          <Foundation name="home" size={26} color="#A4ACBD" />
          <Text style={styles.footer_txt}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footer_btn}
          onPress={() => navigation.navigate('Home', { screen: 'Schedule' })}>
          <MaterialCommunityIcons name="clock" size={26} color="#A4ACBD" />
          <Text style={styles.footer_txt}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1.4,
            alignItems: 'center',
            alignSelf: 'flex-end',
            display: 'none',
          }}>
          <View style={styles.footer_center}>
            <AntDesign name="pluscircle" size={60} color="#FF0000" />
          </View>
          <Text style={[styles.footer_txt, { marginBottom: 5 }]}>
            Inspections
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footer_btn}
          onPress={() => navigation.navigate('Help')}>
          <MaterialIcons name="help" size={26} color="#A4ACBD" />
          <Text style={styles.footer_txt}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footer_btn}
          onPress={() => navigation.navigate('Home', { screen: 'MyTasks' })}>
          <FontAwesome5 name="tasks" size={26} color="#A4ACBD" />
          <Text style={styles.footer_txt}>{'My Tasks'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? undefined : 15,
  },
  scroll: {
    paddingVertical: 15,
    backgroundColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -15,
    paddingTop: 30,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
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
    paddingHorizontal: 5,
    backgroundColor: COLORS.dark,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 10,
  },
  footer_btn: {
    flex: 1,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer_txt: {
    textAlign: 'center',
    color: '#A4ACBD',
    fontSize: 15,
    marginTop: 3,
  },
  footer_center: {
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: '50%',
    bottom: 25,
  },
});

export default MainContainer;
