import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import {
  usePendingAppointments,
  usePastAppointments,
  useUpcomingAppointments,
} from '../hooks/useAppointments';
import { StepperContent } from '../components/appointments/StepperContent';
import { useAuth } from '../utils/AuthProvider';
import { CalendarPlus } from 'lucide-react';

type ViewType = 'pending' | 'upcoming' | 'past';

export const AppointmentsPage = () => {
  const [view, setView] = useState<ViewType>('pending');
  const [pageIndex, setPageIndex] = useState(0);
  const { currentUser } = useAuth();
  const title = currentUser?.userRole === 'doctor' ? 'My Appointments' : 'My Appointments';
  const pageLimit = 10;
  const listRef = useRef<HTMLDivElement>(null);
  const [newItemsStartIndex, setNewItemsStartIndex] = useState<number | null>(null);

  const pending = usePendingAppointments({ pageIndex, pageLimit, filterInput:null });
  const upcoming = useUpcomingAppointments({ pageIndex, pageLimit, filterInput:null });
  const past = usePastAppointments({ pageIndex, pageLimit, filterInput:null });

  const getCurrentData = () => {
    switch (view) {
      case 'pending': return pending;
      case 'upcoming': return upcoming;
      case 'past': return past;
      default: return pending;
    }
  };
  const current = getCurrentData();

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    setPageIndex(0);
  };

  const handleLoadMore = async (selectedName: string | null) => {
    const nextPageIndex = pageIndex + 1;
    const currentLength = current.data.slice.length;
    setNewItemsStartIndex(currentLength);
    console.log('SELECTED NAME: ', selectedName);
    try {
      switch (view) {
        case 'pending':
          await pending.fetchMore({
            variables: { pageIndex: nextPageIndex, pageLimit },
          });
          break;
        case 'upcoming':
          await upcoming.fetchMore({
            variables: { pageIndex: nextPageIndex, pageLimit },
          });
          break;
        case 'past':
          await past.fetchMore({
            variables: { pageIndex: nextPageIndex, pageLimit },
          });
          break;
      }

      setPageIndex(nextPageIndex);
    } catch (error) {
      console.error('Failed to load more appointments:', error);
      setNewItemsStartIndex(null);
    }
  };

  const hasMore = current.data.length > (pageIndex + 1) * pageLimit;

  useEffect(() => {
    if (newItemsStartIndex === null || !listRef.current) return;

    const timer = setTimeout(() => {
      const newItem = listRef.current?.querySelector(
        `[data-appointment-index="${newItemsStartIndex}"]`
      );

      if (newItem) {
        newItem.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }

      setNewItemsStartIndex(null);
    }, 300);

    return () => clearTimeout(timer);
  }, [newItemsStartIndex, current.data.slice.length]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 min-h-screen relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary-deep-blue)' }}>
            {title}
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-primary-slate-gray)' }}>
            {currentUser?.userRole === 'doctor' ? 'Manage your appointments with patients' : 'View your upcoming and past appointments'}
          </p>
        </div>
        
         {/* Actions */}
        <div className="flex items-center gap-3">
           {currentUser?.userRole === 'patient' && (
            <button
              className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2"
              style={{
                backgroundColor: 'var(--color-accent-purple)',
                color: 'var(--color-white)',
                boxShadow: '0 4px 20px rgba(175, 111, 174, 0.5)',
              }}
            >
              <CalendarPlus className="w-4 h-4" />
              New Appointment
            </button>
          )}
        </div>
      </div>
    <Box ref={listRef} sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* View Tabs */}
      <Box sx={{  display: 'flex', gap: 1 }}>
        {(['pending', 'upcoming', 'past'] as ViewType[]).map((viewType) => (
          <button
            key={viewType}
            onClick={() => handleViewChange(viewType)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              view === viewType
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={view === viewType ? { backgroundColor: 'var(--color-accent-purple)', color: '#fff' } : {}}
          >
            {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
          </button>
        ))}
      </Box>

      <StepperContent
        view={view}
        data={current.data}
        isLoading={current.loading}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        newItemsStartIndex={newItemsStartIndex}
      />
    </Box>
   </div>
  );
};