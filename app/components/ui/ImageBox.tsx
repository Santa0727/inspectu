import {
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const options: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  base64: true,
};

interface Props {
  image?: string;
  disabled?: boolean;
  onChange?: (d: string) => void;
  style?: StyleProp<ViewStyle>;
}

const ImageBox = ({ image, disabled, onChange, style }: Props) => {
  const onOpenCamera = async () => {
    const status = await ImagePicker.requestCameraPermissionsAsync();
    if (!status.granted) {
      alert('You have no camera access permission');
      return;
    }

    const lunch = await ImagePicker.launchCameraAsync(options);

    if (lunch?.canceled !== true && lunch.assets.length > 0) {
      const data = lunch.assets[0];
      let arr = data.uri.split('/');
      const filename = arr[arr.length - 1];
      arr = filename.split('.');
      const ext = arr[arr.length - 1].toLowerCase();

      if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') return;

      const type =
        ext === 'png'
          ? 'image/png'
          : ext === 'jpg'
          ? 'image/jpg'
          : 'image/jpeg';

      if (onChange) {
        onChange(`data:${type};base64,${data.base64}`);
      }
    }
  };

  return (
    <View style={[styles.wrapper, style]}>
      <TouchableOpacity
        style={styles.touch_img}
        onPress={onOpenCamera}
        disabled={disabled}>
        <Image
          resizeMode="cover"
          style={styles.image}
          source={
            image
              ? {
                  uri: image,
                }
              : require('../../images/placeholder.jpg')
          }
          alt="Pickup image"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  touch_img: {
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 3,
    height: 150,
    minHeight: 150,
    minWidth: 150,
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
});

export default ImageBox;
