// apollo/reactive-vars.ts
import { makeVar } from "@apollo/client";

// Define the shape of your user object
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

// Create reactive variables
export const isLoggedInVar = makeVar<boolean>(false);
export const currentUserVar = makeVar<User | null>(null);

// Helper to set auth state
export const setAuthState = (user: User | null) => {
  if (user) {
    isLoggedInVar(true);
    currentUserVar(user);
  } else {
    isLoggedInVar(false);
    currentUserVar(null);
  }
};