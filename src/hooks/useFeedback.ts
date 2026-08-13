import { useMutation, useQuery } from '@apollo/client/react';
import {
  GET_FEEDBACKS,
  GET_FEEDBACK
} from '../graphql/queries/feedback';
import {
  SUBMIT_FEEDBACK,
  UPDATE_FEEDBACK,
  DELETE_FEEDBACK,
} from '../graphql/mutations/feedback';
import type {
  Feedback,
  FeedbackInput,
  UpdateFeedbackInput,
  //MutationResponse,
} from '../types/graphql';

type FeedbacksResponse = {
  feedbacks: {
    items: Feedback[];
    total: number;
    hasMore: boolean;
  };
};

type FeedbackResponse = {
  feedback: Feedback;
};

export const useSubmitFeedback = () => {
  // No type arguments needed - inferred from TypedDocumentNode
  const [mutate, { loading, error, data }] = useMutation(
    SUBMIT_FEEDBACK,
    {
      // Update cache after successful mutation
      update: (cache, { data }) => {
        // Check if mutation was successful
        if (data?.saveFeedback?.success) {
          // Optionally refetch the feedbacks list
          cache.modify({
            fields: {
              feedbacks(existing = { items: [], total: 0, hasMore: false }) {
                // You can't add the feedback to the cache here because
                // the mutation doesn't return the feedback object
                // Just return existing data or trigger a refetch
                return existing;
              },
            },
          });
        }
      },
    }
  );

  const submitFeedback = async (input: FeedbackInput) => {
    const response = await mutate({ 
      variables: { input } 
    });
    
    if (!response.data) {
      throw new Error('Failed to submit feedback');
    }
    
    // Check if the mutation was successful on the server
    if (!response.data.saveFeedback.success) {
      throw new Error(response.data.saveFeedback.message || 'Failed to submit feedback');
    }
    
    return response.data.saveFeedback;
  };

  return { 
    submitFeedback, 
    loading, 
    error, 
    data: data?.saveFeedback,
    isSuccess: data?.saveFeedback?.success || false,
    message: data?.saveFeedback?.message,
  };
};

// export const useFeedbacks = (limit?: number, offset?: number) => {
//   const { data, loading, error, refetch } = useQuery<FeedbacksResponse>(
//     GET_FEEDBACKS,
//     {
//       variables: { limit, offset },
//       fetchPolicy: 'cache-and-network',
//     }
//   );

//   return {
//     feedbacks: data?.feedbacks.items || [],
//     total: data?.feedbacks.total || 0,
//     hasMore: data?.feedbacks.hasMore || false,
//     loading,
//     error,
//     refetch,
//   };
// };

// export const useFeedback = (id: string) => {
//   const { data, loading, error, refetch } = useQuery<FeedbackResponse>(
//     GET_FEEDBACK,
//     {
//       variables: { id },
//       skip: !id,
//     }
//   );

//   return { 
//     feedback: data?.feedback, 
//     loading, 
//     error, 
//     refetch 
//   };
// };

// export const useUpdateFeedback = () => {
//   const [mutate, { loading, error, data }] = useMutation(
//     UPDATE_FEEDBACK
//   );

//   const updateFeedback = async (input: UpdateFeedbackInput) => {
//     const response = await mutate({ 
//       variables: { input } 
//     });
    
//     if (!response.data) {
//       throw new Error('Failed to update feedback');
//     }
    
//     if (!response.data.updateFeedback.success) {
//       throw new Error(response.data.updateFeedback.message || 'Failed to update feedback');
//     }
    
//     return response.data.updateFeedback;
//   };

//   return { 
//     updateFeedback, 
//     loading, 
//     error, 
//     data: data?.updateFeedback,
//     isSuccess: data?.updateFeedback?.success || false,
//     message: data?.updateFeedback?.message,
//   };
// };

// export const useDeleteFeedback = () => {
//   const [mutate, { loading, error }] = useMutation(
//     DELETE_FEEDBACK,
//     {
//       update: (cache, { data }) => {
//         if (data?.deleteFeedback?.success) {
//           // Evict the deleted feedback from cache if you know the ID
//           // You would need to pass the ID to the update function
//           // This requires a different approach
//         }
//       },
//     }
//   );

//   const deleteFeedback = async (id: string) => {
//     const response = await mutate({ 
//       variables: { id } 
//     });
    
//     if (!response.data) {
//       throw new Error('Failed to delete feedback');
//     }
    
//     if (!response.data.deleteFeedback.success) {
//       throw new Error(response.data.deleteFeedback.message || 'Failed to delete feedback');
//     }
    
//     // Evict the deleted feedback from cache
//     response.data.deleteFeedback.success && cache.evict({ id: `Feedback:${id}` });
//     cache.gc();
    
//     return response.data.deleteFeedback;
//   };

//   return { 
//     deleteFeedback, 
//     loading, 
//     error 
//   };
//};