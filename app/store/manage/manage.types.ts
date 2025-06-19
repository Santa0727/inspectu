import { ISchool, IUser } from '../../lib/manage.entities';
import { IName } from '../../lib/general.entities';

export interface IManageState {
  schools: ISchool[];
  roles: IName[];
  users: IUser[];
}
