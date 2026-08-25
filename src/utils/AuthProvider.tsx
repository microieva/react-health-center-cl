import React, { createContext, useContext, useEffect } from 'react';
import { useReactiveVar, useApolloClient } from '@apollo/client/react';
import { currentUserVar, isLoggedInVar, setAuthState } from '../apollo/reactive-vars';
import { GET_ME } from '../graphql/queries';
import type { User } from '../types';

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: User | null;
  login: (token: string, user: User | null) => Promise<void>; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  currentUser: null,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const currentUser = useReactiveVar(currentUserVar);
  const client = useApolloClient();

  const fetchUserData = async (): Promise<User | null> => {
    try {
      const { data }: { data: any } = await client.query({
        query: GET_ME,
        fetchPolicy: 'network-only'
      });
      return data?.me || null;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      return null;
    }
  };

  const login = async (token: string, user: User | null = null) => {
    localStorage.setItem('token', token);
    
    if (user) {
      setAuthState(user);
      await client.resetStore();
    } else {
      const userData = await fetchUserData();
      if (userData) {
        setAuthState(userData);
        await client.resetStore();
      } else {
        localStorage.removeItem('token');
        setAuthState(null);
        throw new Error('Failed to fetch user data');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState(null);
    client.resetStore();
  };

  // On app load, attempt to rehydrate auth state
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData()
        .then((userData) => {
          if (userData) {
            setAuthState(userData);
          } else {
            localStorage.removeItem('token');
            setAuthState(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          setAuthState(null);
        });
    }
  }, []);

  const value = { 
    isLoggedIn, 
    currentUser, 
    login, 
    logout 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};