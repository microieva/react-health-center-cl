import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useAuth } from '../utils/AuthProvider';
import { 
  initiateGoogleLogin, 
  getGoogleToken,
  type GoogleTokenResponse
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

  const handleCallback = async (code: string) => {
    setError(null);
    setIsLoading(true);

    let response: GoogleTokenResponse | null;

    try {
      response = await getGoogleToken(code);
    } catch (err) {
      response = null;
      setError("No token response from google");
      logError('Google token response failed: ', err);
    }

    if (response) {
      try {
        const { data } = await performLogin({
          variables: {
            googleCredential: response.id_token,
            clientType: env.clientType,
          },
        });

        if (data) {
          if (data.loginWithGoogle.__typename === 'LoginSuccess') {
            const { token, user } = data.loginWithGoogle;
            login(token, user);
          } else if (data.loginWithGoogle.__typename === 'LoginFailure') {
            setError(data.loginWithGoogle.message);
            logError('Google login failed', data.loginWithGoogle.message);
          }
        }
      } catch (err) {
        setError("No response from server");
        logError('Google authentication failed: ', err);
      }
    }
    setIsLoading(false);
  };

  return {
    initiateLogin,
    handleCallback,
    isLoading: isLoading || mutationLoading,
    error,
  };
};