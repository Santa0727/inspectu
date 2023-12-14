import { Dispatch } from 'redux';
import { IManageAction } from './manage.types';
import { sendRequest } from '../../config/compose';
import { RootState } from '../store';

const setManage = (action: IManageAction): IManageAction => action;

export const loadSchools = () => {
  return async (dispatch: Dispatch<any>) => {
    const response = await sendRequest('api/director/schools', {}, 'GET');
    if (!response.status) {
      return response.message ?? 'Server error';
    }
    dispatch(setManage({ type: 'MANAGE/SET_SCHOOLS', payload: response.data }));

    return true;
  };
};

export const loadRoles = () => {
  return async (dispatch: Dispatch<any>) => {
    const response = await sendRequest('api/director/roles', {}, 'GET');
    if (!response.status) {
      return response.message ?? 'Server error';
    }
    dispatch(setManage({ type: 'MANAGE/SET_ROLES', payload: response.data }));

    return true;
  };
};

export const loadUsers = () => {
  return async (dispatch: Dispatch<any>, getState: () => RootState) => {
    const response = await sendRequest('api/director/users', {}, 'GET');
    if (!response.status) {
      return response.message ?? 'Server error';
    }
    const payload = response.data.filter(
      (x: any) => x.id !== getState().auth.profile?.id,
    );
    dispatch(setManage({ type: 'MANAGE/SET_USERS', payload }));

    return true;
  };
};
