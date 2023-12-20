export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type InspectStackParamList = {
  Inspections: undefined;
  InspectEntry: { inspectID: number };
  PostDetail: { inspectID: number };
  InspectReview: { inspectID: number; stepID: string };
};

export type MainStackParamList = {
  Inspect: undefined;
  Profile: undefined;
  Schedule: undefined;
  Help: undefined;
};
