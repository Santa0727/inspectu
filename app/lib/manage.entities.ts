import { IName, IValue } from './general.entities';

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
  answer: boolean;
}

interface IQuestion {
  id: string;
  name: string;
  type: TQuestionType;
  text: string;
  options?: IOption[];
}

export type TQuestionType =
  | 'compliance'
  | 'text'
  | 'multitext'
  | 'checkbox'
  | 'radio'
  | 'image';

interface IQuestionAnswer extends IQuestion {
  options?: ICheckedOption[];
  compliance_status?: 'c' | 'n/c' | 'n/a';
  review_flagged?: boolean;
  images?: string[];
  notes?: string;
}

export interface IEntryStep {
  id: string;
  name: string;
  questions: IQuestion[];
}

export interface IReviewStep extends IEntryStep {
  questions: IQuestionAnswer[];
  status: 'approved' | 'error' | 'clarify';
  adminMessage?: string;
}

export interface IInspectAnswer {
  question_id: string;
  compliance_status?: 'c' | 'n/c' | 'n/a';
  options: IValue[];
  images?: string[];
  notes?: string;
}
