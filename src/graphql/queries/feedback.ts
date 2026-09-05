import { gql, type TypedDocumentNode } from '@apollo/client';
import { FEEDBACK_FRAGMENT } from '../fragments/feedback';
import type { Feedback } from '../../types/graphql';

export const COUNT_UNREAD_FEEDBACK: TypedDocumentNode<
  {countUnreadFeedback: number},
  Record<string, never>
> = gql`
  query CountUnreadFeedback {
    countUnreadFeedback
  }
`;

export const GET_FEEDBACKS: TypedDocumentNode<
  { feedbacks: { items: Feedback[]; total: number; hasMore: boolean } },
  { limit?: number; offset?: number }
> = gql`
  query GetFeedbacks($limit: Int, $offset: Int) {
    feedbacks(limit: $limit, offset: $offset) {
      items {
        ...FeedbackFields
      }
      total
      hasMore
    }
  }
  ${FEEDBACK_FRAGMENT}
`;

export const GET_FEEDBACK: TypedDocumentNode<
  { feedback: Feedback },
  { id: string }
> = gql`
  query GetFeedback($id: ID!) {
    feedback(id: $id) {
      ...FeedbackFields
    }
  }
  ${FEEDBACK_FRAGMENT}
`;