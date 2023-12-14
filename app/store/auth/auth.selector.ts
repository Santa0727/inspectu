import { createSelector } from 'reselect';
import { RootState } from '../store';

export const selectToken = createSelector(
  (state: RootState) => state.auth.token,
  (token) => token,
);

export const selectProfile = createSelector(
  (state: RootState) => state.auth.profile,
  (profile) => profile,
);
