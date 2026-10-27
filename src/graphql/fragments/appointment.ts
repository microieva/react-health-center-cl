import { gql } from '@apollo/client';
import { USER_FRAGMENT } from './user';

export const APPOINTMENT_FRAGMENT = gql`
  fragment AppointmentFields on Paged {
    length
    slice {
      ... on Appointment {
        id
        start
        end
        patient {
          ...UserFields
        }
        doctor {
          ...UserFields
        }
        patientMessage
        doctorMessage
        createdAt
        updatedAt
        recordId
        record {
          id
          createdAt
          title
          text
          draft
        }
      }
    }
  }
  ${USER_FRAGMENT}
`;