import { Backdrop, CircularProgress } from "@mui/material";
import { useAuth } from "../utils/AuthProvider";
import { useEffect } from "react";
import { getRedirectPath } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

export const AuthLogin = () => {
  const { isLoggedIn, currentUser } = useAuth();
  const { loading } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      const redirectPath = getRedirectPath(currentUser.userRole);
      navigate(redirectPath, { replace: true });
    }
  }, [isLoggedIn, currentUser, navigate]);
  
  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: 'var(--color-white)', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}