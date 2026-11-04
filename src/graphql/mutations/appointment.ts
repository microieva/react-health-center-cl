import { gql, type TypedDocumentNode } from "@apollo/client";

export const ACCEPT_APPOINTMENT: TypedDocumentNode<
  { acceptAppointment: { success: boolean; message: string } },
  { appointmentId: number }
> = gql`
  mutation AcceptAppointment($appointmentId: Int!) {
    acceptAppointment(appointmentId: $appointmentId) {
      success
      message
    }
  }
`;