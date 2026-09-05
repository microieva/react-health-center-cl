import { Calendar, MessageSquare, Star, UserPlus } from "lucide-react";
import { useAuth } from "../../utils/AuthProvider";
import { PageFooter } from "../PageFooter";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardTable } from "./DashboardTable";
import { StatsGrid } from "./StatsGrid";
import { UserProfileCard } from "./UserProfileCard";
import { DashboardSceleton } from "./DashboardSceleton";
import { useDoctorDashboard } from "../../hooks/useDoctorDashboard";
import { useEffect, useState } from "react";
import type { Appointment, PagedResponse } from "../../types";
import { NextAppointment } from "./NextAppointment";

export const DoctorDashboard = () => { 
  const {currentUser} = useAuth();
  const {stats:data, loading} = useDoctorDashboard();
  const [latestPatients, setLatesPatients] = useState<PagedResponse<Appointment>>({slice: [], length: 0});

  useEffect(() => {
    if (data) {
      const combinedAppointments = [...data?.upcomingAppointments.slice, ...data?.pastAppointments.slice];
      const total = data?.upcomingAppointments?.length + data?.pastAppointments?.length;
      combinedAppointments.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
      const combined = {
        length: total,
        slice: combinedAppointments,
      };
      setLatesPatients(combined);
    }
  }, [data?.upcomingAppointments, data?.pastAppointments]);
  
  const stats = [
    {
      title: 'Pending Requests',
      value: data?.countPendingAppointments.toString(),
      icon: UserPlus,
      trend: '+5%',
    },
    {
      title: 'Unread Messages',
      value: data?.countUnreadMessages.toString(),
      icon: MessageSquare,
      trend: '+18%',
    },
    {
      title: 'Accepted Appointments',
      value: data?.countUpcomingAppointments.toString(),
      icon: Star,
      trend: '+12%',
    },
    {
      title: 'Missed Appointments',
      value: data?.countMissedAppointments.toString(),
      icon: Calendar,
      trend: '-3%',
    },

  ];
  if (loading) {
    return (
      <DashboardSceleton />
    )
  }
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
          <div className="lg:col-span-1 flex flex-col gap-2">
            <DashboardTable data={data.drafts} />
            <DashboardTable data={latestPatients} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-2">
          {!data.nextAppointment ? <div 
              className="rounded-xl border border-dashed p-8 flex flex-col items-center justify-center"
              style={{ 
                borderColor: 'var(--color-primary-light-gray)',
                minHeight: '200px'
              }}
            >
              <p className="text-sm text-[var(--color-secondary-light-blue)]">
                Next appointment
              </p>
              <p className="text-xs text-[var(--color-secondary-light-blue)]"><em>none</em></p>
            </div> 
            : 
            <NextAppointment data={data.nextAppointment}/>
          }
          </div>
        </div>
        <PageFooter role={currentUser?.userRole || ''}/>
      </div>
  );
}