import { gql, type TypedDocumentNode } from '@apollo/client';

interface FeedbackSubscriptionResponse {
  feedbackCount: number;
}

export const UNREAD_FEEDBACK_SUBSCRIPTION: TypedDocumentNode<
  { countUnreadFeedback: number },
  Record<string, never>
> = gql`
  subscription OnUnreadFeedbackChanged {
    unreadFeedback
  }
`;

// Alternative: Subscribe to new feedback events
export const NEW_FEEDBACK_SUBSCRIPTION: TypedDocumentNode<
  { newFeedback: { id: string; message: string; createdAt: string } },
  Record<string, never>
> = gql`
  subscription OnNewFeedback {
    newFeedback {
      id
      message
      createdAt
    }
  }
`;