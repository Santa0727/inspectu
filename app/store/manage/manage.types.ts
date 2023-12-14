import { IRole, ISchool, IUser } from '../../lib/entities';
import { ILogoutAction } from '../auth/auth.types';

export interface IManageState {
  schools: ISchool[];
  roles: IRole[];
  users: IUser[];
}

interface ISetSchoolsAction {
  type: 'MANAGE/SET_SCHOOLS';
  payload: ISchool[];
}

interface ISetRolesAction {
  type: 'MANAGE/SET_ROLES';
  payload: IRole[];
}

interface ISetUsersAction {
  type: 'MANAGE/SET_USERS';
  payload: IUser[];
}

export type IManageAction =
  | ISetSchoolsAction
  | ISetRolesAction
  | ISetUsersAction
  | ILogoutAction;
