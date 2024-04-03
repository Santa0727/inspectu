export interface IName {
  id: number;
  name: string;
}

interface IValue {
  id: string;
  value: boolean;
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
}

interface ICheckedOption extends IOption {
  status: boolean;
}

interface IQuestion {
  id: string;
  name: string;
  text: string;
  options?: IOption[];
}

interface IQuestionAnswer extends IQuestion {
  options?: ICheckedOption[];
  review_flagged?: boolean;
}

export interface IEntryStep {
  id: string;
  name: string;
  questions: IQuestion[];
}

export interface IReviewStep extends IEntryStep {
  questions: IQuestionAnswer[];
  status: 'approved' | 'error' | 'clarification';
  adminMessage?: string;
}

export interface IInspectAnswer {
  question_id: string;
  compliance_status: 'c' | 'n/c' | 'n/a';
  options: IValue[];
  images?: string[];
  notes?: string;
}
