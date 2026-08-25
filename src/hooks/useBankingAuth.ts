import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { logError } from '../constants';
import { getSignicatToken, initiateSignicatLogin } from '../services/signicat';
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
    
    try {
      const tokenResponse = await getSignicatToken(code);
      
      const { data } = await performLogin({
        variables: {
          signicatAccessToken: tokenResponse.id_token!,
          clientType: 'react'
        },
      });
      
      if (!data?.loginWithSignicat) {
        throw new Error('No response from loginWithSignicat');
      }
      if (data.loginWithSignicat.__typename === 'LoginSuccess') {
        const token = data.loginWithSignicat.token;
        login(token, null);
      }  
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete Signicat login';
      setError(errorMessage);
      logError('Signicat callback failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initiateLogin,
    handleCallback,
    isLoading: isLoading || mutationLoading,
    error,
  };
};