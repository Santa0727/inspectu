import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from '../ui/Modal';
import Checkbox from '../ui/Checkbox';
import { COLORS } from '../../config/constants';
import { sendRequest } from '../../config/compose';

const makeHtml = (content: string, basePx = 22) => `
<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  :root { --base: ${basePx}px; }
  html { -webkit-text-size-adjust: 100%; }
  body { margin: 0; padding: 8px; line-height: 1.6; font-size: var(--base) !important; }
  p, li, a, span, div { font-size: var(--base) !important; }
  h1 { font-size: calc(var(--base) * 1.8) !important; }
  h2 { font-size: calc(var(--base) * 1.5) !important; }
  h3 { font-size: calc(var(--base) * 1.25) !important; }
  img, video { max-width: 100%; height: auto; }
</style>
</head>
<body style="overflow:auto;">${content}</body>
</html>
`;

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

interface ISelectedFile {
  uri: string;
  name: string;
  type: string;
  size: number;
  base64: string;
}

interface Props {
  visible: boolean;
  task: ITaskDetail;
  onClose: () => void;
  onSuccess?: () => void;
}

const MyTaskModal = ({ visible, task, onClose, onSuccess }: Props) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<ISelectedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    if (checked) {
      setCheckedItems([...checkedItems, itemId]);
    } else {
      setCheckedItems(checkedItems.filter((id) => id !== itemId));
    }
  };
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        const base64 = await FileSystem.readAsStringAsync(file.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const mimeType = file.mimeType || 'application/octet-stream';
        const dataUri = `data:${mimeType};base64,${base64}`;

        const newFile: ISelectedFile = {
          uri: file.uri,
          name: file.name,
          type: mimeType,
          size: file.size || 0,
          base64: dataUri,
        };
        setSelectedFiles([...selectedFiles, newFile]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const handleSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);

    try {
      const taskList = task.task_list.map((item) => ({
        id: item.id,
        checked: checkedItems.includes(item.id),
      }));
      const base64Files = selectedFiles.map((file) => file.base64);
      const requestData = {
        task_id: task.id.toString(),
        task_list: taskList,
        base64_files: base64Files,
      };
      const response = await sendRequest(
        'api/member/tasks/submit',
        requestData,
        'POST',
      );
      if (response.status) {
        if (onSuccess) {
          onSuccess();
        }
        setCheckedItems([]);
        setSelectedFiles([]);

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
    setSelectedFiles([]);
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
            source={{ html: makeHtml(task.intro) }}
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

        <View style={styles.fileSection}>
          <View style={styles.fileButtons}>
            <TouchableOpacity
              style={[styles.iconButton, styles.fileButton]}
              onPress={pickFile}>
              <MaterialIcons name="attach-file" size={32} color="white" />
              <Text style={styles.iconButtonText}>Select File</Text>
            </TouchableOpacity>
          </View>

          {selectedFiles.length > 0 && (
            <View style={styles.filePreviewContainer}>
              <Text style={styles.previewTitle}>Selected Files:</Text>
              <View style={styles.fileList}>
                {selectedFiles.map((file, index) => (
                  <View key={index} style={styles.filePreview}>
                    <View style={styles.fileInfo}>
                      <MaterialIcons
                        name="description"
                        size={24}
                        color={COLORS.primary}
                        style={styles.fileIcon}
                      />
                      <View style={styles.fileDetails}>
                        <Text style={styles.fileName} numberOfLines={1}>
                          {file.name}
                        </Text>
                        <Text style={styles.fileSize}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeFile(index)}>
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
    height: 300,
    backgroundColor: 'transparent',
  },
  taskListSection: {
    marginBottom: 30,
  },
  checkboxItem: {
    marginBottom: 5,
  },
  fileSection: {
    marginBottom: 30,
  },
  fileButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  fileButton: {
    backgroundColor: COLORS.primary,
  },
  iconButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  filePreviewContainer: {
    marginTop: 10,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: 10,
  },
  fileList: {
    gap: 10,
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIcon: {
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
  },
  removeButton: {
    backgroundColor: COLORS.danger,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 16,
  },
});

export default MyTaskModal;
