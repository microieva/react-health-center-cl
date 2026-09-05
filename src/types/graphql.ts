export interface Feedback {
  name:string
  email:string
  text:string
  isRead:boolean
  createdAt:string
}


export interface FeedbackInput {
  text: string;
  email?: string | null;
  name?: string | null;
}

export interface UpdateFeedbackInput {
  id: string;
  text?: string | null;
  email?: string | null;
  name?: string | null;
  isAnonymous?: boolean | null;
}

export interface FeedbacksResponse {
  feedbacks: {
    items: Feedback[];
    total: number;
    hasMore: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userRole: string;
  lastLogOutAt?: string;
  createdAt: string;
  dob: string;
}

export interface LoginSuccess {
  __typename: 'LoginSuccess';
  token: string;
  expiresAt: string;
  user: User;
}

export interface LoginFailure {
  __typename: 'LoginFailure';
  message: string;
}

export type LoginResponse = LoginSuccess | LoginFailure;

export interface PagedResponse<T = any> {
  length: number;
  slice: T[];
}


export interface Record {
  id: string;
  title: string;
  patient: User;
  createdAt: string;
}

export interface Appointment {
  id: string;
  start: string;
  end: string;
  patient: User;
}


export interface NextAppointment {
  nextId: string;
  nextStart: string;
  nextEnd: string;
  previousAppointmentDate: string;
  recordIds: string[];
  patient: User;
  patientMessage: string;
  doctorMessage: string;
}