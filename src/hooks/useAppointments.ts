import { useQuery, useSubscription } from "@apollo/client/react";
import { useState, useRef, useCallback, useEffect } from "react";
import { logError, log } from "../constants";
import { 
  COUNT_UPCOMING_APPOINTMENTS, 
  COUNT_MISSED_APPOINTMENTS, 
  COUNT_PENDING_APPOINTMENTS, 
  GET_PENDING_APPOINTMENTS,
  GET_PAST_APPOINTMENTS,
  GET_UPCOMING_APPOINTMENTS
} from "../graphql/queries";
import type { PagedResponse, Appointment, PaginationOptions, PagedAppointmentsResponse } from "../types";


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

interface UseGetAppointmentsResult {
  data: PagedAppointmentsResponse, //PagedResponse<Appointment>; 
  loading: boolean;
  error: Error | null;
  // isConnected: boolean;
  // connectionAttempts: number;
  refetch: () => Promise<void>;
  // markAsRead: () => Promise<void>;
  // reconnect: () => void;
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



// export const usePendingAppointments = (variables?: Partial<PendingAppointmentsVariables>): UseGetAppointmentsResult => {
//   const [isConnected, setIsConnected] = useState<boolean>(false);
//   const [connectionAttempts, setConnectionAttempts] = useState<number>(0);
//   //const [error, setError] = useState<Error | null>(null);
//   const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

//   const defaultVariables: PendingAppointmentsVariables = {
//     pageIndex: 0,
//     pageLimit: 10,
//     sortActive: 'start',
//     sortDirection: 'DESC',
//     filterInput: null,
//   };

//   const mergedVariables = { ...defaultVariables, ...variables };

//   const { data, loading, error: queryError, refetch: refetchQuery } = useQuery(GET_PENDING_APPOINTMENTS, {
//     variables: mergedVariables,
//     fetchPolicy: 'network-only',
//     onCompleted: (data: PendingAppointmentsResponse) => {
//       log('Pending appointments fetched:', data?.pendingAppointments?.length);
//     },
//     onError: (err: any) => {
//       logError('Failed to fetch pending appointments', err);
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
//     data: data?.pendingAppointments || { length: 0, slice: [] },
//     loading,
//     error: queryError || null,
//     isConnected,
//     connectionAttempts,
//     refetch,
//     markAsRead,
//     reconnect,
//   };
// };

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

// export const useUpcomingAppointments = (variables?: Partial<UpcomingAppointmentsVariables>): UseGetAppointmentsResult => {
//   const [isConnected, setIsConnected] = useState<boolean>(false);
//   const [connectionAttempts, setConnectionAttempts] = useState<number>(0);
//   const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

//   const defaultVariables: UpcomingAppointmentsVariables = {
//     pageIndex: 0,
//     pageLimit: 10,
//     sortActive: 'start',
//     sortDirection: 'DESC',
//     filterInput: null,
//   };

//   const mergedVariables = { ...defaultVariables, ...variables };

//   const { data, loading, error: queryError, refetch: refetchQuery } = useQuery(GET_UPCOMING_APPOINTMENTS, {
//     variables: mergedVariables,
//     fetchPolicy: 'network-only',
//     onCompleted: (data: UpcomingAppointmentsResponse) => {
//       log('Upcoming appointments fetched:', data?.upcomingAppointments?.length);
//     },
//     onError: (err: any) => {
//       logError('Failed to fetch upcoming appointments', err);
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
//     data: data?.upcomingAppointments || { length: 0, slice: [] },
//     loading,
//     error: queryError || null,
//     isConnected,
//     connectionAttempts,
//     refetch,
//     markAsRead,
//     reconnect,
//   };
// };



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

// export const usePastAppointments = (variables?: Partial<PastAppointmentsVariables>): UseGetAppointmentsResult => {
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