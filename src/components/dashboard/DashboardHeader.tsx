import { useEffect, useState } from "react";
import { formatDate, formatTime } from "../../utils/utils"
import { useAuth } from "../../utils/AuthProvider";
import { capitalize } from "@mui/material"
import { UserPlus } from "lucide-react";

export const DashboardHeader = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const {currentUser} = useAuth();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
    
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1 mb-2">
              {/* Left - Greeting */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary-deep-blue)' }}>
                  {capitalize(currentUser!.userRole)} Dashboard
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm" style={{ color: 'var(--color-primary-slate-gray)' }}>
                    {formatDate(currentDateTime)}
                  </p>
                  <span className="text-sm" style={{ color: 'var(--color-primary-slate-gray)' }}>•</span>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-primary-deep-blue)' }}>
                    {formatTime(currentDateTime)}
                  </p>
                </div>
              </div>
    
              {/* Right - Actions */}
              {currentUser?.userRole === 'patient' && <div className="flex items-center gap-3">
                <button
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                  style={{
                    backgroundColor: 'var(--color-accent-purple)',
                    color: 'var(--color-white)',
                    boxShadow: '0 4px 15px rgba(175, 111, 174, 0.3)'
                  }}
                >
                  <UserPlus className="w-4 h-4" />
                  Create Appointment
                </button>
              </div> }
            </div>
  )
}