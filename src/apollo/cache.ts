import { InMemoryCache } from '@apollo/client';

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Add field policies here if needed
      },
    },
  },
});