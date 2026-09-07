import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { log, logError } from '../constants';
import { CircularProgress } from '@mui/material';
import { useAuth } from '../utils/AuthProvider';
import { clearCallbackParams, getRedirectPath } from '../utils/utils';
import { ErrorView } from '../components/ErrorView';


export const GoogleCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const { handleCallback, isLoading } = useGoogleAuth();
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
        log('Processing Google callback');
        
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
        logError('Google callback error: ', err);
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
      <ErrorView error={error} title={"Google authentication failed"}/>
    );
  }

  // Fallback
  return null;
};
