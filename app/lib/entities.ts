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
  due_date: string;
  date_submitted: string;
  form_id: number;
  form: {
    id: number;
    name: string;
  };
  owned_by: {
    id: number;
    name: string;
  };
  school_id: number;
  school: {
    id: number;
    name: string;
  };
  status: 'pending_review' | 'publish';
  submitted_by: number;
  submitted_by_user: {
    id: number;
    name: string;
  };
}
