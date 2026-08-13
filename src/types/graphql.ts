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
  //isAnonymous: boolean;
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