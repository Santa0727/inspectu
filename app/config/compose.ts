import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './settings';
import axios from 'axios';

interface HttpResponse {
  status: boolean;
  data: any;
  message?: string;
}

const httpResponse = ({
  status,
  data,
  message,
}: HttpResponse): HttpResponse => ({
  status,
  data,
  message,
});

export const sendRequest = async (
  url: string,
  data: any,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
): Promise<HttpResponse> => {
  const token = await AsyncStorage.getItem('__token');

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
  const req = {
    headers,
    method,
    url: `${API_URL}/${url}`,
  };
  Object.assign(req, method === 'GET' ? { params: data } : { data });

  try {
    const response = await axios(req);

    if (response.status < 200 || response.status > 299) {
      return httpResponse({
        status: false,
        data: await response.data,
        message: response.data.message,
      });
    }
    if (response.data.status === undefined || response.data.status === null) {
      return httpResponse({
        status: true,
        data: await response.data,
        message: response.data.message,
      });
    }
    return httpResponse({
      status: !!response.data.status,
      data: response.data.data ?? response.data,
      message: response.data.message,
    });
  } catch (error: any) {
    if (
      error.response === undefined ||
      (error.response.readyState === 4 &&
        error.response.responseHeaders === undefined &&
        error.response.data === undefined)
    ) {
      return httpResponse({
        status: false,
        data: req,
        message: error?.message,
      });
    }

    const err = error?.response?.data;
    const msg = Array.isArray(err?.message)
      ? err.message[0]
      : err?.message ?? 'Error';

    return httpResponse({
      status: false,
      data: null,
      message: msg,
    });
  }
};
