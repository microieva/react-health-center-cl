import { Clock } from "lucide-react";
import { useAuth } from "../../utils/AuthProvider";
import { useTimeAgo } from "../../hooks/useTimeGo";

export const UserProfileCard = () => {
  const {currentUser} = useAuth();
  const timeAgo = useTimeAgo(currentUser?.lastLogOutAt);
  const isOnline = true;
  
  return (<>
    <div
      className="rounded-xl p-2 border mb-2 transition-all duration-200 hover:shadow-lg"
      style={{
        borderColor: 'var(--color-primary-light-gray)'
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{
              backgroundColor: 'rgba(175, 111, 174, 0.1)',
              color: 'var(--color-accent-purple)'
            }}
          >
            {currentUser?.firstName[0]}{currentUser?.lastName[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-primary-deep-blue)' }}>
              {currentUser?.firstName} {currentUser?.lastName}
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-primary-slate-gray)' }}>
              {currentUser?.email}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-secondary-light-blue)' }}>
              {currentUser?.userRole}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Online Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--color-bg-light-blue)' }}>
            <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`} />
            <span className="text-sm font-medium" style={{ color: 'var(--color-primary-deep-blue)' }}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Last Logout */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--color-bg-light-blue)' }}>
            <Clock className="w-4 h-4" style={{ color: 'var(--color-primary-slate-gray)' }} />
            <span className="text-sm" style={{ color: 'var(--color-primary-slate-gray)' }}>
              Last logout: <em>{timeAgo}</em>
            </span>
          </div>
        </div>
      </div>
    </div> 
  </>
  )
}