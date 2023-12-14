import { IManageState, IManageAction } from './manage.types';

const InitialState: IManageState = {
  schools: [],
  roles: [],
  users: [],
};

export const ManageReducer = (
  state = InitialState,
  action: IManageAction,
): IManageState => {
  switch (action.type) {
    case 'MANAGE/SET_ROLES': {
      return { ...state, roles: action.payload };
    }

    case 'MANAGE/SET_SCHOOLS': {
      return { ...state, schools: action.payload };
    }

    case 'MANAGE/SET_USERS': {
      return { ...state, users: action.payload };
    }

    case 'AUTH/LOGOUT': {
      return InitialState;
    }

    default: {
      return state;
    }
  }
};
