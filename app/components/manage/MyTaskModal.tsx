import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import Modal from '../ui/Modal';
import Checkbox from '../ui/Checkbox';
import { COLORS } from '../../config/constants';
import { sendRequest } from '../../config/compose';

interface IListItem {
  id: string;
  name: string;
}

interface ITaskDetail {
  id: number;
  name: string;
  intro: string;
  task_list: IListItem[];
}

interface Props {
  visible: boolean;
  task: ITaskDetail;
  onClose: () => void;
  onSuccess?: () => void;
}

const MyTaskModal = ({ visible, task, onClose, onSuccess }: Props) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    if (checked) {
      setCheckedItems([...checkedItems, itemId]);
    } else {
      setCheckedItems(checkedItems.filter((id) => id !== itemId));
    }
  };
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission required',
        'Permission to access camera roll is required!',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
  };
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission required',
        'Permission to access camera is required!',
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets[0]) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
  };
  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
  };

  const handleSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);

    try {
      const taskList = task.task_list.map((item) => ({
        id: item.id,
        checked: checkedItems.includes(item.id),
      }));

      const formData = new FormData();
      formData.append('task_id', task.id.toString());
      formData.append('task_list', JSON.stringify(taskList));

      for (let i = 0; i < selectedImages.length; i++) {
        const imageUri = selectedImages[i];
        const filename = `image_${i}_${Date.now()}.jpg`;

        formData.append('files[]', {
          uri: imageUri,
          type: 'image/jpeg',
          name: filename,
        } as any);
      }
      const response = await sendRequest(
        'api/member/tasks/submit',
        formData,
        'POST',
      );
      if (response.status) {
        if (onSuccess) {
          onSuccess();
        }
        setCheckedItems([]);
        setSelectedImages([]);

        onClose();
      } else {
        Alert.alert('Error', response.message || 'Failed to submit task');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while submitting the task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setCheckedItems([]);
    setSelectedImages([]);
    onClose();
  };
  return (
    <Modal
      visible={visible}
      title={task.name}
      onClose={handleClose}
      showFooter={true}
      onConfirm={handleSubmit}
      disabled={submitting}>
      <View style={styles.container}>
        <View style={styles.introSection}>
          <WebView
            source={{ html: task.intro }}
            style={styles.webView}
            scalesPageToFit={false}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={styles.taskListSection}>
          {task.task_list.map((item) => (
            <Checkbox
              key={item.id}
              value={checkedItems.includes(item.id)}
              onChange={(checked) => handleCheckboxChange(item.id, checked)}
              label={item.name}
              style={styles.checkboxItem}
              markPosition="right"
            />
          ))}
        </View>

        <View style={styles.imageSection}>
          <View style={styles.imageButtons}>
            <TouchableOpacity
              style={[styles.iconButton, styles.galleryButton]}
              onPress={pickImage}>
              <AntDesign name="picture" size={32} color="white" />
              <Text style={styles.iconButtonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, styles.cameraButton]}
              onPress={takePhoto}>
              <FontAwesome name="camera" size={32} color="white" />
              <Text style={styles.iconButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>

          {selectedImages.length > 0 && (
            <View style={styles.imagePreviewContainer}>
              <Text style={styles.previewTitle}>Selected Images:</Text>
              <View style={styles.imageGrid}>
                {selectedImages.map((uri, index) => (
                  <View key={index} style={styles.imagePreview}>
                    <Image source={{ uri }} style={styles.previewImage} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeImage(index)}>
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  introSection: {
    marginBottom: 30,
  },
  webView: {
    height: 100,
    backgroundColor: 'transparent',
  },
  taskListSection: {
    marginBottom: 30,
  },
  checkboxItem: {
    marginBottom: 5,
  },
  imageSection: {
    marginBottom: 30,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  iconButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  galleryButton: {
    backgroundColor: COLORS.primary,
  },
  cameraButton: {
    backgroundColor: COLORS.secondary,
  },
  iconButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  imagePreviewContainer: {
    marginTop: 10,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: 10,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imagePreview: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.danger,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MyTaskModal;
