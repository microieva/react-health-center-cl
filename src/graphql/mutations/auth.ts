import { gql, type TypedDocumentNode } from "@apollo/client";
import type { LoginResponse } from "../../types";
import { LOGIN_FAILURE_FRAGMENT, LOGIN_SUCCESS_FRAGMENT } from "../fragments";

export const LOGIN_MUTATION: TypedDocumentNode<
  { login: LoginResponse },
  { email: string; password: string }
> = gql`
  mutation Login($email: String!, $password: String!) {
    login(directLoginInput: { email: $email, password: $password }) {
      ... on LoginSuccess {
        ...LoginSuccessFields
      }
      ... on LoginFailure {
        ...LoginFailureFields
      }
    }
  }
  ${LOGIN_SUCCESS_FRAGMENT}
  ${LOGIN_FAILURE_FRAGMENT}
`;

export const SIGNICAT_LOGIN_MUTATION: TypedDocumentNode<
  { loginWithSignicat: LoginResponse },
  { signicatAccessToken: string, clientType: string }
> = gql`
  mutation SignicatLogin($signicatAccessToken: String!, $clientType: String) {
    loginWithSignicat(signicatAccessToken: $signicatAccessToken, clientType: $clientType) {
      ... on LoginSuccess {
        ...LoginSuccessFields
      }
      ... on LoginFailure {
        ...LoginFailureFields
      }
    }
  }
  ${LOGIN_SUCCESS_FRAGMENT}
  ${LOGIN_FAILURE_FRAGMENT}
`;

export const GOOGLE_LOGIN_MUTATION: TypedDocumentNode<
  { loginWithGoogle: LoginResponse },
  { googleCredential: string, clientType: string }
> = gql`
  mutation GoogleLogin($googleCredential: String!, $clientType: String) {
    loginWithGoogle(googleCredential: $googleCredential, clientType: $clientType) {
      ... on LoginSuccess {
        ...LoginSuccessFields
      }
      ... on LoginFailure {
        ...LoginFailureFields
      }
    }
  }
  ${LOGIN_SUCCESS_FRAGMENT}
  ${LOGIN_FAILURE_FRAGMENT}
`;

export const LOGOUT_MUTATION: TypedDocumentNode<
  { logOut: void | null },
  Record<string, never> 
> = gql`
  mutation Logout {
    logOut
  }
`;