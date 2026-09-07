import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBankingAuth } from '../hooks/useBankingAuth';
import { log, logError } from '../constants';
import { CircularProgress } from '@mui/material';
import { useAuth } from '../utils/AuthProvider';
import { clearCallbackParams, getRedirectPath } from '../utils/utils';
import { ErrorView } from '../components/ErrorView';


export const SignicatCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const { handleCallback, isLoading } = useBankingAuth();
  const navigate = useNavigate();
  const { isLoggedIn, currentUser } = useAuth();

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      const redirectPath = getRedirectPath(currentUser.userRole);
      navigate(redirectPath, { replace: true });
    }
  }, [isLoggedIn, currentUser, navigate]);

  useEffect(() => {
    const processCallback = async () => {
      try {
        log('Processing Signicat callback');
        
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        if (!code || !state) {
          throw new Error('Missing code or state parameters');
        }

        await handleCallback(code);  
        clearCallbackParams();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
        setError(errorMessage);
        logError('Signicat callback error', err);
      }
    };

    processCallback();
  }, [searchParams, handleCallback]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4">
            <CircularProgress color="inherit" />
          </div>
          <p style={{ color: 'var(--color-primary-dark-gray)' }}>Logging in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorView error={error} title={"Banking authentication failed"}/>
    );
  }

  // Fallback
  return null;
};
