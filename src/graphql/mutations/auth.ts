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