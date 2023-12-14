import { Dispatch } from 'redux';
import { IAuthAction } from './auth.types';
import { sendRequest } from '../../config/compose';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadRoles, loadSchools } from '../manage/manage.actions';

const setAuth = (action: IAuthAction): IAuthAction => action;

export const loadMyProfile = () => {
  return async (dispatch: Dispatch<any>) => {
    const response = await sendRequest('api/member/self', {}, 'GET');
    if (!response.status) {
      return response.message ?? 'Server error';
    }
    dispatch(setAuth({ type: 'AUTH/SET_PROFILE', payload: response.data }));

    (async () => {
      await dispatch(loadSchools());
      await dispatch(loadRoles());
    })();

    return true;
  };
};

export const authRegister = (form: any) => {
  return async (dispatch: Dispatch<any>) => {
    const response = await sendRequest('api/auth/register', form, 'POST');
    await AsyncStorage.removeItem('__token');

    if (!response.status) {
      let message: any = response.message;
      if (response.data.errors) {
        const errors = Object.values(response.data.errors);
        message = errors.reduce((p: any, c: any) => [...p, ...c], []);
        message = message.join(', ');
      }
      return message;
    }
    const token = response.data.token;
    await AsyncStorage.setItem('__token', token);

    await dispatch(loadMyProfile());

    dispatch(setAuth({ type: 'AUTH/LOGIN', payload: token }));

    return true;
  };
};

export const authLogin = (email: string, password: string) => {
  return async (dispatch: Dispatch<any>) => {
    const response = await sendRequest(
      'api/auth/login',
      { email, password },
      'POST',
    );
    await AsyncStorage.removeItem('__token');

    if (!response.status) {
      return response.message ?? 'Server error';
    }
    const token = response.data.token;
    await AsyncStorage.setItem('__token', token);

    await dispatch(loadMyProfile());

    dispatch(setAuth({ type: 'AUTH/LOGIN', payload: token }));

    return true;
  };
};

export const authLogout = () => {
  return async (dispatch: Dispatch<any>) => {
    await sendRequest('api/auth/logout', {}, 'POST');

    dispatch(setAuth({ type: 'AUTH/LOGOUT' }));

    return true;
  };
};
