import { gql } from "@apollo/client";

export const LOGIN_SUCCESS_FRAGMENT = gql`
  fragment LoginSuccessFields on LoginSuccess {
    token
    expiresAt
  }
`;

export const LOGIN_FAILURE_FRAGMENT = gql`
  fragment LoginFailureFields on LoginFailure {
    message
  }
`;