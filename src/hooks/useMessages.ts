import { useQuery, useSubscription } from "@apollo/client/react";
import { log, logError } from "../constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { COUNT_UNREAD_MESSAGES } from "../graphql/queries/messages";

interface UseUnreadMessagesResult {
  count: number;
  loading: boolean;
  error: Error | null;
  isConnected: boolean;
  connectionAttempts: number;
  refetch: () => Promise<void>;
  markAsRead: () => Promise<void>;
  reconnect: () => void;
}

export const useUnreadMessages = (): UseUnreadMessagesResult => {
  //const [count, setCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionAttempts, setConnectionAttempts] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  const { data, loading, error: queryError, refetch: refetchQuery } = useQuery(COUNT_UNREAD_MESSAGES, {
    fetchPolicy: 'network-only',
  });

  // const { error: subscriptionError } = useSubscription(UNREAD_MESSAGE_SUBSCRIPTION, {
  //   onData: ({ data }) => {
  //     const newCount = data.data?.countUnreadMessages;
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
    count: data?.countUnreadMessages || 0,
    loading,
    error: error || queryError || null,
    isConnected,
    connectionAttempts,
    refetch,
    markAsRead,
    reconnect,
  };
};