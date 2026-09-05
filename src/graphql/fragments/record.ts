import { gql } from '@apollo/client';

export const RECORD_FRAGMENT = gql`
  fragment RecordFields on Record {
    id
    title
    patient {
      id
      firstName
      lastName
    }
    createdAt
  }
`;