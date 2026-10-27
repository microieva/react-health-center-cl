import { Pending, CheckCircle } from "@mui/icons-material";
import type { Appointment } from "../types";

export const getStatusIcon = (appointment: Appointment) => {
  if (appointment.doctor) {
    return <CheckCircle sx={{ color: 'var(--color-primary-light-gray)', fontSize: 16 }} />;
  }
  return <Pending sx={{ color: 'var(--color-primary-slate-gray)', fontSize: 16 }} />;
};