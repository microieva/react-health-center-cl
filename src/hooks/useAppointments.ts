import { useMutation, useQuery } from "@apollo/client/react";
import { useState, useRef, useCallback, useEffect } from "react";
import { logError, log } from "../constants";
import { 
  COUNT_MISSED_APPOINTMENTS, 
  GET_PENDING_APPOINTMENTS,
  GET_PAST_APPOINTMENTS,
  GET_UPCOMING_APPOINTMENTS
} from "../graphql/queries";
import type { PaginationOptions } from "../types";
import { ACCEPT_APPOINTMENT } from "../graphql";


interface UseCountAppointmentsResult {
  count: number;
  loading: boolean;
  error: Error | null;
  isConnected: boolean;
  connectionAttempts: number;
  refetch: () => Promise<void>;
  markAsRead: () => Promise<void>;
  reconnect: () => void;
}

export const useMissedAppointments = (): UseCountAppointmentsResult => {
  //const [count, setCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionAttempts, setConnectionAttempts] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  const { data, loading, error: queryError, refetch: refetchQuery } = useQuery(COUNT_MISSED_APPOINTMENTS, {
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
    count: data?.countMissedAppointments || 0,
    loading,
    error: error || queryError || null,
    isConnected,
    connectionAttempts,
    refetch,
    markAsRead,
    reconnect,
  };
};

export const usePendingAppointments = (options: PaginationOptions) => {
  const variables = {
    pageIndex: options.pageIndex ?? 0,
    pageLimit: options.pageLimit ?? 10,
    sortActive: options.sortActive ?? 'start',
    sortDirection: options.sortDirection ?? 'DESC',
    filterInput: options.filterInput ?? null,
  };

  const { data, loading, error, refetch, fetchMore } = useQuery(GET_PENDING_APPOINTMENTS, {
    variables,
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true, 
  });

  return {
    data: data?.pendingAppointments ?? { length: 0, slice: [] },
    loading,
    error,
    refetch,
    fetchMore,
    variables,
  };
};


export const useUpcomingAppointments = (options: PaginationOptions) => {
  const variables = {
    pageIndex: options.pageIndex ?? 0,
    pageLimit: options.pageLimit ?? 10,
    sortActive: options.sortActive ?? 'start',
    sortDirection: options.sortDirection ?? 'DESC',
    filterInput: options.filterInput ?? null,
  };

  const { data, loading, error, refetch, fetchMore } = useQuery(GET_UPCOMING_APPOINTMENTS, {
    variables,
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true, 
  });

  return {
    data: data?.upcomingAppointments ?? { length: 0, slice: [] },
    loading,
    error,
    refetch,
    fetchMore,
    variables,
  };
};


export const usePastAppointments = (options: PaginationOptions) => {
  const variables = {
    pageIndex: options.pageIndex ?? 0,
    pageLimit: options.pageLimit ?? 10,
    sortActive: options.sortActive ?? 'start',
    sortDirection: options.sortDirection ?? 'DESC',
    filterInput: options.filterInput ?? null,
  };

  const { data, loading, error, refetch, fetchMore } = useQuery(GET_PAST_APPOINTMENTS, {
    variables,
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true, 
  });

  return {
    data: data?.pastAppointments ?? { length: 0, slice: [] },
    loading,
    error,
    refetch,
    fetchMore,
    variables,
  };
};


export const useAcceptAppointment = () => {
  const [mutate, { loading, error, data }] = useMutation(ACCEPT_APPOINTMENT, {
    update: (cache, { data }, { variables }) => {
      if (!data?.acceptAppointment?.success || !variables) return;

      const acceptedId = variables.appointmentId;

      cache.modify({
        fields: {
          countPendingAppointments: (existing) => Math.max(0, existing - 1),
          countUpcomingAppointments: (existing) => Math.max(0, existing + 1),
          pendingAppointments: (existing, { readField }) => {
            if (!existing?.slice) return existing;
            return {
              ...existing,
              length: Math.max(0, existing.length - 1),
              slice: existing.slice.filter(
                (ref: any) => String(readField('id', ref)) !== String(acceptedId)
              ),
            };
          },
        },
      });

      // Evict the appointment from normalized cache
      cache.evict({ id: `Appointment:${acceptedId}` });
      cache.gc();
    },
    refetchQueries: 
      [
        'GetUpcomingAppointments', 
        'GetPendingAppointments', 
        'CountPendingAppointments', 
        'CountUpcomingAppointments'
      ],
    awaitRefetchQueries: true,
  });

  const acceptAppointment = async (appointmentId: number) => {
    const response = await mutate({ variables: { appointmentId } });
    if (!response.data) throw new Error('Failed to accept appointment');
    if (!response.data.acceptAppointment.success) {
      throw new Error(
        response.data.acceptAppointment.message || 'Failed to accept appointment'
      );
    }
    return response.data.acceptAppointment;
  };

  return {
    acceptAppointment,
    loading,
    error,
    data: data?.acceptAppointment,
    isSuccess: data?.acceptAppointment?.success || false,
    message: data?.acceptAppointment?.message,
  };
};

//   const [isConnected, setIsConnected] = useState<boolean>(false);
//   const [connectionAttempts, setConnectionAttempts] = useState<number>(0);
//   const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

//   const defaultVariables: PastAppointmentsVariables = {
//     pageIndex: 0,
//     pageLimit: 10,
//     sortActive: 'start',
//     sortDirection: 'DESC',
//     filterInput: null,
//   };

//   const mergedVariables = { ...defaultVariables, ...variables };

//   const { data, loading, error: queryError, refetch: refetchQuery } = useQuery(GET_PAST_APPOINTMENTS, {
//     variables: mergedVariables,
//     fetchPolicy: 'network-only',
//     onCompleted: (data: PastAppointmentsResponse) => {
//       log('Past appointments fetched:', data?.pastAppointments?.length);
//     },
//     onError: (err: any) => {
//       logError('Failed to fetch past appointments', err);
//     },
//   });

//   // const { error: subscriptionError } = useSubscription(UNREAD_FEEDBACK_SUBSCRIPTION, {
//   //   onData: ({ data }) => {
//   //     const newCount = data.data?.countUnreadFeedback;
//   //     if (newCount !== undefined) {
//   //       //setCount(newCount);
//   //       setIsConnected(true);
//   //       setConnectionAttempts(0);
//   //       log('Real-time unread feedback count updated:', newCount);
//   //     }
//   //   },
//   //   onError: (err) => {
//   //     setIsConnected(false);
//   //     setConnectionAttempts((prev) => prev + 1);
//   //     logError('Unread feedback subscription error', err);
      
//   //     // Auto-reconnect after 5 seconds
//   //     if (reconnectTimer.current) {
//   //       clearTimeout(reconnectTimer.current);
//   //     }
//   //     reconnectTimer.current = setTimeout(() => {
//   //       log('Attempting to reconnect WebSocket...');
//   //       // Reconnection is handled by Apollo Client
//   //       setConnectionAttempts((prev) => prev + 1);
//   //     }, 5000);
//   //   },
//   //   onComplete: () => {
//   //     setIsConnected(false);
//   //     log('Unread feedback WebSocket connection closed');
//   //   },
//   // });

//   const refetch = useCallback(async (): Promise<void> => {
//     try {
//       await refetchQuery();
//     } catch (err) {
//       logError('Failed to refetch unread feedback', err);
//     }
//   }, [refetchQuery]);

//   const markAsRead = useCallback(async (): Promise<void> => {
//     try {
//       // Your mutation to mark feedback as read
//       // await markFeedbackAsRead();
//       await refetch();
//       log('Feedback marked as read');
//     } catch (err) {
//       logError('Failed to mark feedback as read', err);
//     }
//   }, [refetch]);

//   const reconnect = useCallback(() => {
//     setIsConnected(false);
//     setConnectionAttempts(0);
//     //setError(null);
//     refetch();
//     log('Manual reconnection attempted');
//   }, [refetch]);

//   // Cleanup
//   useEffect(() => {
//     return () => {
//       if (reconnectTimer.current) {
//         clearTimeout(reconnectTimer.current);
//       }
//     };
//   }, []);

//   return {
//     data: data?.pastAppointments || { length: 0, slice: [] },
//     loading,
//     error: queryError || null,
//     isConnected,
//     connectionAttempts,
//     refetch,
//     markAsRead,
//     reconnect,
//   };
// };