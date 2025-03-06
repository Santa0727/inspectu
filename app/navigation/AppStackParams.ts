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

export type HomeStackParamList = {
  Home: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Inspect: undefined;
  Profile: undefined;
  Schedule: undefined;
  Help: undefined;
};
