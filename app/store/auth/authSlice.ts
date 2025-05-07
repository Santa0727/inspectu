import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendRequest } from '../../config/compose';
import { createAppSlice } from '../hooks';
import { IAuthState } from './auth.types';
import manageSlice from '../manage/manageSlice';

const initialState: IAuthState = {
  token: null,
};

const authSlice = createAppSlice({
  name: 'auth',
  initialState,
  reducers: (create) => ({
    loadMyProfile: create.asyncThunk(
      async (_, thunkAPI) => {
        try {
          const response = await sendRequest('api/member/self', {}, 'GET');
          if (!response.status) {
            thunkAPI.dispatch(authSlice.actions.logout());

            throw new Error(response.message ?? 'Server error');
          }

          (async () => {
            thunkAPI.dispatch(manageSlice.actions.loadSchools());
            thunkAPI.dispatch(manageSlice.actions.loadRoles());
          })();

          return response.data;
        } catch (err: any) {
          thunkAPI.dispatch(authSlice.actions.logout());

          return thunkAPI.rejectWithValue(
            err.message || 'Failed to load profile',
          );
        }
      },
      {
        pending: (state) => {},
        fulfilled: (state, action) => {
          state.profile = action.payload;
        },
        rejected: (state, action) => {
          state.profile = undefined;
        },
      },
    ),
    login: create.asyncThunk(
      async (
        { email, password }: { email: string; password: string },
        thunkAPI,
      ) => {
        try {
          const response = await sendRequest(
            'api/auth/login',
            { email, password },
            'POST',
          );

          await AsyncStorage.removeItem('__token');

          if (!response.status || !response.data?.token) {
            throw new Error(response.message ?? 'Server error');
          }

          const token = response.data.token;
          await AsyncStorage.setItem('__token', token);

          await thunkAPI.dispatch(authSlice.actions.loadMyProfile());

          return token;
        } catch (err: any) {
          return thunkAPI.rejectWithValue(err.message || 'Login failed');
        }
      },
      {
        pending: (state) => {},
        fulfilled: (state, action) => {
          state.token = action.payload;
        },
        rejected: (state, action) => {
          state.token = null;
        },
      },
    ),
    register: create.asyncThunk(
      async (form: any, thunkAPI) => {
        try {
          const response = await sendRequest('api/auth/register', form, 'POST');
          await AsyncStorage.removeItem('__token');

          if (!response.status) {
            let message: any = response.message;
            if (response.data.errors) {
              const errors = Object.values(response.data.errors);
              message = errors.reduce((p: any, c: any) => [...p, ...c], []);
              message = message.join(', ');
            }
            throw new Error(message);
          }

          const token = response.data.token;
          await AsyncStorage.setItem('__token', token);

          await thunkAPI.dispatch(authSlice.actions.loadMyProfile());

          return token;
        } catch (err: any) {
          return thunkAPI.rejectWithValue(err.message || 'Register failed');
        }
      },
      {
        pending: (state) => {},
        fulfilled: (state, action) => {
          state.token = action.payload;
        },
        rejected: (state, action) => {
          state.token = null;
        },
      },
    ),
    logout: create.reducer((state) => {
      state.token = null;
      state.profile = undefined;
    }),
    logoutAsync: create.asyncThunk(
      async (_, thunkAPI) => {
        try {
          await sendRequest('api/auth/logout', {}, 'POST');
          await AsyncStorage.removeItem('__token');
        } catch (err: any) {
          return thunkAPI.rejectWithValue(err.message || 'Logout failed');
        }
      },
      {
        pending: (state) => {},
        fulfilled: (state, action) => {
          state.token = null;
          state.profile = undefined;
        },
        rejected: (state, action) => {},
      },
    ),
  }),
  selectors: {
    selectToken: (state) => state.token,
    selectProfile: (state) => state.profile,
  },
});

export default authSlice;

export const { selectToken, selectProfile } = authSlice.selectors;

export const { loadMyProfile, register, login, logoutAsync } =
  authSlice.actions;
