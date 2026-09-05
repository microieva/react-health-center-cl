import { gql, type TypedDocumentNode } from '@apollo/client';
import type { User } from '../../types';

export interface DoctorsResponse {
  length: number;
  slice: User[];
}

export interface AdminDashboardData {
  countUnreadFeedback: number;
  countUnreadMessages: number;
  countMissedAppointments: number;
  countDoctorRequests: number;
  doctors: DoctorsResponse;
}

export interface AdminDashboardVariables {
  pageIndex: number;
  pageLimit: number;
  sortDirection?: string;
  sortActive?: string;
  filterInput?: string;
}

export const GET_ADMIN_DASHBOARD_STATS: TypedDocumentNode<
   {
    countUnreadFeedback: number;
    countUnreadMessages: number;
    countMissedAppointments: number;
    countDoctorRequests: number;
    doctors: DoctorsResponse;
  },
  AdminDashboardVariables
> = gql`
  query GetAdminDashboardStats (
      $pageIndex: Int!, 
      $pageLimit: Int!, 
      $sortDirection: String, 
      $sortActive: String,
      $filterInput: String
  ){ 
      doctors (
          pageIndex: $pageIndex, 
          pageLimit: $pageLimit,
          sortDirection: $sortDirection,
          sortActive: $sortActive,
          filterInput: $filterInput
      ){
          length
          slice {
              ... on User {
                  id
                  email
                  firstName
                  lastName
                  createdAt
              }
          }
      }
      countMissedAppointments
      countUnreadFeedback
      countDoctorRequests
      countUnreadMessages
  }
`;
