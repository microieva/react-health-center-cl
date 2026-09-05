import { Calendar, MessageSquare, Star, UserPlus } from "lucide-react";
import { useAuth } from "../../utils/AuthProvider";
import { PageFooter } from "../PageFooter";
import { DashboardHeader } from "./DashboardHeader";

import { StatsGrid } from "./StatsGrid";
import { UserProfileCard } from "./UserProfileCard";
import { DashboardTable } from "./DashboardTable";

export const PatientDashboard = () => { 
  const {currentUser} = useAuth();
  
    // Sample stats data
  const stats = [
    {
      title: 'Pending Requests',
      value: '42',
      icon: UserPlus,
      trend: '+5%',
    },
    {
      title: 'Unread Messages',
      value: '156',
      icon: MessageSquare,
      trend: '+18%',
    },
    {
      title: 'Accepted Appointments',
      value: '24',
      icon: Star,
      trend: '+12%',
    },
    {
      title: 'Missed Appointments',
      value: '8',
      icon: Calendar,
      trend: '-3%',
    },

  ];
  return (
    <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        <UserProfileCard/>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Left Column */}
          <div className="lg:col-span-1 flex flex-col justify-between h-full">
            <DashboardTable />
            
          </div>
            

          {/* Right Column - Quick Actions & Activity */}
          <div className="space-y-2">
            <DashboardTable /> 
          </div>
        </div>
        <PageFooter role={currentUser?.userRole || ''}/>
      </div>
  );
}