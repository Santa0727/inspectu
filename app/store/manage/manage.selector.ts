import { createSelector } from 'reselect';
import { RootState } from '../store';

export const selectRoles = createSelector(
  (state: RootState) => state.manage.roles,
  (roles) => roles,
);

export const selectSchools = createSelector(
  (state: RootState) => state.manage.schools,
  (schools) => schools,
);

export const selectUsers = createSelector(
  (state: RootState) => state.manage.users,
  (users) => users,
);
