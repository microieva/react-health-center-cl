import { gql, type TypedDocumentNode } from '@apollo/client';
import { APPOINTMENT_FRAGMENT } from '../fragments/appointment';
import { RECORD_FRAGMENT } from '../fragments/record';
import type { Record, Appointment, PagedResponse, NextAppointment } from '../../types';


export interface DoctorDashboardData {
  countPendingAppointments: number;
  countUnreadMessages: number;
  countMissedAppointments: number;
  countUpcomingAppointments: number;
  nextAppointment: NextAppointment | null;
  drafts: PagedResponse<Record>;
  upcomingAppointments: PagedResponse<Appointment>;
  pastAppointments: PagedResponse<Appointment>;
}

export interface DoctorDashboardVariables {
  pageIndex: number;
  pageLimit: number;
  sortDirection: string;
  sortDirectionAppointments: string;
  sortActiveDrafts: string;
  sortActiveAppointments: string;
  filterInput: string | null;
}

export const GET_DOCTOR_DASHBOARD_STATS: TypedDocumentNode<
  DoctorDashboardData,
  DoctorDashboardVariables
> = gql`
  query GetDoctorDashboardStats(
    $pageIndex: Int!,
    $pageLimit: Int!,
    $sortDirection: String,
    $sortDirectionAppointments: String,
    $sortActiveDrafts: String,
    $sortActiveAppointments: String,
    $filterInput: String
  ) {
    countPendingAppointments
    countUnreadMessages
    countMissedAppointments
    countUpcomingAppointments
    
    nextAppointment {
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
    
    drafts(
      pageIndex: $pageIndex,
      pageLimit: $pageLimit,
      sortDirection: $sortDirection,
      sortActive: $sortActiveDrafts,
      filterInput: $filterInput
    ) {
      length
      slice {
        ...RecordFields
      }
    }
    
    upcomingAppointments(
      pageIndex: $pageIndex,
      pageLimit: $pageLimit,
      sortDirection: $sortDirectionAppointments,
      sortActive: $sortActiveAppointments,
      filterInput: $filterInput
    ) {
      ...AppointmentFields
    }
    
    pastAppointments(
      pageIndex: $pageIndex,
      pageLimit: $pageLimit,
      sortDirection: $sortDirectionAppointments,
      sortActive: $sortActiveAppointments,
      filterInput: $filterInput
    ) {
      ...AppointmentFields
    }
  }
  ${RECORD_FRAGMENT}
  ${APPOINTMENT_FRAGMENT}
`;