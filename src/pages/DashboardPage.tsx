import { Backdrop, CircularProgress } from "@mui/material"
import { useEffect } from "react";
import { useAuth } from "../utils/AuthProvider";
import { getRedirectPath } from "../utils/utils";
import { useNavigate } from "react-router-dom";

export const DashboardPage = () => {
  const {isLoading, currentUser} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && currentUser) {
      const url = getRedirectPath(currentUser?.userRole);
      navigate(url);
    }
  }, [navigate, isLoading, currentUser])

  return (
    <Backdrop
      sx={(theme) => ({ color: 'var(--color-white)', zIndex: theme.zIndex.drawer + 1 })}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}