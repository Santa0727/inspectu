import { IName, ISchool, IUser } from '../../lib/entities';

export interface IManageState {
  schools: ISchool[];
  roles: IName[];
  users: IUser[];
}
