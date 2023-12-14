import { useState } from 'react';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { sendRequest } from '../../config/compose';
import { toastError } from '../../lib/helper';
import { useDispatch } from 'react-redux';
import { loadSchools } from '../../store/manage/manage.actions';

interface Props {
  data?: any;
  updateID?: number;
  visible: boolean;
  onClose: () => void;
}

const SchoolModal = ({ visible, onClose, data, updateID }: Props) => {
  const dispatch = useDispatch<any>();

  const [name, setName] = useState(data?.name ?? '');
  const [disabled, setDisabled] = useState(false);

  const confirmClick = async () => {
    if (!name) {
      toastError('Empty name is not allowed');
      return;
    }
    setDisabled(true);
    const res = updateID
      ? await sendRequest(
          `api/director/schools/update/${updateID}`,
          { name },
          'PATCH',
        )
      : await sendRequest('api/director/schools/create', { name }, 'POST');
    if (res.status) {
      await dispatch(loadSchools());
      onClose();
    } else {
      setDisabled(false);
      alert(res.message ?? 'Server error');
    }
  };

  return (
    <Modal
      visible={visible}
      title={updateID ? 'Update school' : 'Add new school'}
      showFooter={true}
      onClose={onClose}
      onConfirm={confirmClick}
      disabled={disabled}>
      <Input label="School name" value={name} onChange={(v) => setName(v)} />
    </Modal>
  );
};

export default SchoolModal;
