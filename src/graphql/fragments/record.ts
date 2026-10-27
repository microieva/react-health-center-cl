import { gql } from '@apollo/client';
import { USER_FRAGMENT } from './user';

export const RECORD_FRAGMENT = gql`
  fragment RecordFields on Record {
    id
    title
    draft
    text
    patient {
      ...UserFields
    }
    doctor {
      ...UserFields
    }
    createdAt
  }
  ${USER_FRAGMENT}
`;