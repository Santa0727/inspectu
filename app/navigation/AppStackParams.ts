import { IConversation } from '../lib/task.entities';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type HomeStackParamList = {
  Inspections: undefined;
  Schedule: undefined;
  InspectEntry: { inspectID: number };
  InspectReview: { inspectID: number };
  School: { schoolID: number };
  MyTasks: undefined;
};

export type MessageStackParamList = {
  Messages: undefined;
  MessageDetail: { conversation: IConversation };
};

export type MainStackParamList = {
  Home: undefined;
  Message: undefined;
  Profile: undefined;
  Help: undefined;
};
