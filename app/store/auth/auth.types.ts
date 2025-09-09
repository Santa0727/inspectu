export interface IProfile {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
}

export interface IAuthState {
  token: string | null;
  profile?: IProfile;
}
