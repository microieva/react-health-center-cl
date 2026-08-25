import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useApolloClient } from '@apollo/client/react';
import { useAuth } from '../utils/AuthProvider';
import { LOGOUT_MUTATION } from '../graphql/mutations/auth';
import { log, logError } from '../constants';

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout: authLogout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const client = useApolloClient();

  const [performLogout, { loading: mutationLoading }] = useMutation(LOGOUT_MUTATION);

  const handleLogout = async (redirectPath: string = '/login') => {
    if (!isLoggedIn) {
      setError('⚠️ Logout called but user is not logged in');
      navigate(redirectPath, { replace: true });
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await performLogout();
      authLogout();
      await client.resetStore();
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
      sessionStorage.clear();
      log('Logout successful');
      navigate('/', { replace: true });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during logout';
      setError(errorMessage);
      logError('Logout failed', err);

      // Even if there's an error, we should still clear local state
      // to prevent the user from being stuck in a logged-in state
      log('⚠️ Logout error occurred but clearing local state...');
      try {
        authLogout();
        await client.resetStore();
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiresAt');
        navigate(redirectPath, { replace: true });
      } catch (cleanupError) {
        log('❌ Cleanup after logout error failed:', cleanupError);
        // Force navigation even if cleanup fails
        navigate(redirectPath, { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout: handleLogout,
    isLoading: isLoading || mutationLoading,
    error,
    clearError: () => setError(null),
  };
};