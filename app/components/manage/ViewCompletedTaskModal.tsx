import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from '../ui/Modal';
import Checkbox from '../ui/Checkbox';
import Input from '../ui/Input';
import SignaturePanel from '../common/SignaturePanel';
import { COLORS } from '../../config/constants';
import TaskIntroView from './TaskIntroView';

interface ITaskFile {
  path: string;
  name: string;
  time: string;
}

interface IEntry {
  id: string;
  name: string;
  text: string;
  checked: boolean;
}

interface IAssignedTo {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

interface ISchool {
  id: number;
  name: string;
  district_id: number;
  phone: string;
  email: string;
  address: string;
}

interface ICategory {
  id: number;
  name: string;
}

interface ICompletedTaskDetail {
  id: number;
  name: string;
  intro: string;
  status: string;
  due_date: string;
  date_submitted: string;
  created_at: string;
  updated_at: string;
  submitted_by_name: string;
  signature?: string;
  entry: IEntry[];
  task_files: ITaskFile[];
  school: ISchool;
  category: ICategory[];
  assigned_to: IAssignedTo[];
  task_list: {
    id: string;
    name: string;
    text: string;
  }[];
}

interface Props {
  visible: boolean;
  task: ICompletedTaskDetail;
  onClose: () => void;
}

const ViewCompletedTaskModal = ({ visible, task, onClose }: Props) => {
  const openFile = (fileUrl: string) => {
    console.log('Open file:', fileUrl);
  };

  return (
    <Modal
      visible={visible}
      title={`${task.name} (Completed)`}
      onClose={onClose}
      showFooter={false}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Submission Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.detailValue, styles.completedStatus]}>
              Completed
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Due Date:</Text>
            <Text style={styles.detailValue}>{task.due_date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Submitted:</Text>
            <Text style={styles.detailValue}>{task.date_submitted}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Submitted By:</Text>
            <Text style={styles.detailValue}>{task.submitted_by_name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>School:</Text>
            <Text style={styles.detailValue}>{task.school.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Categories:</Text>
            <Text style={styles.detailValue}>
              {task.category.map((c) => c.name).join(', ')}
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Task Instructions</Text>
          <TaskIntroView content={task.intro} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Submitted Answers</Text>
          {task.entry.map((item, index) =>
            item.text && item.text.trim() !== '' ? (
              <View key={item.id} style={styles.answerItem}>
                <Input
                  label={item.name}
                  value={item.text}
                  disabled={true}
                  style={{ paddingHorizontal: 0, marginVertical: 5 }}
                />
              </View>
            ) : (
              <View key={item.id} style={styles.answerItem}>
                <Checkbox
                  value={item.checked}
                  label={item.name}
                  disabled={true}
                  style={styles.checkboxItem}
                  markPosition="right"
                />
              </View>
            ),
          )}
        </View>
        {task.task_files && task.task_files.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Submitted Files</Text>
            <View style={styles.fileList}>
              {task.task_files.map((file, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.fileItem}
                  disabled={true}
                  onPress={() => openFile(file.path)}>
                  <View style={styles.fileInfo}>
                    <MaterialIcons
                      name="description"
                      size={24}
                      color={COLORS.primary}
                      style={styles.fileIcon}
                    />
                    <View style={styles.fileDetails}>
                      <Text style={styles.fileName}>{file.name}</Text>
                      <Text style={styles.fileTime}>
                        {`Uploaded: ${file.time}`}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assigned To</Text>
          {task.assigned_to.map((user, index) => (
            <View key={user.id} style={styles.userItem}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          ))}
        </View>

        {task.signature && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Signature</Text>
            <SignaturePanel value={task.signature} onChange={undefined} />
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.greyBlue,
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  completedStatus: {
    color: COLORS.success,
  },
  answerItem: {
    marginBottom: 8,
  },
  checkboxItem: {
    opacity: 0.8,
  },
  fileList: {
    gap: 10,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
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
  fileTime: {
    fontSize: 12,
    color: '#666',
  },
  userItem: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
  },
});

export default ViewCompletedTaskModal;
