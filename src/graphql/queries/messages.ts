import { gql, type TypedDocumentNode } from "@apollo/client";

export const COUNT_UNREAD_MESSAGES: TypedDocumentNode<
  {countUnreadMessages: number},
  Record<string, never>
> = gql`
  query CountUnreadMessages {
    countUnreadMessages
  }
`;