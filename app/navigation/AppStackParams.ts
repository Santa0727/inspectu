export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type InspectStackParamList = {
  Inspections: undefined;
  InspectEntry: { inspectID: number };
  InspectReview: { inspectID: number };
  School: { schoolID: number };
};

export type MainStackParamList = {
  Inspect: undefined;
  Profile: undefined;
  Schedule: undefined;
  Help: undefined;
};
