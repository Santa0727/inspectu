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

export type MainStackParamList = {
  Home: undefined;
  Profile: undefined;
  Help: undefined;
};
