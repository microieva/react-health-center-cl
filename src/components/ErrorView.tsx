import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuth } from "../utils/AuthProvider";

export const ErrorView = ({error, title = "Unexpected error"}: {error: any, title: string }) => {
  const {isLoggedIn} = useAuth();
  const {logout} = useLogout();
  const navigate = useNavigate();

  const handleClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 rounded-lg border" style={{
          backgroundColor: '#fee2e2',
          borderColor: '#fecaca'
        }}>
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#dc2626' }}>
            {title}
          </h3>
          <p style={{ color: '#991b1b' }}>{error}</p>
          <button
            onClick={() => handleClick()}
            className="mt-4 px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: 'var(--color-accent-purple)',
              color: 'var(--color-white)fff'
            }}
          >
            Return to Home
          </button>
        </div>
      </div>
  )
}