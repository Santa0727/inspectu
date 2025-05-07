import { sendRequest } from '../../config/compose';
import { createAppSlice } from '../hooks';
import { IManageState } from './manage.types';

const initialState: IManageState = {
  schools: [],
  roles: [],
  users: [],
};

const manageSlice = createAppSlice({
  name: 'manage',
  initialState,
  reducers: (create) => ({
    loadSchools: create.asyncThunk(
      async (_, thunkAPI) => {
        const response = await sendRequest('api/director/schools', {}, 'GET');
        if (!response.status) {
          throw new Error(response.message ?? 'Server error');
        }
        return response.data;
      },
      {
        pending: (state) => {},
        fulfilled: (state, action) => {
          state.schools = action.payload;
        },
        rejected: (state, action) => {},
      },
    ),
    loadRoles: create.asyncThunk(
      async (_, thunkAPI) => {
        const response = await sendRequest('api/director/roles', {}, 'GET');
        if (!response.status) {
          throw new Error(response.message ?? 'Server error');
        }
        return response.data;
      },
      {
        pending: (state) => {},
        fulfilled: (state, action) => {
          state.roles = action.payload;
        },
        rejected: (state, action) => {},
      },
    ),
    loadUsers: create.asyncThunk(
      async (_, thunkAPI) => {
        const response = await sendRequest('api/director/users', {}, 'GET');
        if (!response.status) {
          throw new Error(response.message ?? 'Server error');
        }
        return response.data;
      },
      {
        pending: (state) => {},
        fulfilled: (state, action) => {
          state.users = action.payload;
        },
        rejected: (state, action) => {},
      },
    ),
  }),
});

export default manageSlice;
