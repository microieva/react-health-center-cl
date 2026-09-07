import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import { useAuth } from "../../utils/AuthProvider";
import { PageFooter } from "../PageFooter";
import { DashboardHeader } from "./DashboardHeader";

import { StatsGrid } from "./StatsGrid";
import { UserProfileCard } from "./UserProfileCard";
import { DashboardTable } from "./DashboardTable";
import { NextAppointment } from "./NextAppointment";
import { usePatientDashboard } from "../../hooks/usePatientDashboard";
import { useState, useEffect } from "react";
import type { PagedResponse, Appointment } from "../../types";
import { DashboardSceleton } from "./DashboardSceleton";
import { ErrorView } from "../ErrorView";

export const PatientDashboard = () => { 
  const {currentUser} = useAuth();
  const {stats:data, loading, error} = usePatientDashboard();
  const [latestAppointments, setLatesAppointments] = useState<PagedResponse<Appointment>>({slice: [], length: 0});

  useEffect(() => {
    if (data) {
      const combinedAppointments = [...data?.upcomingAppointments.slice, ...data?.pastAppointments.slice];
      const total = data?.upcomingAppointments?.length + data?.pastAppointments?.length;
      combinedAppointments.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
      const combined = {
        length: total,
        slice: combinedAppointments,
      };
      setLatesAppointments(combined);
    }
  }, [data?.upcomingAppointments, data?.pastAppointments]);
  
  const stats = [
    {
      title: 'Waiting Confirmation',
      value: data?.countPendingAppointments.toString(),
      icon: CalendarTodayRoundedIcon,
      trend: '+5%',
    },
    {
      title: 'New Medical Records',
      value: data?.countUnreadRecords.toString(),
      icon: DescriptionRoundedIcon,
      trend: '+18%',
    },
    {
      title: 'Upcoming Appointments',
      value: data?.countUpcomingAppointments.toString(),
      icon: CalendarMonthRoundedIcon,
      trend: '+12%',
    },
    {
      title: 'Missed Appointment Requests',
      value: data?.countMissedAppointments.toString(),
      icon: EventBusyRoundedIcon,
      trend: '-3%',
    },

  ];

  if (loading) {
    return (
      <DashboardSceleton />
    )
  }

  if (error) {
    return (
      <ErrorView error={error} title={"Getting data failed"}/>
    );
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
            <DashboardTable data={data?.records} />
            <DashboardTable data={latestAppointments} nextAppointmentId={data.nextAppointment?.nextId}/>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-2">
          {!data?.nextAppointment ? <div 
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
            <NextAppointment data={data?.nextAppointment}/>
          }
          </div>
        </div>
        <PageFooter role={currentUser?.userRole || ''}/>
      </div>
  );
}