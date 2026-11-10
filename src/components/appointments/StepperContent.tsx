import React, { useEffect, useMemo, useState } from 'react';
import { upperFirst } from 'lodash-es';
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Typography,
  Box,
  Chip,
  Avatar,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  Person,
  MedicalServices,
  Pending,
  Today,
  Event,
  ExpandMore,
} from '@mui/icons-material';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import DescriptionIcon from '@mui/icons-material/Description';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { format, isToday, isThisMonth, startOfWeek, endOfWeek } from 'date-fns';
import { AppointmentsSkeleton } from './AppointmentsSceleton';
import { NoAppointmentsView } from './NoAppointmentsView';
import type { PagedResponse, Appointment as AppointmentData } from '../../types';
import { useAuth } from '../../utils/AuthProvider';
import { getStatusIcon } from '../../utils/helpers';
import { getTimeDuration } from '../../utils/utils';
import { DateStatusBadge } from '../DateStatusBadge';
import { InputAutocomplete } from '../InputAutocomplete';
//import { InputDateRangePicker } from '../InputDateRangePicker';
import { CustomModal } from '../Modal';
import { Appointment } from './Appointment';
import { useAcceptAppointment } from '../../hooks/useAppointments';
import { client } from '../../apollo/client';
import { TypographyAccent } from '../TypographyAccent';
import { TypographySmall } from '../TypographySmall';

interface StepperContentProps {
  view: string;
  data: PagedResponse<AppointmentData>;
  isLoading: boolean;
  onLoadMore: (selectedName: string | null) => void;
  hasMore: boolean;
}

interface WeekGroup {
  key: string;
  sortValue: number;
  appointments: AppointmentData[];
}

interface MonthGroup {
  key: string;
  weeks: WeekGroup[];
}

const WEEK_STARTS_ON = 1; // Monday; use 0 for Sunday

const getWeekKey = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: WEEK_STARTS_ON });
  const end = endOfWeek(date, { weekStartsOn: WEEK_STARTS_ON });
  return `${format(start, 'MMM d')} – ${format(end, 'MMM d')}`;
};

const getWeekSortValue = (date: Date) =>
  startOfWeek(date, { weekStartsOn: WEEK_STARTS_ON }).getTime();

const groupAppointmentsByMonthAndWeek = (
  appointments: AppointmentData[],
  view: string
): MonthGroup[] => {
  const isPastView = view === 'past';

  // 1. Month grouping — "Today" bucket removed; today's items fall into "This Month"
  const monthMap: { [key: string]: AppointmentData[] } = {};

  appointments.forEach((appointment) => {
    const date = new Date(appointment.start);
    let key: string;

    if (isThisMonth(date)) {
      key = 'This Month';
    } else {
      key = format(date, 'MMMM yyyy');
    }

    if (!monthMap[key]) monthMap[key] = [];
    monthMap[key].push(appointment);
  });

  // 2. Week grouping within each month
  const result: MonthGroup[] = Object.entries(monthMap).map(([monthKey, list]) => {
    const weekMap: { [key: string]: WeekGroup } = {};

    list.forEach((appointment) => {
      const date = new Date(appointment.start);
      const weekKey = getWeekKey(date);

      if (!weekMap[weekKey]) {
        weekMap[weekKey] = {
          key: weekKey,
          sortValue: getWeekSortValue(date),
          appointments: [],
        };
      }
      weekMap[weekKey].appointments.push(appointment);
    });

    const weeks = Object.values(weekMap).sort((a, b) =>
      isPastView ? b.sortValue - a.sortValue : a.sortValue - b.sortValue
    );

    weeks.forEach((w) =>
      w.appointments.sort((a, b) => {
        const diff = new Date(a.start).getTime() - new Date(b.start).getTime();
        return isPastView ? -diff : diff;
      })
    );

    return { key: monthKey, weeks };
  });

  // 3. Order months: "This Month" first, then chronological
  const priority = (k: string) => (k === 'This Month' ? 0 : 1);

  result.sort((a, b) => {
    const pa = priority(a.key);
    const pb = priority(b.key);
    if (pa !== pb) return pa - pb;

    const minA = Math.min(...a.weeks.map((w) => w.sortValue));
    const minB = Math.min(...b.weeks.map((w) => w.sortValue));
    return isPastView ? minB - minA : minA - minB;
  });

  return result;
};

const CustomStepIcon = (
  { icon, active, size }
  : 
  { icon: React.ReactNode; active?: boolean; size?: number}) => {
  return (
    <Box
      sx={{
        width: size || 40,
        height: size || 40,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? 'var(--color-accent-purple)' : '#e8eaf6',
        color: active ? '#fff' : 'var(--color-primary-slate-gray)',
        transition: 'all 0.2s',
        '&:hover': {
          opacity: 0.6,
        }
      }}
    >
      {icon}
    </Box>
  );
};

export const StepperContent: React.FC<StepperContentProps> = ({
  view,
  data,
  isLoading,
  onLoadMore,
  hasMore
}) => {
  let globalIndex = 0;
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<PagedResponse<AppointmentData>>(data);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);
  const { acceptAppointment, isSuccess } = useAcceptAppointment();
  const [openMonths, setOpenMonths] = useState<Set<string>>(new Set());
  const [openWeeks, setOpenWeeks] = useState<Set<string>>(new Set());
  const [openDays, setOpenDays] = useState<Set<string>>(new Set());

  const toggleSet = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    key: string
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const computeInitialOpenState = (
    groups: MonthGroup[],
    view: string
  ) => {
    const months = new Set<string>();
    const weeks = new Set<string>();
    const days = new Set<string>();

    if (groups.length === 0) return { months, weeks, days };

    // 1. First month open
    const firstMonth = groups[0];
    const firstMonthId = `${firstMonth.key}-0`;
    months.add(firstMonthId);

    // 2. First two weeks of the first month open
    firstMonth.weeks.forEach((week, weekIndex) => {
    if (weekIndex > 1) return; // only weeks 0 and 1

    const weekId = `${firstMonthId}-${week.key}`;
    weeks.add(weekId);

    // 3. All days of the FIRST week open; other weeks' days stay closed
    if (weekIndex === 0) {
      const dayKeys = new Set<string>();
      week.appointments.forEach((appointment) => {
        dayKeys.add(format(new Date(appointment.start), 'yyyy-MM-dd'));
      });
      dayKeys.forEach((dayKey) => {
        days.add(`${weekId}-${dayKey}`);
      });
    }
    });

    return { months, weeks, days };
  };

  useEffect(() => {
    setAppointments(data);
  }, [data, view]);

  useEffect(() => {
    if (isSuccess) {
      setSelectedAppointment(null);
    }
  }, [isSuccess]);

  const monthGroups = useMemo(() => {
    return groupAppointmentsByMonthAndWeek(appointments.slice || [], view);
  }, [appointments, view]);

  useEffect(() => {
    const initial = computeInitialOpenState(monthGroups, view);
    setOpenMonths(initial.months);
    setOpenWeeks(initial.weeks);
    setOpenDays(initial.days);
  }, [monthGroups, view]);

  const getSecondaryTitle = (): string => {
    const isDoctor = currentUser?.userRole === 'doctor';
    if (view === 'pending') {
      return isDoctor ? 'Appointment Requests' : 'Pending Confirmation';
    }
    if (view === 'past') return 'Past Appointments';
    if (view === 'upcoming') return 'Upcoming Appointments';
    return '';
  };

  const getStepIcon = (key: string) => {
    if (key === 'Today') return <Today />;
    if (key === 'This Month') return <Event />;
    return <CalendarToday />;
  };

  if (isLoading && appointments.length === 0) {
    return <AppointmentsSkeleton />;
  }

  if (!isLoading && appointments.length === 0) {
    return (
      <NoAppointmentsView
        text={
          view === 'pending'
            ? 'You have no pending appointments.'
            : view === 'upcoming'
            ? 'You have no upcoming appointments.'
            : 'You have no past appointments.'
        }
      />
    );
  }

  const handleNameFilter = (id: string | null) => {
    if (id) {
      const selected: AppointmentData[] = appointments.slice.filter(
        (apt: AppointmentData) => apt.patient.id === id
      );
      setSelectedName(id);
      setAppointments({ slice: selected, length: selected.length });
    } else {
      setAppointments(data);
      setSelectedName(null);
    }
  };

  const handleAcceptAppointment = async () => {
    const cache = client.cache;

    let cachedNextStart: number | null = null;

    cache.modify({
      fields: {
        nextAppointment: (existing, { readField }) => {
          const start = readField<string>('nextStart', existing);
          cachedNextStart = start ? new Date(start).getTime() : null;
          return existing;
        },
      },
    });

    const acceptedStart = selectedAppointment?.start
      ? new Date(selectedAppointment.start).getTime()
      : null;

    const refetchNextAppointment =
      cachedNextStart != null &&
      acceptedStart != null &&
      acceptedStart < cachedNextStart;

    const response = await acceptAppointment(selectedAppointment?.id as number);
    if (response?.success) {
      setSelectedAppointment(null);
      if (refetchNextAppointment) {
        cache.modify({
          fields: {
            nextAppointment: (_, { INVALIDATE }) => INVALIDATE,
          },
        });
      }
    }
  };

  return (
  <>
    <CustomModal
      isOpen={Boolean(selectedAppointment)}
      onClose={() => setSelectedAppointment(null)}
    >
      <Appointment
        data={selectedAppointment as AppointmentData}
        primaryTitle={`${upperFirst(view)} Appointment`}
        secondaryTitle={getSecondaryTitle()}
        onAcceptAppointment={async () => handleAcceptAppointment()}
      />
    </CustomModal>

    <Box sx={{ maxWidth: 1200, mx: 'auto', my:'1rem' }}>
      <div className="flex flex-row justify-between items-center">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="body1"
            sx={{ color: 'var(--color-primary-slate-gray)' }}
          >
            {getSecondaryTitle()}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-primary-dark-blue)', fontWeight: 600 }}>
            Total: {appointments.length} appointment{appointments.length > 1 ? 's' : ''}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-primary-dark-blue)', fontWeight: 600 }}>
            Showing: {appointments.slice.length} appointment{appointments.slice.length > 1 ? 's' : ''}
          </Typography>
        </Box>
        <Box sx={{ mb: 0, display: 'flex', gap: 0.5, flexDirection: 'column' }}>
          <InputAutocomplete
            appointments={appointments.slice}
            label={'Filter by name..'}
            disabled={false}
            onChange={handleNameFilter}
            value={selectedName}
          />
          {/* <InputDateRangePicker 
            value={''} 
            onChange={handleDateFilter}
          /> */}
        </Box>
      </div>

      <Stepper orientation="vertical" nonLinear>
        {monthGroups.map((monthGroup, index) => {
          const monthKey = monthGroup.key;
          const appointmentCount = monthGroup.weeks.reduce(
            (sum, w) => sum + w.appointments.length,
            0
          );
          const isTodayMonth = monthKey === 'Today';
          const isCurrentMonth = monthKey === 'This Month';
          const isActive = isTodayMonth || isCurrentMonth;
          const monthKeyId = `${monthKey}-${index}`;
          return (
            <Step
              key={monthKeyId}
              active={true}
              expanded={openMonths.has(monthKeyId)}
              sx={{
                '& .MuiStepContent-root': {
                  marginLeft: '27px',
                  borderLeft: '0.5px solid var(--color-primary-medium-gray)',
                  paddingLeft: '0px',
                },
                '& .MuiStepConnector-root': {
                  marginLeft: '27px',
                  borderLeft: '0.5px solid var(--color-primary-medium-gray)',
                },
                '& .MuiStepConnector-line': {
                  borderLeft: 'none',
                  borderLeftWidth:'0.5px'
                },
              }}
            >
              <StepLabel
                onClick={() => toggleSet(setOpenMonths, monthKeyId)}
                icon={
                  <CustomStepIcon 
                    icon={getStepIcon(monthKey)} 
                    active={isActive} 
                    
                  />}
                sx={{
                  cursor: 'pointer',
                  padding: '0.1rem 0.5rem',
                  '& .MuiStepLabel-label': {
                    fontSize: '1.1rem',
                    fontWeight: isTodayMonth ? 700 : 600,
                    color: isTodayMonth
                      ? 'var(--color-accent-purple)'
                      : 'var(--color-primary-deep-blue)',
                    
                  },
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-light-gray)'                   
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: isTodayMonth ? 700 : 600 }}>
                    {monthKey}
                  </Typography>
                  <Chip
                    label={`${appointmentCount} appointment${appointmentCount > 1 ? 's' : ''}`}
                    size="small"
                    sx={{
                      backgroundColor: isTodayMonth ? 'var(--color-accent-purple)' : '#e0e0e0',
                      color: isTodayMonth ? '#fff' : 'var(--color-primary-slate-gray)',
                      fontWeight: 500,
                      fontSize: '0.7rem',
                    }}
                  />
                </Box>
              </StepLabel>

              <StepContent
                slotProps={{
                  transition: {
                    in: openMonths.has(monthKeyId),
                  }
                }}
                sx={{
                  '& .MuiStepContent-root': {
                    marginLeft: '17px',
                    paddingLeft: '15px',
                    borderLeft: '0.5px solid var(--color-primary-medium-gray)',
                  }
                }}
              >
                <Box
                  sx={{
                    marginLeft: '20px',
                    mb: 2,
                  }}
                >
                  {/* WEEK */}
                  <Stepper orientation="vertical" nonLinear>
                    {monthGroup.weeks.map((week, weekIndex) => {
                      const weekAppointmentCount = week.appointments.length;
                      const isTodayGroup = monthKey === 'Today';
                      const weekKeyId = `${monthKeyId}-${week.key}`;
                      const dayMap: { [key: string]: AppointmentData[] } = {};
                      week.appointments.forEach((appointment) => {
                        const dayKey = format(new Date(appointment.start), 'yyyy-MM-dd');
                        if (!dayMap[dayKey]) dayMap[dayKey] = [];
                        dayMap[dayKey].push(appointment);
                      });

                      const days = Object.entries(dayMap)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([dayKey, appointments]) => ({
                          dayKey,
                          date: new Date(`${dayKey}T00:00:00`),
                          appointments,
                        }));

                      return (
                        <Step
                          key={weekKeyId}
                          active={true}
                          expanded={openWeeks.has(weekKeyId)}
                          sx={{
                            '& .MuiStepConnector-root': {
                              marginLeft: '17px',
                              borderLeft: '0.5px solid var(--color-primary-medium-gray)',
                            },
                            '& .MuiStepConnector-line': {
                              borderLeft: 'none',
                              borderLeftWidth:'0.5px'
                            },
                          }}
                          
                        >
                          <StepLabel
                            onClick={() => toggleSet(setOpenWeeks, weekKeyId)}
                            icon={
                              <CustomStepIcon
                                icon={<CalendarToday sx={{ fontSize: 18 }} />}
                                active={false}
                              />
                            }
                            sx={{
                              cursor: 'pointer',
                              '& .MuiStepLabel-label': {
                                padding: '0.2rem 0.5rem',
                                color: 'var(--color-primary-slate-gray)',
                                '&:hover': {
                                  backgroundColor: 'var(--color-primary-light-gray)'                   
                                },
                                
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <TypographyAccent className="text-primary-slate-gray">
                                {isTodayGroup ? 'Today' : `Week of ${week.key}`}
                              </TypographyAccent>
                              <Chip
                                label={`${weekAppointmentCount} appointment${
                                  weekAppointmentCount > 1 ? 's' : ''
                                }`}
                                size="small"
                                sx={{
                                  backgroundColor: isTodayMonth
                                    ? 'var(--color-accent-purple)'
                                    : '#e0e0e0',
                                  color: isTodayMonth ? '#fff' : 'var(--color-primary-slate-gray)',
                                  fontWeight: 500,
                                  fontSize: '0.65rem',
                                  height: 18,
                                }}
                              />
                            </Box>
                          </StepLabel>

                          <StepContent 
                            slotProps={{
                              transition: {
                                in: openWeeks.has(weekKeyId),
                              }
                            }}
                            sx={{
                              '& .MuiStepContent-root': {
                                marginLeft: '12px',
                                paddingTop:0
                              }
                            }}>

                            {/* WEEKDAY */}
                            <Stepper orientation="vertical" nonLinear>
                              {days.map((day, dayIndex) => {
                                const isTodayDay = isToday(day.date);
                                const dayAppointmentCount = day.appointments.length;
                                const dayKeyId = `${weekKeyId}-${day.dayKey}`;
                                return (
                                  <Step
                                    key={dayKeyId}
                                    active={true}
                                    expanded={openDays.has(dayKeyId)}
                                    sx={{
                                      '& .MuiStepConnector-root': {
                                        marginLeft: '12px'
                                      },
                                      '& .MuiStepConnector-line': {
                                        borderLeft: 'none',
                                        borderLeftWidth:'0.5px'
                                      }
                                    }}
                                  >
                                    <StepLabel
                                      onClick={() => toggleSet(setOpenDays, dayKeyId)}
                                      icon={
                                        <CustomStepIcon
                                          icon={<Event sx={{ fontSize: 16 }} />}
                                          active={isTodayDay}
                                          size={28}
                                        />
                                      }
                                      sx={{
                                        cursor: 'pointer',
                                        '& .MuiStepLabel-label': {
                                          padding: '0.2rem 0.5rem',
                                          color: isTodayDay
                                            ? 'var(--color-accent-purple)'
                                            : 'var(--color-primary-slate-gray)',
                                          fontWeight: isTodayDay ? 700 : 500,
                                          '&:hover': {
                                            backgroundColor: 'var(--color-primary-light-gray)'                   
                                          }
                                        },
                                      }}
                                    >
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <TypographySmall
                                            className={`${isTodayDay ? 'text-accent-purple' : 'text-primary-slate-gray'} text-xs`}
                                          >
                                            {isTodayDay
                                              ? `Today |  ${format(day.date, 'EEEE, MMM d')}`
                                              : format(day.date, 'EEEE, MMM d')}
                                          </TypographySmall>
                                        <Chip
                                          label={`${dayAppointmentCount} appointment${
                                            dayAppointmentCount > 1 ? 's' : ''
                                          }`}
                                          size="small"
                                          sx={{
                                            backgroundColor: isTodayDay
                                              ? 'var(--color-accent-purple)'
                                              : '#e0e0e0',
                                            color: isTodayDay
                                              ? '#fff'
                                              : 'var(--color-primary-slate-gray)',
                                            fontWeight: 500,
                                            fontSize: '0.65rem',
                                            height: 18,
                                          }}
                                        />
                                      </Box>
                                    </StepLabel>

                                    <StepContent
                                      slotProps={{
                                        transition: {
                                          in: openDays.has(dayKeyId),
                                        }
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: 2,
                                          pb: 1,
                                        }}
                                      >
                                        {day.appointments.map((appointment) => {
                                          const currentIndex = globalIndex++;
                                          const appointmentDate = new Date(appointment.start);
                                          const displayName =
                                            currentUser?.userRole === 'doctor'
                                              ? `${appointment.patient?.firstName || ''} ${
                                                  appointment.patient?.lastName || ''
                                                }`.trim() || 'Unknown Patient'
                                              : appointment.doctor
                                              ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                                              : 'Pending doctor confirmation';

                                          const roleLabel =
                                            currentUser?.userRole === 'doctor'
                                              ? 'Patient'
                                              : appointment.doctor
                                              ? 'Doctor'
                                              : 'Doctor';

                                          return (
                                            <Paper
                                              key={appointment.id + currentIndex.toString()}
                                              data-appointment-index={currentIndex}
                                              elevation={0}
                                              onClick={() => setSelectedAppointment(appointment)}
                                              sx={{
                                                p: 1,
                                                border: '1px solid var(--color-primary-light-gray)',
                                                borderRadius: 2,
                                                transition: 'all 0.2s',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                  transform: 'translateY(-2px)',
                                                },
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  display: 'flex',
                                                  flexDirection: { xs: 'column', sm: 'row' },
                                                  alignItems: { sm: 'center' },
                                                  gap: 2,
                                                }}
                                              >
                                                <Box
                                                  sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    flex: 1,
                                                    minWidth: 0,
                                                  }}
                                                >
                                                  <Avatar
                                                    sx={{
                                                      bgcolor:
                                                        view === 'upcoming'
                                                          ? 'var(--color-accent-purple)'
                                                          : 'var(--color-primary-slate-gray)',
                                                      width: 40,
                                                      height: 40,
                                                    }}
                                                  >
                                                    {currentUser?.userRole === 'doctor' ? (
                                                      <Person />
                                                    ) : appointment.doctor ? (
                                                      <MedicalServices />
                                                    ) : (
                                                      <Pending />
                                                    )}
                                                  </Avatar>

                                                  <Box sx={{ minWidth: 0 }}>
                                                    <Typography
                                                      variant="subtitle2"
                                                      sx={{
                                                        fontWeight: 600,
                                                        color: 'var(--color-primary-deep-blue)',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        marginBottom: '0px',
                                                      }}
                                                    >
                                                      {displayName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                      {roleLabel}
                                                    </Typography>
                                                  </Box>
                                                </Box>

                                                <Box
                                                  sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    flexWrap: 'wrap',
                                                  }}
                                                >
                                                  <Box
                                                    sx={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      gap: 0.5,
                                                    }}
                                                  >
                                                    <AccessTime
                                                      sx={{
                                                        fontSize: 16,
                                                        color: 'var(--color-primary-slate-gray)',
                                                      }}
                                                    />
                                                    <Typography variant="body2" color="text.secondary">
                                                      {format(appointmentDate, 'MMM d, yyyy • h:mm a')}
                                                    </Typography>
                                                  </Box>

                                                  <DateStatusBadge
                                                    timestamp={
                                                      view !== 'pending' ? appointment.start : undefined
                                                    }
                                                    isNext={false}
                                                    icon={getStatusIcon(appointment)}
                                                  />
                                                </Box>
                                              </Box>

                                              <Box
                                                sx={{
                                                  mt: 0.5,
                                                  pt: 1,
                                                  borderTop: '1px solid var(--color-primary-light-gray)',
                                                  display: 'flex',
                                                  flexDirection: 'row',
                                                  justifyContent: 'space-between',
                                                  alignItems: 'center',
                                                  flexWrap: 'wrap',
                                                  gap: 1,
                                                }}
                                              >
                                                <div className="flex items-center gap-2 mb-1">
                                                  {currentUser?.userRole === 'doctor' &&
                                                    appointment.patientMessage && (
                                                      <DateStatusBadge
                                                        icon={
                                                          <TextSnippetOutlinedIcon
                                                            sx={{ fontSize: 14 }}
                                                          />
                                                        }
                                                        label="patient note"
                                                      />
                                                    )}
                                                  {currentUser?.userRole === 'patient' &&
                                                    appointment.doctorMessage && (
                                                      <DateStatusBadge
                                                        icon={
                                                          <TextSnippetOutlinedIcon
                                                            sx={{ fontSize: 14 }}
                                                          />
                                                        }
                                                        label="doctor note"
                                                      />
                                                    )}
                                                  {appointment.record && !appointment.record.draft && (
                                                    <DateStatusBadge
                                                      icon={<DescriptionIcon sx={{ fontSize: 14 }} />}
                                                      label="record"
                                                    />
                                                  )}
                                                  {currentUser?.userRole === 'doctor' &&
                                                    appointment.record &&
                                                    appointment.record.draft && (
                                                      <DateStatusBadge
                                                        icon={
                                                          <DescriptionOutlinedIcon
                                                            sx={{ fontSize: 14 }}
                                                          />
                                                        }
                                                        label="draft"
                                                      />
                                                    )}
                                                </div>
                                                <div className="text-right text-xs text-primary-dark-gray">
                                                  <p>
                                                    <em>
                                                      duration:{' '}
                                                      {getTimeDuration(
                                                        appointment.start,
                                                        appointment.end
                                                      )}
                                                    </em>
                                                  </p>
                                                </div>
                                              </Box>
                                            </Paper>
                                          );
                                        })}
                                      </Box>
                                    </StepContent>
                                  </Step>
                                );
                              })}
                            </Stepper>
                          </StepContent>
                        </Step>
                      );
                    })}
                  </Stepper>
                </Box>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>

      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => onLoadMore(selectedName)}
            disabled={isLoading}
            startIcon={
              isLoading ? <CircularProgress size={16} color="inherit" /> : <ExpandMore />
            }
            sx={{
              textTransform: 'none',
              borderColor: 'var(--color-accent-purple)',
              color: 'var(--color-accent-purple)',
              '&:hover': {
                borderColor: 'var(--color-accent-purple)',
                backgroundColor: 'rgba(175, 111, 174, 0.04)',
              },
            }}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </Box>
      )}
    </Box>
  </>
  );

};