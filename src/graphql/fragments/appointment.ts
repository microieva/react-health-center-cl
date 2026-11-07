import { gql, type TypedDocumentNode } from '@apollo/client';
import { USER_FRAGMENT } from './user';
import type { NextAppointment } from '../../types';

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

export const NEXT_APPOINTMENT_FRAGMENT: TypedDocumentNode<NextAppointment> = gql`
  fragment NextAppointmentFragment on NextAppointmentResponse {
    nextId
    nextStart
    nextEnd
    previousAppointmentDate
    recordIds
    patient {
      id
      firstName
      lastName
      dob
    }
    patientMessage
    doctorMessage
  }
`;