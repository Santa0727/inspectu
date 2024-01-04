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
  status: 'publish' | 'pending_review' | 'review_required' | 'approved';
  due_date: string;
}

interface IOption {
  id: string;
  name: string;
  answer?: boolean;
}

interface IQuestion {
  id: string;
  name: string;
  type: 'radio' | 'checkbox';
  text: string;
  options: IOption[];
  status?: boolean;
}

export interface IEntryStep {
  id: string;
  name: string;
  options: {
    id: string;
    type: 'image';
    answer?: string;
  };
  questions: IQuestion[];
  status?: 'approved' | 'error' | 'clarify';
  message?: string;
  userMessage?: string;
}
