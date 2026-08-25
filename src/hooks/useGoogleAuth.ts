import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useAuth } from '../utils/AuthProvider';
import { 
  initiateGoogleLogin, 
  getGoogleToken
} from '../services/google';
import { GOOGLE_LOGIN_MUTATION } from '../graphql/mutations/auth';
import { env, log, logError } from '../constants';

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const [performLogin, { loading: mutationLoading }] = useMutation(GOOGLE_LOGIN_MUTATION);

  const initiateLogin = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      log('Initiating Google login flow');
      initiateGoogleLogin();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start Google login';
      setError(errorMessage);
      logError('Google login initiation failed', err);
      setIsLoading(false);
    }
  };

  const handleCallback = async (code: string, state: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      log('Processing Google callback');
      const tokenResponse = await getGoogleToken(code, state);
      log('Google token received');
      const { data } = await performLogin({
        variables: {
          googleCredential: tokenResponse.id_token,
          clientType: env.clientType,
        },
      });
      
      if (!data?.loginWithGoogle) {
        throw new Error('No response from loginWithGoogle');
      }
      
      const response = data.loginWithGoogle;
      
      if (response.__typename === 'LoginSuccess') {
        const { token, user } = response;
        login(token, user);
      } else if (response.__typename === 'LoginFailure') {
        setError(response.message);
        logError('Google login failed', response.message);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete Google login';
      setError(errorMessage);
      logError('Google callback failed', err);
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