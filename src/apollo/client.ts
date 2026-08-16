import { 
  ApolloClient, 
  ApolloLink, 
  HttpLink, 
  from,
  InMemoryCache,
} from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';


// Environment variables
const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';

// Create HTTP link
const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  //credentials: 'same-origin',
  credentials: 'include',
});

// Authentication link
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');
  
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }));
  
  return forward(operation);
});

const errorLink = new ErrorLink((error: any) => {
  const { graphQLErrors, networkError } = error

  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }: { message: string; locations: any; path: any }) => {
      // eslint-disable-next-line no-console
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    })
  }
  if (networkError) {
    // eslint-disable-next-line no-console
    console.error(`[Network error]: ${networkError}`)
  }
})

export const client = new ApolloClient({
  link: from([authLink, httpLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Utility functions
export const clearCache = () => client.cache.reset();

export const refetchQueries = () => client.refetchQueries({ include: 'active' });