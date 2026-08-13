import { gql } from '@apollo/client';

export const FEEDBACK_FRAGMENT = gql`
  fragment FeedbackFields on Feedback {
    name
    email
    text
    isRead
    createdAt
  }
`;

export const FEEDBACK_LIST_FRAGMENT = gql`
  fragment FeedbackListFields on Feedback {
    name
    email
    text
    isRead
    createdAt
  }
`;