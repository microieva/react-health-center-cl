import { gql, type TypedDocumentNode } from '@apollo/client';
import { APPOINTMENT_FRAGMENT } from '../fragments/appointment';
import { RECORD_FRAGMENT } from '../fragments/record';
import type { Record, Appointment, PagedResponse, NextAppointment } from '../../types';


export interface PatientDashboardData {
  countPendingAppointments: number;
  countMissedAppointments: number;
  countUpcomingAppointments: number;
  countUnreadRecords: number;
  nextAppointment: NextAppointment | null;
  records: PagedResponse<Record>;
  upcomingAppointments: PagedResponse<Appointment>;
  pastAppointments: PagedResponse<Appointment>;
}

export interface PatientDashboardVariables {
  pageIndex: number;
  pageLimit: number;
  sortDirection: string;
  sortDirectionAppointments: string;
  sortActiveRecords: string;
  sortActiveAppointments: string;
  filterInput: string | null;
}

export const GET_PATIENT_DASHBOARD_STATS: TypedDocumentNode<
  PatientDashboardData,
  PatientDashboardVariables
> = gql`
  query GetPatientDashboardStats(
      $pageIndex: Int!, 
      $pageLimit: Int!, 
      $sortDirection: String, 
      $sortDirectionAppointments: String,
      $sortActiveRecords: String,  
      $sortActiveAppointments: String, 
      $filterInput: String
  ){ 
      countPendingAppointments
      countMissedAppointments
      countUpcomingAppointments
      countUnreadRecords
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
          doctor {
              id
              firstName
              lastName
              dob
          }
          patientMessage
          doctorMessage
      }
      records (
          pageIndex: $pageIndex, 
          pageLimit: $pageLimit,
          sortDirection: $sortDirection,
          sortActive: $sortActiveRecords,
          filterInput: $filterInput
      ){
          length
          slice {
              ...RecordFields
          }
      }
      upcomingAppointments (
          pageIndex: $pageIndex,
          pageLimit: $pageLimit,
          sortDirection: $sortDirectionAppointments,
          sortActive: $sortActiveAppointments,
          filterInput: $filterInput
      ) {
          ...AppointmentFields
      }
      
      pastAppointments (
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
