import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { logError } from '../constants';
import { getSignicatToken, initiateSignicatLogin, type SignicatTokenResponse } from '../services/signicat';
import { SIGNICAT_LOGIN_MUTATION } from '../graphql/mutations/auth';
import { useAuth } from '../utils/AuthProvider';

export const useBankingAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth(); 
  const [performLogin, { loading: mutationLoading }] = useMutation(SIGNICAT_LOGIN_MUTATION);

  const initiateLogin = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      initiateSignicatLogin();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start Signicat login';
      setError(errorMessage);
      logError('Signicat login initiation failed', err);
      setIsLoading(false);
    }
  };

  const handleCallback = async (code: string) => {
    setError(null);
    setIsLoading(true);

    let response:SignicatTokenResponse | null;
    try {
      response = await getSignicatToken(code);
    } catch (err) {
      response = null
      setError("No token response from signicat");
      logError('Signicat callback failed: ', err);
    }
      
      if (response) {
        try {
          const { data } = await performLogin({
            variables: {
              signicatAccessToken: response.id_token!,
              clientType: 'react'
            },
          });
          if (data) {
            if (data.loginWithSignicat.__typename === 'LoginSuccess') {
              const token = data.loginWithSignicat.token;
              login(token, null);
            } else {
              setError(data.loginWithSignicat.message);
              logError('Signicat callback failed: ', data.loginWithSignicat.message);
            } 
          }
        } catch (err) {
          setError("No response from server");
          logError('Signicat authentication failed: ', err);
        }
      }
      setIsLoading(false);
    }


  return {
    initiateLogin,
    handleCallback,
    isLoading: isLoading || mutationLoading,
    error,
  };
};