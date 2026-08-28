import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import { getRedirectPath } from "../utils/utils";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";

export const DashboardPage = () => {
  const { isLoggedIn, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(()=> {
    const url = getRedirectPath(currentUser?.userRole);
    navigate(url);
  }, [navigate, isLoggedIn, currentUser])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4">
          <CircularProgress color="inherit" />
        </div>
        <p className="text-bold">Loading...</p>
      </div>
    </div>
  );
}