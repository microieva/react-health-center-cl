import { useState, useCallback } from 'react';
import { useQuery, useSubscription } from '@apollo/client/react';

// import { UNREAD_MESSAGES_SUBSCRIPTION } from '../../graphql/subscriptions/messages';
// import { APPOINTMENT_UPDATES_SUBSCRIPTION } from '../../graphql/subscriptions/appointments';
import { log, logError } from '../constants';
import { GET_PATIENT_DASHBOARD_STATS, type PatientDashboardData, type PatientDashboardVariables } from '../graphql/queries/patientDashboard';
import type { Appointment, PagedResponse, Record, NextAppointment } from '../types';


interface UsePatientDashboardResult {
  stats: {
    countPendingAppointments: number;
    countMissedAppointments: number;
    countUpcomingAppointments: number;
    countUnreadRecords: number;
    nextAppointment: NextAppointment | null;
    records: PagedResponse<Record>;
    upcomingAppointments: PagedResponse<Appointment>;
    pastAppointments: PagedResponse<Appointment>;
  };
  
  // Status
  loading: boolean;
  error: Error | null;
  isConnected: boolean;
  
  // Actions
  refetch: (variables?: Partial<PatientDashboardVariables>) => Promise<void>;
  clearError: () => void;
  // Pagination helpers
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (pageIndex: number) => void;
  currentPage: number;
}

interface UsePatientDashboardOptions {
  pageIndex?: number;
  pageLimit?: number;
  sortDirection?: string;
  sortDirectionAppointments?: string;
  sortActiveRecords?: string;
  sortActiveAppointments?: string;
  filterInput?: string | null;
}

const DEFAULT_OPTIONS: Required<UsePatientDashboardOptions> = {
  pageIndex: 0,
  pageLimit: 5,
  sortDirection: 'DESC',
  sortDirectionAppointments: 'ASC',
  sortActiveAppointments: 'start',
  sortActiveRecords: 'createdAt',
  filterInput: null,
};

export const usePatientDashboard = (
  options: UsePatientDashboardOptions = {}
): UsePatientDashboardResult => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  const {
    pageIndex: initialPageIndex,
    pageLimit,
    sortDirection,
    sortActiveRecords,
    sortDirectionAppointments,
    sortActiveAppointments,
    filterInput,
  } = mergedOptions;

  const [currentPageIndex, setCurrentPageIndex] = useState<number>(initialPageIndex);
  // const [stats, setStats] = useState({
  //   countPendingAppointments: 0,
  //   countUnreadMessages: 0,
  //   countMissedAppointments: 0,
  //   countUpcomingAppointments: 0,
  // });
  // const [nextAppointment, setNextAppointment] = useState<NextAppointment | null>(null);
  // const [drafts, setDrafts] = useState<PagedResponse<Record>>({ length: 0, slice: [] });
  // const [upcomingAppointments, setUpcomingAppointments] = useState<PagedResponse<Appointment>>({ length: 0, slice: [] });
  // const [pastAppointments, setPastAppointments] = useState<PagedResponse<Appointment>>({ length: 0, slice: [] });
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);

  // Build variables for query - with proper types
  const getVariables = useCallback((pageIndex: number): PatientDashboardVariables => ({
    pageIndex,
    pageLimit,
    sortDirection,
    sortDirectionAppointments,
    sortActiveAppointments,
    sortActiveRecords,
    filterInput,
  }), [pageLimit, sortDirection, sortDirectionAppointments, sortActiveAppointments, sortActiveRecords, filterInput]);

  // Query with proper typing
  const { data, loading, error: queryError, refetch: refetchQuery } = useQuery<
    PatientDashboardData,
    PatientDashboardVariables,
    any
  >(
    GET_PATIENT_DASHBOARD_STATS,
    {
      variables: getVariables(currentPageIndex),
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
      onCompleted: (data: PatientDashboardData) => {
        if (data) {
          console.log('DATA ---- ', data)
          // setStats({
          //   countPendingAppointments: data.countPendingAppointments ?? 0,
          //   countMissedAppointments: data.countMissedAppointments ?? 0,
          //   countUpcomingAppointments: data.countUpcomingAppointments ?? 0,
          // });
          // setNextAppointment(data.nextAppointment ?? null);
          // setDrafts(data.drafts ?? { length: 0, slice: [] });
          // setUpcomingAppointments(data.upcomingAppointments ?? { length: 0, slice: [] });
          // setPastAppointments(data.pastAppointments ?? { length: 0, slice: [] });
        }
        setError(null);
      },
      onError: (err: any) => {
        const errorObj = new Error(`Failed to fetch dashboard stats: ${err.message}`);
        setError(errorObj);
        logError('Failed to fetch doctor dashboard stats', err);
      },
    }
  );

  const combinedLoading = loading || isRefetching;

  // Subscriptions
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

  // // Optional: Appointment updates subscription
  // useSubscription(APPOINTMENT_UPDATES_SUBSCRIPTION, {
  //   onData: ({ data }) => {
  //     const updates = data.data?.appointmentUpdates;
  //     if (updates) {
  //       setStats((prev) => ({
  //         ...prev,
  //         countPendingAppointments: updates.pendingCount ?? prev.countPendingAppointments,
  //         countUpcomingAppointments: updates.upcomingCount ?? prev.countUpcomingAppointments,
  //         countMissedAppointments: updates.missedCount ?? prev.countMissedAppointments,
  //       }));
  //       refetchQuery(getVariables(currentPageIndex));
  //       setIsConnected(true);
  //       log('Real-time appointment updates:', updates);
  //     }
  //   },
  //   onError: (err) => {
  //     setIsConnected(false);
  //     logError('Appointment subscription error', err);
  //   },
  // });

  // Refetch with optional new variables
  const refetch = useCallback(async (newVariables?: Partial<PatientDashboardVariables>): Promise<void> => {
    try {
      setIsRefetching(true);
      setError(null);
      
      const baseVariables = getVariables(currentPageIndex);
      const variables = { ...baseVariables, ...newVariables };
      
      const result = await refetchQuery(variables);
      
      if (result.data) {
        // setStats({
        //   countPendingAppointments: result.data.countPendingAppointments ?? 0,
        //   countMissedAppointments: result.data.countMissedAppointments ?? 0,
        //   countUpcomingAppointments: result.data.countUpcomingAppointments ?? 0,
        // });
        // setNextAppointment(result.data.nextAppointment ?? null);
        // setDrafts(result.data.drafts ?? { length: 0, slice: [] });
        // setUpcomingAppointments(result.data.upcomingAppointments ?? { length: 0, slice: [] });
        // setPastAppointments(result.data.pastAppointments ?? { length: 0, slice: [] });
        log('Patient dashboard refetched');
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to refetch dashboard stats');
      setError(errorObj);
      logError('Failed to refetch doctor dashboard stats', err);
    } finally {
      setIsRefetching(false);
    }
  }, [refetchQuery, getVariables, currentPageIndex]);

  // Pagination helpers
  const nextPage = useCallback(() => {
    const newPageIndex = currentPageIndex + 1;
    setCurrentPageIndex(newPageIndex);
    refetch({ pageIndex: newPageIndex });
  }, [currentPageIndex, refetch]);

  const previousPage = useCallback(() => {
    if (currentPageIndex > 0) {
      const newPageIndex = currentPageIndex - 1;
      setCurrentPageIndex(newPageIndex);
      refetch({ pageIndex: newPageIndex });
    }
  }, [currentPageIndex, refetch]);

  const goToPage = useCallback((pageIndex: number) => {
    if (pageIndex >= 0) {
      setCurrentPageIndex(pageIndex);
      refetch({ pageIndex });
    }
  }, [refetch]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    stats: data as PatientDashboardData,
    loading: combinedLoading,
    error: error ?? queryError ?? null,
    isConnected,
    refetch,
    clearError,
    nextPage,
    previousPage,
    goToPage,
    currentPage: currentPageIndex,
  };
};