import { useMutation, useQuery, useSubscription } from '@apollo/client/react';
import {
  COUNT_UNREAD_FEEDBACK
} from '../graphql/queries/feedback';
import {
  SUBMIT_FEEDBACK,
} from '../graphql/mutations/feedback';
import type {
  FeedbackInput,
} from '../types/graphql';
import { useState, useRef, useCallback, useEffect } from 'react';
//import { UNREAD_FEEDBACK_SUBSCRIPTION } from '../graphql/subscriptions/feedback';
import { log, logError } from '../constants';

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

interface UseUnreadFeedbackResult {
  count: number;
  loading: boolean;
  error: Error | null;
  isConnected: boolean;
  connectionAttempts: number;
  refetch: () => Promise<void>;
  markAsRead: () => Promise<void>;
  reconnect: () => void;
}

export const useUnreadFeedback = (): UseUnreadFeedbackResult => {
  //const [count, setCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionAttempts, setConnectionAttempts] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  const { data, loading, error: queryError, refetch: refetchQuery } = useQuery(COUNT_UNREAD_FEEDBACK, {
    fetchPolicy: 'network-only',
  });

  // const { error: subscriptionError } = useSubscription(UNREAD_FEEDBACK_SUBSCRIPTION, {
  //   onData: ({ data }) => {
  //     const newCount = data.data?.countUnreadFeedback;
  //     if (newCount !== undefined) {
  //       //setCount(newCount);
  //       setIsConnected(true);
  //       setConnectionAttempts(0);
  //       log('Real-time unread feedback count updated:', newCount);
  //     }
  //   },
  //   onError: (err) => {
  //     setIsConnected(false);
  //     setConnectionAttempts((prev) => prev + 1);
  //     logError('Unread feedback subscription error', err);
      
  //     // Auto-reconnect after 5 seconds
  //     if (reconnectTimer.current) {
  //       clearTimeout(reconnectTimer.current);
  //     }
  //     reconnectTimer.current = setTimeout(() => {
  //       log('Attempting to reconnect WebSocket...');
  //       // Reconnection is handled by Apollo Client
  //       setConnectionAttempts((prev) => prev + 1);
  //     }, 5000);
  //   },
  //   onComplete: () => {
  //     setIsConnected(false);
  //     log('Unread feedback WebSocket connection closed');
  //   },
  // });

  const refetch = useCallback(async (): Promise<void> => {
    try {
      await refetchQuery();
    } catch (err) {
      logError('Failed to refetch unread feedback', err);
    }
  }, [refetchQuery]);

  const markAsRead = useCallback(async (): Promise<void> => {
    try {
      // Your mutation to mark feedback as read
      // await markFeedbackAsRead();
      await refetch();
      log('Feedback marked as read');
    } catch (err) {
      logError('Failed to mark feedback as read', err);
    }
  }, [refetch]);

  const reconnect = useCallback(() => {
    setIsConnected(false);
    setConnectionAttempts(0);
    setError(null);
    refetch();
    log('Manual reconnection attempted');
  }, [refetch]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
    };
  }, []);

  return {
    count: data?.countUnreadFeedback || 0,
    loading,
    error: error || queryError || null,
    isConnected,
    connectionAttempts,
    refetch,
    markAsRead,
    reconnect,
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