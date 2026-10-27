import React, { useEffect, useMemo, useState } from 'react';
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
  Autocomplete,
  TextField,
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
import { format, isToday, isThisMonth } from 'date-fns';
import { AppointmentsSkeleton } from './AppointmentsSceleton';
import { NoAppointmentsView } from './NoAppointmentsView';
import type { PagedResponse, Appointment } from '../../types';
import { useAuth } from '../../utils/AuthProvider';
import { getStatusIcon } from '../../utils/helpers';
import { getTimeDuration } from '../../utils/utils';
import { DateStatusBadge } from '../DateStatusBadge';
import { InputAutocomplete } from '../InputAutocomplete';
import { InputDateRangePicker } from '../InputDateRangePicker';


interface StepperContentProps {
  view: string;
  data: PagedResponse<Appointment>;
  isLoading: boolean;
  onLoadMore:() => void;
  hasMore: boolean;
  newItemsStartIndex: number | null;
}

const groupAppointmentsByMonth = (appointments: any[]) => {
  const groups: { [key: string]: any[] } = {};
  
  appointments.forEach((appointment) => {
    const date = new Date(appointment.start);
    let key: string;
    
    if (isToday(date)) {
      key = 'Today';
    } else if (isThisMonth(date)) {
      key = 'This Month';
    } else {
      key = format(date, 'MMMM yyyy');
    }
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(appointment);
  });
  
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    if (a === 'Today') return -1;
    if (b === 'Today') return 1;
    if (a === 'This Month') return -1;
    if (b === 'This Month') return 1;
    
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });
  
  return { groups, sortedKeys };
};

const CustomStepIcon = ({ icon, active }: { icon: React.ReactNode; active?: boolean }) => {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? 'var(--color-accent-purple)' : '#e8eaf6',
        color: active ? '#fff' : 'var(--color-primary-slate-gray)',
        transition: 'all 0.2s',
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
  hasMore,
  newItemsStartIndex
}) => {
  let globalIndex = 0;
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<PagedResponse<Appointment>>(data);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  useEffect(() => {
    setAppointments(data);
  }, [data, view]);

  const { groups, sortedKeys } = useMemo(() => {
    return groupAppointmentsByMonth(appointments.slice || []);
  }, [appointments]);

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
      const selected: Appointment[] = appointments.slice.filter((apt: Appointment) => apt.patient.id === id);
      setAppointments({slice: selected, length: selected.length})
    }
  }

  const handleDateFilter = () => {

  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <div className="flex flex-row justify-between items-center">
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" sx={{ fontWeight: 700, color: 'var(--color-primary-deep-blue)' }}>
            {getSecondaryTitle()}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-primary-slate-gray)' }}>
            Total: {appointments.length} appointment{appointments.length > 1 ? 's' : ''}
          </Typography> 
        </Box>
        <Box sx={{ mb: 0, display: 'flex', gap: 0.5, flexDirection:'column'}}>
          <InputAutocomplete 
            appointments={appointments.slice}
            label={"Filter by name.."}
            disabled={false}
            onChange={handleNameFilter}
            value={selectedName}
          />
          <InputDateRangePicker 
            value={''} 
            onChange={handleDateFilter}
          />
        </Box>
      </div>

      <Stepper orientation="vertical" nonLinear>
        {sortedKeys.map((monthKey, index) => {
          const monthAppointments = groups[monthKey];
          const isTodayMonth = monthKey === 'Today';
          const isCurrentMonth = monthKey === 'This Month';
          const isActive = isTodayMonth || isCurrentMonth;

          return (
            <Step 
              key={monthKey + index} 
              active={true} 
              expanded={true} 
              sx={{
                  '& .MuiStepContent-root': {
                    marginLeft: '20px',
                  },
                  '& .MuiStepConnector-root': {
                    marginLeft: '20px',
                  },
                }}
            >
              <StepLabel
                icon={<CustomStepIcon icon={getStepIcon(monthKey)} active={isActive} />}
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: '1.1rem',
                    fontWeight: isTodayMonth ? 700 : 600,
                    color: isTodayMonth ? 'var(--color-accent-purple)' : 'var(--color-primary-deep-blue)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: isTodayMonth ? 700 : 600 }}>
                    {monthKey}
                  </Typography>
                  <Chip
                    label={`${monthAppointments.length} appointment${monthAppointments.length > 1 ? 's' : ''}`}
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

              <StepContent>
                <Box
                  sx={{
                    marginLeft: '20px',
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  {monthAppointments.map((appointment, index) => {
                    const currentIndex = globalIndex++;
                    const appointmentDate = new Date(appointment.start);
                    const displayName = currentUser?.userRole === 'doctor'
                      ? `${appointment.patient?.firstName || ''} ${appointment.patient?.lastName || ''}`.trim() || 'Unknown Patient'
                      : appointment.doctor
                        ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                        : 'Pending doctor confirmation';

                    const roleLabel = currentUser?.userRole === 'doctor'
                      ? 'Patient'
                      : (appointment.doctor ? 'Doctor' : 'Doctor');

                    return (
                      <Paper
                        key={appointment.id+index.toString()}
                        data-appointment-index={currentIndex} 
                        elevation={0}
                        sx={{
                          p: 2,
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
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                            <Avatar
                              sx={{
                                bgcolor: view === 'upcoming' ? 'var(--color-accent-purple)' : 'var(--color-primary-slate-gray)',
                                width: 40,
                                height: 40,
                              }}
                            >
                              {currentUser?.userRole === 'doctor'
                                ? <Person />
                                : (appointment.doctor ? <MedicalServices /> : <Pending />)}
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
                                }}
                              >
                                {displayName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {roleLabel}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTime sx={{ fontSize: 16, color: 'var(--color-primary-slate-gray)' }} />
                              <Typography variant="body2" color="text.secondary">
                                {format(appointmentDate, 'MMM d, yyyy • h:mm a')}
                              </Typography>
                            </Box>

                            <DateStatusBadge
                              timestamp={view !== 'pending' ? appointment.start : undefined}
                              isNext={false}
                              icon={getStatusIcon(appointment)}
                            />
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            mt: 1.5,
                            pt: 1.5,
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
                            {currentUser?.userRole === 'doctor' && appointment.patientMessage && (
                              <DateStatusBadge icon={<TextSnippetOutlinedIcon sx={{ fontSize: 14 }} />} label="patient note" />
                            )}
                            {currentUser?.userRole === 'patient' && appointment.doctorMessage && (
                              <DateStatusBadge icon={<TextSnippetOutlinedIcon sx={{ fontSize: 14 }} />} label="doctor note" />
                            )}
                            {appointment.record && !appointment.record.draft && (
                              <DateStatusBadge icon={<DescriptionIcon sx={{ fontSize: 14 }} />} label="record" />
                            )}
                            {currentUser?.userRole === 'doctor' && appointment.record && appointment.record.draft && (
                              <DateStatusBadge icon={<DescriptionOutlinedIcon sx={{ fontSize: 14 }} />} label="draft" />
                            )}
                          </div>
                          <div className="text-right text-xs text-primary-dark-gray">
                            <p><em>duration: {getTimeDuration(appointment.start, appointment.end)}</em></p>
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

      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
          <Button
            variant="outlined"
            onClick={onLoadMore}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} color="inherit"/> : <ExpandMore />}
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
  );
};