import { useState, useCallback } from 'react';
import { useQuery, useSubscription } from '@apollo/client/react';
import { 
  GET_ADMIN_DASHBOARD_STATS, 
  type AdminDashboardData, 
  type AdminDashboardVariables
} from '../graphql/queries/adminDashboard';
// import { UNREAD_FEEDBACK_SUBSCRIPTION } from '../../graphql/subscriptions/feedback';
// import { UNREAD_MESSAGES_SUBSCRIPTION } from '../../graphql/subscriptions/messages';
import { log, logError } from '../constants';

interface UseAdminDashboardResult {
  stats: AdminDashboardData;
  loading: boolean;
  error: Error | null;
  isConnected: boolean;
  refetch: (variables?: Partial<AdminDashboardVariables>) => Promise<void>;
  clearError: () => void;
}

interface UseAdminDashboardOptions {
  pageIndex?: number;
  pageLimit?: number;
  sortDirection?: string;
  sortActive?: string;
  filterInput?: string;
}

export const useAdminDashboard = (
  options: UseAdminDashboardOptions = {}
): UseAdminDashboardResult => {
  const {
    pageIndex = 0,
    pageLimit = 5,
    sortDirection = 'DESC',
    sortActive = 'createdAt',
    filterInput = '',
  } = options;

  const [stats, setStats] = useState<AdminDashboardData>({
    countUnreadFeedback: 0,
    countUnreadMessages: 0,
    countMissedAppointments: 0,
    countDoctorRequests: 0,
    doctors: { length: 0, slice: [] },
  });
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);

  // Query with variables
  const { data, loading, error: queryError, refetch: refetchQuery } = useQuery(
    GET_ADMIN_DASHBOARD_STATS,
    {
      variables: {
        pageIndex,
        pageLimit,
        sortDirection,
        sortActive,
        filterInput,
      },
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
      onCompleted: (data: AdminDashboardData) => {
        if (data) {
          setStats({
            countUnreadFeedback: data.countUnreadFeedback || 0,
            countUnreadMessages: data.countUnreadMessages || 0,
            countMissedAppointments: data.countMissedAppointments || 0,
            countDoctorRequests: data.countDoctorRequests || 0,
            doctors: data.doctors || { length: 0, slice: [] },
          });
          log('Admin dashboard stats fetched:', {
            feedback: data.countUnreadFeedback,
            messages: data.countUnreadMessages,
            missedAppointments: data.countMissedAppointments,
            doctorRequests: data.countDoctorRequests,
            totalDoctors: data.doctors?.length || 0,
          });
        }
        setError(null);
      },
      onError: (err: any) => {
        const errorObj = new Error(`Failed to fetch dashboard stats: ${err.message}`);
        setError(errorObj);
        logError('Failed to fetch admin dashboard stats', err);
      },
    }
  );

  const combinedLoading = loading || isRefetching;

  // Subscriptions for real-time updates
  // useSubscription(UNREAD_FEEDBACK_SUBSCRIPTION, {
  //   onData: ({ data }) => {
  //     const newCount = data.data?.unreadFeedback;
  //     if (newCount !== undefined) {
  //       setStats((prev) => ({
  //         ...prev,
  //         countUnreadFeedback: newCount,
  //       }));
  //       setIsConnected(true);
  //       log('Real-time feedback count:', newCount);
  //     }
  //   },
  //   onError: (err) => {
  //     setIsConnected(false);
  //     logError('Feedback subscription error', err);
  //   },
  // });

  // useSubscription(UNREAD_MESSAGES_SUBSCRIPTION, {
  //   onData: ({ data }) => {
  //     const newCount = data.data?.unreadMessages;
  //     if (newCount !== undefined) {
  //       setStats((prev) => ({
  //         ...prev,
  //         countUnreadMessages: newCount,
  //       }));
  //       setIsConnected(true);
  //       log('Real-time messages count:', newCount);
  //     }
  //   },
  //   onError: (err) => {
  //     setIsConnected(false);
  //     logError('Messages subscription error', err);
  //   },
  // });

  // Refetch with optional new variables
  const refetch = useCallback(async (newVariables?: Partial<AdminDashboardVariables>): Promise<void> => {
    try {
      setIsRefetching(true);
      setError(null);
      
      const variables = {
        pageIndex,
        pageLimit,
        sortDirection,
        sortActive,
        filterInput,
        ...newVariables,
      };

      const result = await refetchQuery(variables);
      
      if (result.data) {
        setStats({
          countUnreadFeedback: result.data.countUnreadFeedback || 0,
          countUnreadMessages: result.data.countUnreadMessages || 0,
          countMissedAppointments: result.data.countMissedAppointments || 0,
          countDoctorRequests: result.data.countDoctorRequests || 0,
          doctors: result.data.doctors || { length: 0, slice: [] },
        });
        log('Dashboard stats refetched with variables:', variables);
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to refetch dashboard stats');
      setError(errorObj);
      logError('Failed to refetch dashboard stats', err);
    } finally {
      setIsRefetching(false);
    }
  }, [refetchQuery, pageIndex, pageLimit, sortDirection, sortActive, filterInput]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Extract doctors and total count
  // const doctors = stats.doctors?.slice || [];
  // const totalDoctors = stats.doctors?.length || 0;

  return {
    stats: data as AdminDashboardData,
    loading: combinedLoading,
    error: error || queryError || null,
    isConnected,
    refetch,
    clearError,
  };
};