import { gql } from '@apollo/client';

export const APPOINTMENT_FRAGMENT = gql`
  fragment AppointmentFields on Paged {
    length
    slice {
      ... on Appointment {
        id
        start
        end
        patient {
          id
          firstName
          lastName
        }
      }
    }
  }
`;