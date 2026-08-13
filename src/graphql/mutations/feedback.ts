import { gql, type TypedDocumentNode } from '@apollo/client';
import { FEEDBACK_FRAGMENT } from '../fragments/feedback';
import type { 
  Feedback, 
  FeedbackInput,
  UpdateFeedbackInput 
} from '../../types/graphql';

// export const SUBMIT_FEEDBACK: TypedDocumentNode<
//   { submitFeedback: Feedback },
//   { input: SubmitFeedbackInput }
// > = gql`
//   mutation SubmitFeedback($input: FeedbackInput!) {
//     saveFeedback(feedbackInput: $input) {
//       ...FeedbackFields
//     }
//   }
//   ${FEEDBACK_FRAGMENT}
// `;

export const SUBMIT_FEEDBACK: TypedDocumentNode<
  { saveFeedback: { success: boolean; message: string } },
  { input: FeedbackInput }
> = gql`
  mutation SubmitFeedback($input: FeedbackInput!) {
    saveFeedback(feedbackInput: $input) {
      success
      message
    }
  }
`;

export const UPDATE_FEEDBACK: TypedDocumentNode<
  { updateFeedback: Feedback },
  { input: UpdateFeedbackInput }
> = gql`
  mutation UpdateFeedback($input: UpdateFeedbackInput!) {
    updateFeedback(input: $input) {
      ...FeedbackFields
    }
  }
  ${FEEDBACK_FRAGMENT}
`;

export const DELETE_FEEDBACK: TypedDocumentNode<
  { deleteFeedback: { id: string; success: boolean } },
  { id: string }
> = gql`
  mutation DeleteFeedback($id: ID!) {
    deleteFeedback(id: $id) {
      id
      success
    }
  }
`;