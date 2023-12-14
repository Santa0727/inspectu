import { IAuthAction, IAuthState } from './auth.types';

const INITIAL_STATE: IAuthState = {
  token: null,
};

export const AuthReducer = (
  state = INITIAL_STATE,
  action: IAuthAction,
): IAuthState => {
  switch (action.type) {
    case 'AUTH/LOGIN': {
      return { ...state, token: action.payload };
    }

    case 'AUTH/SET_PROFILE': {
      return { ...state, profile: action.payload };
    }

    case 'AUTH/LOGOUT': {
      return INITIAL_STATE;
    }

    default: {
      return state;
    }
  }
};
