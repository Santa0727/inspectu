export interface IName {
  id: number;
  name: string;
}

interface IVisit {
  name: string;
  date: string;
}

export interface ISchool {
  id: number;
  name: string;
  district_id: number;
  phone: string;
  email: string;
  address: string;
  location: string;
  notes: string | null;
  visit: IVisit | null;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  schools: ISchool[];
  roles: IName[];
}

export interface IInspection {
  id: number;
  name: string;
  status: 'publish' | 'pending_review' | 'review_required' | 'approved';
  due_date: string;
  school_id: number;
  school: ISchool;
}

interface IOption {
  id: string;
  name: string;
  qType: 'NA' | 'NC';
  answer?: boolean;
}

interface IQuestion {
  id: string;
  name: string;
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
