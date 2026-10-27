import { gql, type TypedDocumentNode } from "@apollo/client";
import { APPOINTMENT_FRAGMENT } from "../fragments/appointment";
import type { PaginationOptions, PastAppointmentsResponse, PendingAppointmentsResponse, UpcomingAppointmentsResponse } from "../../types";

export const COUNT_MISSED_APPOINTMENTS: TypedDocumentNode<
  {countMissedAppointments: number},
  Record<string, never>
> = gql`
  query CountMissedAppointments {
    countMissedAppointments
  }
`;


export const COUNT_PENDING_APPOINTMENTS: TypedDocumentNode<
  {countPendingAppointments: number},
  Record<string, never>
> = gql`
  query CountPendingAppointments {
    countPendingAppointments
  }
`;

export const COUNT_UPCOMING_APPOINTMENTS: TypedDocumentNode<
  {countUpcomingAppointments: number},
  Record<string, never>
> = gql`
  query CountUpcomingAppointments {
    countUpcomingAppointments
  }
`;

export const GET_PENDING_APPOINTMENTS: TypedDocumentNode<
  PendingAppointmentsResponse,
  PaginationOptions
> = gql`
  query GetPendingAppointments(
    $pageIndex: Int!,
    $pageLimit: Int!,
    $sortActive: String,
    $sortDirection: String,
    $filterInput: String
  ) {
    pendingAppointments(
      pageIndex: $pageIndex,
      pageLimit: $pageLimit,
      sortActive: $sortActive,
      sortDirection: $sortDirection,
      filterInput: $filterInput
    ) {
      ...AppointmentFields
    }
  }
  ${APPOINTMENT_FRAGMENT}
`;


export const GET_PAST_APPOINTMENTS: TypedDocumentNode<
  PastAppointmentsResponse,
  PaginationOptions
> = gql`
  query GetPastAppointments(
    $pageIndex: Int!,
    $pageLimit: Int!,
    $sortActive: String,
    $sortDirection: String,
    $filterInput: String
  ) {
    pastAppointments(
      pageIndex: $pageIndex,
      pageLimit: $pageLimit,
      sortActive: $sortActive,
      sortDirection: $sortDirection,
      filterInput: $filterInput
    ) {
      ...AppointmentFields
    }
  }
  ${APPOINTMENT_FRAGMENT}`;



export const GET_UPCOMING_APPOINTMENTS: TypedDocumentNode<
  UpcomingAppointmentsResponse,
  PaginationOptions
> = gql`
  query GetUpcomingAppointments(
    $pageIndex: Int!,
    $pageLimit: Int!,
    $sortActive: String,
    $sortDirection: String,
    $filterInput: String
  ) {
    upcomingAppointments(
      pageIndex: $pageIndex,
      pageLimit: $pageLimit,
      sortActive: $sortActive,
      sortDirection: $sortDirection,
      filterInput: $filterInput
    ) {
      ...AppointmentFields
    }
  }
  ${APPOINTMENT_FRAGMENT}`;
