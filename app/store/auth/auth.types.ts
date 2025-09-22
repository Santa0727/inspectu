export interface IProfile {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  user_permissions: string[];
}

export interface IAuthState {
  token: string | null;
  profile?: IProfile;
}
