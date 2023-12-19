export interface ISchool {
  id: number;
  name: string;
  users_count: number;
}

export interface IRole {
  id: number;
  name: string;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  schools: ISchool[];
  roles: IRole[];
}

export interface IInspection {
  id: number;
  name: string;
  status: 'publish' | 'pending_review' | 'review_required';
  due_date: string;
}
