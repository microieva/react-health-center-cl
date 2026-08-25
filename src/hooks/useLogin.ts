import { useMutation } from '@apollo/client/react';
import { useState } from 'react';
import { LOGIN_MUTATION } from '../graphql/mutations/auth';
import { useAuth } from '../utils/AuthProvider';

export const useLogin = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  const [performLogin, { loading, data, called }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    
    try {
      const { data } = await performLogin({ 
        variables: { email, password } 
      });

      if (!data?.login) {
        setError('No response from server');
        return;
      }

      if (data.login.__typename === 'LoginSuccess') {
        const { token } = data.login;
        login(token, null);
        return { success: true, data: data.login };
      } 
      
      if (data.login.__typename === 'LoginFailure') {
        setError(data.login.message);
        return { success: false, error: data.login.message };
      }
      setError('Unexpected response from server');
      return { success: false, error: 'Unexpected response' };
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    login: handleLogin,
    loading,
    error,
    data: data?.login,
    called
  };
};