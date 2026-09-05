import { useState, useCallback } from 'react';
import { useQuery, useSubscription } from '@apollo/client/react';

// import { UNREAD_MESSAGES_SUBSCRIPTION } from '../../graphql/subscriptions/messages';
// import { APPOINTMENT_UPDATES_SUBSCRIPTION } from '../../graphql/subscriptions/appointments';
import { log, logError } from '../constants';
import { GET_DOCTOR_DASHBOARD_STATS, type DoctorDashboardData, type DoctorDashboardVariables } from '../graphql/queries/doctorDashboard';
import type { Appointment, PagedResponse, Record, NextAppointment } from '../types';


interface UseDoctorDashboardResult {
  stats: {
    countPendingAppointments: number;
    countUnreadMessages: number;
    countMissedAppointments: number;
    countUpcomingAppointments: number;
    nextAppointment: NextAppointment | null;
    drafts: PagedResponse<Record>;
    upcomingAppointments: PagedResponse<Appointment>;
    pastAppointments: PagedResponse<Appointment>;
  };
  
  // Status
  loading: boolean;
  error: Error | null;
  isConnected: boolean;
  
  // Actions
  refetch: (variables?: Partial<DoctorDashboardVariables>) => Promise<void>;
  clearError: () => void;
  // Pagination helpers
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (pageIndex: number) => void;
  currentPage: number;
}

interface UseDoctorDashboardOptions {
  pageIndex?: number;
  pageLimit?: number;
  sortDirection?: string;
  sortDirectionAppointments?: string;
  sortActiveDrafts?: string;
  sortActiveAppointments?: string;
  filterInput?: string | null;
}

const DEFAULT_OPTIONS: Required<UseDoctorDashboardOptions> = {
  pageIndex: 0,
  pageLimit: 5,
  sortDirection: 'DESC',
  sortDirectionAppointments: 'ASC',
  sortActiveDrafts: 'createdAt',
  sortActiveAppointments: 'start',
  filterInput: null,
};

export const useDoctorDashboard = (
  options: UseDoctorDashboardOptions = {}
): UseDoctorDashboardResult => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  const {
    pageIndex: initialPageIndex,
    pageLimit,
    sortDirection,
    sortDirectionAppointments,
    sortActiveDrafts,
    sortActiveAppointments,
    filterInput,
  } = mergedOptions;

  const [currentPageIndex, setCurrentPageIndex] = useState<number>(initialPageIndex);
  const [stats, setStats] = useState({
    countPendingAppointments: 0,
    countUnreadMessages: 0,
    countMissedAppointments: 0,
    countUpcomingAppointments: 0,
  });
  const [nextAppointment, setNextAppointment] = useState<NextAppointment | null>(null);
  const [drafts, setDrafts] = useState<PagedResponse<Record>>({ length: 0, slice: [] });
  const [upcomingAppointments, setUpcomingAppointments] = useState<PagedResponse<Appointment>>({ length: 0, slice: [] });
  const [pastAppointments, setPastAppointments] = useState<PagedResponse<Appointment>>({ length: 0, slice: [] });
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);

  // Build variables for query - with proper types
  const getVariables = useCallback((pageIndex: number): DoctorDashboardVariables => ({
    pageIndex,
    pageLimit,
    sortDirection,
    sortDirectionAppointments,
    sortActiveDrafts,
    sortActiveAppointments,
    filterInput,
  }), [pageLimit, sortDirection, sortDirectionAppointments, sortActiveDrafts, sortActiveAppointments, filterInput]);

  // Query with proper typing
  const { data, loading, error: queryError, refetch: refetchQuery } = useQuery<
    DoctorDashboardData,
    DoctorDashboardVariables,
    any
  >(
    GET_DOCTOR_DASHBOARD_STATS,
    {
      variables: getVariables(currentPageIndex),
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
      onCompleted: (data: DoctorDashboardData) => {
        if (data) {
          setStats({
            countPendingAppointments: data.countPendingAppointments ?? 0,
            countUnreadMessages: data.countUnreadMessages ?? 0,
            countMissedAppointments: data.countMissedAppointments ?? 0,
            countUpcomingAppointments: data.countUpcomingAppointments ?? 0,
          });
          setNextAppointment(data.nextAppointment ?? null);
          setDrafts(data.drafts ?? { length: 0, slice: [] });
          setUpcomingAppointments(data.upcomingAppointments ?? { length: 0, slice: [] });
          setPastAppointments(data.pastAppointments ?? { length: 0, slice: [] });
          
          log('Doctor dashboard stats fetched:', {
            pending: data.countPendingAppointments,
            messages: data.countUnreadMessages,
            missed: data.countMissedAppointments,
            upcoming: data.countUpcomingAppointments,
            nextAppointment: data.nextAppointment?.nextId,
            draftsCount: data.drafts?.length ?? 0,
            upcomingCount: data.upcomingAppointments?.length ?? 0,
            pastCount: data.pastAppointments?.length ?? 0,
          });
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
  const refetch = useCallback(async (newVariables?: Partial<DoctorDashboardVariables>): Promise<void> => {
    try {
      setIsRefetching(true);
      setError(null);
      
      const baseVariables = getVariables(currentPageIndex);
      const variables = { ...baseVariables, ...newVariables };
      
      const result = await refetchQuery(variables);
      
      if (result.data) {
        setStats({
          countPendingAppointments: result.data.countPendingAppointments ?? 0,
          countUnreadMessages: result.data.countUnreadMessages ?? 0,
          countMissedAppointments: result.data.countMissedAppointments ?? 0,
          countUpcomingAppointments: result.data.countUpcomingAppointments ?? 0,
        });
        setNextAppointment(result.data.nextAppointment ?? null);
        setDrafts(result.data.drafts ?? { length: 0, slice: [] });
        setUpcomingAppointments(result.data.upcomingAppointments ?? { length: 0, slice: [] });
        setPastAppointments(result.data.pastAppointments ?? { length: 0, slice: [] });
        log('Doctor dashboard refetched');
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
    stats: data as DoctorDashboardData,
    // nextAppointment,
    // drafts,
    // upcomingAppointments,
    // pastAppointments,
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