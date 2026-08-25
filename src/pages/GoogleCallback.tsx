import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { log, logError } from '../constants';
import { CircularProgress } from '@mui/material';
import { useAuth } from '../utils/AuthProvider';
import { getRedirectPath } from '../utils/utils';

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
        await handleCallback(code, state);
        
        // Clear URL parameters after successful processing
        //clearCallbackParams();
        
        // The handleCallback function handles navigation internally
        // If we get here, something went wrong
        //throw new Error('Callback processing completed but no redirect occurred');
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
        setError(errorMessage);
        logError('Google callback error', err);
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
          <p style={{ color: '#475569' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 rounded-lg border" style={{
          backgroundColor: '#fee2e2',
          borderColor: '#fecaca'
        }}>
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#dc2626' }}>
            Google Authentication Failed
          </h3>
          <p style={{ color: '#991b1b' }}>{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: '#af6faee6',
              color: '#ffffff'
            }}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
};
