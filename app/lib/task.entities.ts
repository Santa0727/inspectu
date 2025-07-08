import { IName } from './general.entities';

export interface ITask {
  id: number;
  name: string;
  due_date: string;
  assigned_to: IName[];
  category: IName[];
  owned_by: IName;
  school: IName;
  status: 'publish' | 'draft';
}
