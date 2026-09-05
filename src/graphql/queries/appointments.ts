import { gql, type TypedDocumentNode } from "@apollo/client";

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