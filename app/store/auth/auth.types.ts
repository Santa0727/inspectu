interface IProfile {
  id: number;
  name: string;
  email: string;
}

export interface IAuthState {
  token: string | null;
  profile?: IProfile;
}

interface ILoginAction {
  type: 'AUTH/LOGIN';
  payload: string;
}

interface ISetProfile {
  type: 'AUTH/SET_PROFILE';
  payload: IProfile;
}

export interface ILogoutAction {
  type: 'AUTH/LOGOUT';
}

export type IAuthAction = ILoginAction | ISetProfile | ILogoutAction;
