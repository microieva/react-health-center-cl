import { UserCheck, MessageCircle, Calendar, ThumbsUp, UserPlus, MessageSquare, Star } from "lucide-react";
import { DashboardChart } from "./DashboardChart";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardTable } from "./DashboardTable";
import { StatsGrid } from "./StatsGrid";
import { UserProfileCard } from "./UserProfileCard";
import { PageFooter } from "../PageFooter";
import { useAuth } from "../../utils/AuthProvider";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";
import { DashboardSceleton } from "./DashboardSceleton";

export const AdminDashboard = () => { 
  const {currentUser} = useAuth();
  const {stats: data, loading} = useAdminDashboard();
  
  const stats = [
    {
      title: 'Unread Messages',
      value: data?.countUnreadMessages.toString(),
      icon: MessageSquare,
      trend: '+18%',
    },
    {
      title: 'Unread Feedback',
      value: data?.countUnreadFeedback.toString(),
      icon: Star,
      trend: '+12%',
    },
    {
      title: 'Missed Appointments',
      value: data?.countMissedAppointments.toString(),
      icon: Calendar,
      trend: '-3%',
    },
    {
      title: 'Pending Requests',
      value: data?.countDoctorRequests.toString(),
      icon: UserPlus,
      trend: '+5%',
    }
  ];

  if (loading) {
    return (
      <DashboardSceleton />
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        <UserProfileCard />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
          {stats.map((stat, index) => {
            
            return (
              <StatsGrid 
                trend={stat.trend} 
                title={stat.title} 
                icon={stat.icon} 
                value={stat.value} 
                index={index} />
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col justify-between h-full">
            <DashboardChart />
            <DashboardTable data={data.doctors}/>
          </div>
            

          {/* Right Column */}
          <div className="space-y-2">
            {/* Recent Activity */}
            <div
              className="rounded-xl p-4 md:p-6 border"
              style={{
                borderColor: 'var(--color-primary-light-gray)'
              }}
            >
              <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--color-primary-deep-blue)' }}>
                Recent Activity
              </h3>
              <div className="space-y-3">
                {[
                  { icon: UserCheck, text: 'Dr. Emily Williams signed contract', time: '5 min ago', color: 'var(--color-accent-purple)' },
                  { icon: MessageCircle, text: 'New feedback from patient #2847', time: '15 min ago', color: '#0284c7' },
                  { icon: Calendar, text: 'Appointment request from Dr. Chen', time: '1 hour ago', color: '#f59e0b' },
                  { icon: ThumbsUp, text: 'Profile updated by Dr. Thompson', time: '2 hours ago', color: '#16a34a' },
                ].map((activity, i) => {
                  const Icon = activity.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-1.5 rounded-lg flex-shrink-0" style={{ backgroundColor: 'rgba(175, 111, 174, 0.08)' }}>
                        <Icon className="w-4 h-4" style={{ color: activity.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm" style={{ color: 'var(--color-primary-deep-blue)' }}>
                          {activity.text}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-secondary-light-blue)' }}>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Create New User Card */}
            <div
              className="rounded-xl p-4 md:p-6 border text-center transition-all duration-200 hover:shadow-lg group"
              style={{
                borderColor: 'var(--color-primary-light-gray)'
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-200 group-hover:scale-110"
                style={{
                  backgroundColor: 'rgba(175, 111, 174, 0.08)',
                  color: 'var(--color-accent-purple)'
                }}
              >
                <UserPlus className="w-8 h-8" />
              </div>
              <h3 className="font-semibold" style={{ color: 'var(--color-primary-deep-blue)' }}>
                Create New User
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--color-primary-slate-gray)' }}>
                Register new patient, doctor, or staff
              </p>
              <button
                className="mt-4 px-6 py-2 rounded-lg font-medium transition-all duration-200 w-full"
                style={{
                  backgroundColor: 'var(--color-accent-purple)',
                  color: 'var(--color-white)',
                  boxShadow: '0 4px 15px rgba(175, 111, 174, 0.3)'
                }}
              >
                + Add User
              </button>
            </div>
          </div>
        </div>
        <PageFooter role={currentUser?.userRole || ''}/>
      </div>
  );
}