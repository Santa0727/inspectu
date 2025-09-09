import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ITask } from '../../lib/task.entities';
import Modal from '../ui/Modal';
import { defaultDateFormat } from '../../lib/helper';
import { useCallback, useEffect, useRef, useState } from 'react';
import { sendRequest } from '../../config/compose';
import Input from '../ui/Input';
import { IName } from '../../lib/general.entities';
import SingleSelect from '../ui/SingleSelect';
import MultiSelect from '../ui/MultiSelect';
import { FontAwesome } from '@expo/vector-icons';
import CommentBox from '../ui/CommentBox';
import TouchButton from '../ui/TouchButton';
import DatePicker from '../ui/DatePicker';
import Checkbox from '../ui/Checkbox';

interface IUser {
  id: number;
  name: string;
  email: string;
}

interface UserProps {
  districtID?: number;
  values: IUser[];
  onChange: (v: IUser[]) => void;
}

const UserSelect = ({ districtID, values, onChange }: UserProps) => {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [options, setOptions] = useState<IUser[]>([]);

  const loadUser = useCallback(async (name: string) => {
    if (name.trim().length <= 0) return;
    const response = await sendRequest(
      'api/users',
      { name, district_id: districtID, per_page: 100 },
      'GET',
    );
    if (response.status) {
      setOptions(response.data?.data ?? []);
    } else {
      alert(response.message ?? 'Server error');
    }
  }, []);

  const updateName = (val: string) => {
    setName(val);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => loadUser(val), 500);
  };
  const toggleClick = (u: IUser) => {
    if (values.some((x) => x.id === u.id)) {
      onChange(values.filter((x) => x.id !== u.id));
    } else {
      onChange([...values, u]);
    }
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={styles.label}>{'Assigned to'}</Text>
      <TouchableOpacity style={styles.select_btn} onPress={() => setShow(true)}>
        {values.map((x) => (
          <Text key={x.id} style={styles.select_txt}>
            {`${x.name} (${x.email})`}
          </Text>
        ))}
      </TouchableOpacity>
      {show && (
        <Modal
          visible={true}
          title="Select User"
          showFooter={false}
          onClose={() => setShow(false)}>
          <Input
            label="Search by name"
            value={name}
            onChange={(v) => updateName(v)}
          />
          {options.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.item_btn}
              onPress={() => toggleClick(item)}>
              <FontAwesome
                name={
                  values.some((x) => x.id === item.id)
                    ? 'check-square-o'
                    : 'square-o'
                }
                size={24}
                color="white"
              />
              <Text style={styles.item_txt}>
                {`${item.name} (${item.email})`}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={{ height: 20 }} />
        </Modal>
      )}
    </View>
  );
};

interface IList {
  id: string;
  name: string;
  text: string;
}

const ToDoListForm = ({
  values,
  onChange,
}: {
  values: IList[];
  onChange: (v: IList[]) => void;
}) => {
  const [show, setShow] = useState(false);
  const [newItem, setNewItem] = useState<IList>({
    id: `task_${Date.now()}`,
    name: '',
    text: '',
  });

  const deleteItem = (index: number) => {
    const newList = [...values];
    newList.splice(index, 1);
    onChange(newList);
  };
  const confirmNew = () => {
    if (newItem.name.trim().length <= 0) {
      alert('Please enter item name');
      return;
    }
    if (newItem.text.trim().length <= 0) {
      alert('Please enter item description');
      return;
    }
    onChange([...values, newItem]);
    setNewItem({ id: `task_${Date.now()}`, name: '', text: '' });
    setShow(false);
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={styles.label}>{'To-Do List'}</Text>
      <TouchButton
        label={'Add New Item'}
        onPress={() => setShow(true)}
        size="small"
      />
      {values.map((x, i) => (
        <View key={i} style={styles.todo_row}>
          <Text style={styles.todo_txt}>{x.name}</Text>
          <TouchableOpacity onPress={() => deleteItem(i)}>
            <FontAwesome name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ))}
      {show && (
        <Modal
          title="Add new Item"
          visible={true}
          onClose={() => setShow(false)}
          onConfirm={confirmNew}
          showFooter={true}>
          <Input
            label={'Item Name'}
            value={newItem.name}
            onChange={(v) => setNewItem({ ...newItem, name: v })}
            style={{ paddingHorizontal: 0 }}
          />
          <CommentBox
            label={'Description'}
            value={newItem.text}
            onChange={(v) => setNewItem({ ...newItem, text: v })}
            style={{ marginVertical: 10 }}
          />
        </Modal>
      )}
    </View>
  );
};

interface RecurrenceProps {
  form?: IRecurrence;
  onChange: (v: IRecurrence | undefined) => void;
}

const RecurrenceSettings = ({ form, onChange }: RecurrenceProps) => {
  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];
  const periodOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
  ];
  const quarterMonthOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
  ];

  const handleRecurringToggle = (checked: boolean) => {
    if (checked) {
      onChange({
        period: 'monthly',
        month: 1,
        quarterMonth: 1,
        dayOfTheMonth: 1,
        dueDays: 7,
      });
    } else {
      onChange(undefined);
    }
  };
  const updateForm = (key: keyof IRecurrence, value: any) => {
    if (form) onChange({ ...form, [key]: value });
  };

  return (
    <View style={{ marginVertical: 10, paddingHorizontal: 5 }}>
      <Checkbox
        label="Make task Recurring?"
        value={!!form}
        onChange={handleRecurringToggle}
        position="left"
      />

      {!!form && (
        <View style={{ marginVertical: 10 }}>
          <SingleSelect
            style={{ marginBottom: 5 }}
            label="Period"
            showLabel={true}
            options={periodOptions}
            value={form.period}
            onChange={(v) => updateForm('period', v)}
          />
          {form.period === 'quarterly' && (
            <SingleSelect
              style={{ marginBottom: 5 }}
              label="Month of the quarter"
              showLabel={true}
              options={quarterMonthOptions}
              value={form.quarterMonth}
              onChange={(v) => updateForm('quarterMonth', v)}
            />
          )}
          {form.period === 'yearly' && (
            <SingleSelect
              style={{ marginBottom: 5 }}
              label="Month"
              showLabel={true}
              options={monthOptions}
              value={form.month}
              onChange={(v) => updateForm('month', v)}
            />
          )}
          <Input
            label="Day of the months"
            type="number-pad"
            value={String(form.dayOfTheMonth)}
            onChange={(v) =>
              updateForm('dayOfTheMonth', Math.min(30, Number(v) || 0))
            }
            style={{ paddingHorizontal: 0 }}
          />
          <Input
            label="Due days"
            type="number-pad"
            value={String(form.dueDays)}
            onChange={(v) => updateForm('dueDays', Number(v) || 0)}
            style={{ marginBottom: 5, paddingHorizontal: 0 }}
          />
        </View>
      )}
    </View>
  );
};

interface IRecurrence {
  period: 'monthly' | 'quarterly' | 'yearly';
  month: number;
  quarterMonth: number;
  dayOfTheMonth: number;
  dueDays: number;
}

interface IForm {
  name: string;
  district_id?: number;
  status?: 'publish' | 'draft';
  intro: string;
  categories: number[];
  assigned_to: IUser[];
  task_list: IList[];
  due_date?: string;
  recurrence_settings?: IRecurrence;
}

interface CreateProps {
  data?: { due_date?: string };
  visible: boolean;
  onClose: () => void;
}

const CreateTaskModal = ({
  data: paramData,
  visible,
  onClose,
}: CreateProps) => {
  const [districts, setDistricts] = useState<IName[]>([]);
  const [categories, setCategories] = useState<IName[]>([]);
  const [form, setForm] = useState<IForm>({
    name: '',
    intro:
      'Please follow the steps below to complete this task. Each step represents a required action. As you complete each one, mark the checkbox to indicate it’s done. Once all actions are completed, submit the task.',
    categories: [],
    assigned_to: [],
    task_list: [],
    due_date: paramData?.due_date,
  });
  const [disabled, setDisabled] = useState(false);

  const loadCategories = useCallback(async (district_id: number) => {
    const response = await sendRequest(
      'api/inspections/categories/all',
      { district_id, per_page: 200 },
      'GET',
    );
    if (response.status) {
      setCategories(response.data?.data ?? []);
    } else {
      alert(response.message ?? 'Server error');
    }
  }, []);

  const loadDistricts = useCallback(async () => {
    const response = await sendRequest('api/district', {}, 'GET');
    if (response.status) {
      setDistricts(response.data?.data ?? []);
    } else {
      alert(response.message ?? 'Server error');
    }
  }, []);

  const updateForm = (key: keyof IForm, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (key === 'district_id') {
      loadCategories(value);
    }
  };
  const confirmClick = async () => {
    if (form.name.trim().length <= 0) {
      alert('Please enter task name');
      return;
    }
    if (!form.district_id) {
      alert('Please select organization');
      return;
    }
    if (form.assigned_to.length <= 0) {
      alert('Please select at least one user to assign this task');
      return;
    }
    if (form.categories.length <= 0) {
      alert('Please select at least one category');
      return;
    }
    if (!form.due_date) {
      alert('Please enter due date');
      return;
    }
    if (form.task_list.length <= 0) {
      alert('Please add at least one task to the task list');
      return;
    }
    if (!form.status) {
      alert('Please select task status');
      return;
    }
    const data = {
      ...form,
      assigned_to: JSON.stringify(form.assigned_to.map((x) => x.id)),
      task_list: JSON.stringify(form.task_list),
      categories: form.categories.join(','),
      recurrence_settings: form.recurrence_settings
        ? JSON.stringify(form.recurrence_settings)
        : undefined,
    };
    setDisabled(true);
    const response = await sendRequest('api/tasks/create', data, 'POST');
    setDisabled(false);
    if (response.status) {
      alert('Task created successfully');
      onClose();
    } else {
      alert(response.message ?? 'Server error');
    }
  };

  useEffect(() => {
    loadDistricts();
  }, [loadDistricts]);

  return (
    <Modal
      visible={visible}
      onConfirm={confirmClick}
      onClose={onClose}
      showFooter={true}
      title="Schedule Task"
      disabled={disabled}>
      <Input
        label={'Name'}
        value={form.name}
        onChange={(v) => updateForm('name', v)}
        style={{ paddingHorizontal: 0 }}
      />
      <SingleSelect
        style={{ marginVertical: 10 }}
        label={'Select Organization'}
        showLabel={true}
        options={districts.map((d) => ({ value: d.id, label: d.name }))}
        value={form.district_id}
        onChange={(v) => updateForm('district_id', v)}
      />
      <UserSelect
        values={form.assigned_to}
        onChange={(v) => updateForm('assigned_to', v)}
        districtID={form.district_id}
      />
      {!!form.district_id && (
        <MultiSelect
          label="Categories"
          value={form.categories}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          onChange={(v) => updateForm('categories', v)}
          style={{ marginVertical: 10 }}
        />
      )}
      <CommentBox
        label={'Instructions for completing task'}
        value={form.intro}
        onChange={(v) => updateForm('intro', v)}
        style={{ marginVertical: 10 }}
      />
      <ToDoListForm
        values={form.task_list}
        onChange={(v) => updateForm('task_list', v)}
      />
      <DatePicker
        label={'Due Date'}
        value={form.due_date}
        onChange={(v) => updateForm('due_date', v)}
      />
      <RecurrenceSettings
        form={form.recurrence_settings}
        onChange={(v) => updateForm('recurrence_settings', v)}
      />
      <SingleSelect
        style={{ marginVertical: 10 }}
        label={'Select Status'}
        showLabel={true}
        options={[
          { value: 'draft', label: 'Draft' },
          { value: 'publish', label: 'Assigned' },
        ]}
        value={form.status}
        onChange={(v) => updateForm('status', v)}
      />
      <View style={{ height: 20 }} />
    </Modal>
  );
};

interface ViewProps {
  taskData: ITask;
  visible: boolean;
  onClose: () => void;
}

const ViewTaskModal = ({ taskData, visible, onClose }: ViewProps) => (
  <Modal
    visible={visible}
    title={'View Task'}
    showFooter={false}
    onClose={onClose}>
    <View>
      <View style={styles.tr}>
        <Text style={[styles.th, { fontSize: 20 }]}>{taskData.name}</Text>
      </View>
      <View style={styles.tr}>
        <Text style={styles.th}>{'Due Date'}</Text>
        <Text style={styles.td}>{defaultDateFormat(taskData.due_date)}</Text>
      </View>
      <View style={styles.tr}>
        <Text style={styles.th}>{'Assigned To'}</Text>
        <Text style={styles.td}>
          {taskData.assigned_to.map((a) => a.name).join(', ')}
        </Text>
      </View>
      <View style={styles.tr}>
        <Text style={styles.th}>{'Owned By'}</Text>
        <Text style={styles.td}>{taskData.owned_by.name}</Text>
      </View>
      <View style={styles.tr}>
        <Text style={styles.th}>{'Category'}</Text>
        <Text style={styles.td}>
          {taskData.category.map((c) => c.name).join(', ')}
        </Text>
      </View>
      <View style={styles.tr}>
        <Text style={styles.th}>{'School'}</Text>
        <Text style={styles.td}>{taskData.school.name}</Text>
      </View>
      <View style={styles.tr}>
        <Text style={styles.th}>{'Status'}</Text>
        <Text style={styles.td}>{taskData.status}</Text>
      </View>
      <View style={{ height: 20 }} />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  tr: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  th: {
    flex: 1,
    fontWeight: 'bold',
  },
  td: {
    flex: 2,
  },
  label: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: '600',
  },
  select_btn: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E5E7E9',
    backgroundColor: '#FAFBFC',
    minHeight: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  select_txt: {
    margin: 3,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f0f0f0',
    fontSize: 17,
  },
  item_btn: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 12,
    alignItems: 'center',
    backgroundColor: '#34d399',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  item_txt: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  todo_row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
  },
  todo_txt: {
    fontSize: 18,
    fontWeight: '500',
  },
});

interface Props {
  taskData?: ITask;
  data?: { due_date?: string };
  visible: boolean;
  onClose: () => void;
}

export default ({ taskData, data, visible, onClose }: Props) =>
  taskData ? (
    <ViewTaskModal taskData={taskData} visible={visible} onClose={onClose} />
  ) : (
    <CreateTaskModal data={data} visible={visible} onClose={onClose} />
  );
