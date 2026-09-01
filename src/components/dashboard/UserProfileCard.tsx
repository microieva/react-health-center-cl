import { Clock } from "lucide-react";
import { useAuth } from "../../utils/AuthProvider";
import { useTimeAgo } from "../../hooks/useTimeGo";

export const UserProfileCard = () => {
  const {currentUser} = useAuth();
  const timeAgo = useTimeAgo(currentUser?.lastLogOutAt);
  const isOnline = true;
  
  return (<>
    {currentUser ? <div
      className="rounded-xl p-2 border mb-2 transition-all duration-200 hover:shadow-lg"
      style={{
        borderColor: '#e2e8f0'
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{
              backgroundColor: 'rgba(175, 111, 174, 0.1)',
              color: '#af6faee6'
            }}
          >
            {currentUser.firstName[0]}{currentUser.lastName[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#0f172a' }}>
              {currentUser?.firstName} {currentUser?.lastName}
            </h2>
            <p className="text-sm" style={{ color: '#64748b' }}>
              {currentUser?.email}
            </p>
            <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>
              {currentUser?.userRole}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Online Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#f1f5f9' }}>
            <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`} />
            <span className="text-sm font-medium" style={{ color: '#0f172a' }}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Last Logout */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#f1f5f9' }}>
            <Clock className="w-4 h-4" style={{ color: '#64748b' }} />
            <span className="text-sm" style={{ color: '#64748b' }}>
              Last logout: {timeAgo}
            </span>
          </div>
        </div>
      </div>
    </div> : <div>Loading</div> }
  </>
  )
}