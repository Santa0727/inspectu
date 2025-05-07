interface IProfile {
  id: number;
  name: string;
  email: string;
}

export interface IAuthState {
  token: string | null;
  profile?: IProfile;
}
