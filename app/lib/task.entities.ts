import { IProfile } from '../store/auth/auth.types';
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

interface IMessage {
  id: number;
  body: string;
  user: string;
  user_id: number;
  created_date: string;
  created_time: string;
}

export interface IConversation {
  id: number;
  type: string;
  user_id: number;
  subject: string | null;
  user: IProfile;
  created_at: string;
  participants: number;
  messages: IMessage[];
  total_messages: number;
}
