import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import { getRedirectPath } from "../utils/utils";
import { CircularProgress } from "@mui/material";

export const DashboardPage = () => {
  const { isLoggedIn, currentUser } = useAuth();
  const navigate = useNavigate();

  if (isLoggedIn) {
    const url = getRedirectPath(currentUser?.userRole);
    navigate(url);
  }
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