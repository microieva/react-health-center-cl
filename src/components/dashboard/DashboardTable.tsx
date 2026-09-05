import { Calendar, FileText, MoreVertical, UserCircle } from "lucide-react"
import { formatDate, formatTime } from "../../utils/utils"
import { useAuth } from "../../utils/AuthProvider";
import { useMemo } from "react";
import type { User, PagedResponse, Record, Appointment } from "../../types";
import { DateStatusBadge } from "../DateStatusBadge";

export type TableData = PagedResponse<User> | PagedResponse<Record> | PagedResponse<Appointment>;

interface DashboardTableProps {
  data: TableData;
  title?: string;
  subtitle?: string;
  onViewAll?: () => void;
  onRowClick?: (item: any) => void;
  emptyMessage?: string;
}

const isUser = (item: any): item is User => {
  return item && 'email' in item && 'firstName' in item && 'lastName' in item;
};

const isRecord = (item: any): item is Record => {
  return item && 'title' in item && 'patient' in item;
};

const isAppointment = (item: any): item is Appointment => {
  return item && 'start' in item && 'end' in item && 'patient' in item;
};

export const DashboardTable: React.FC<DashboardTableProps> = ({
  data,
  title,
  subtitle,
  onViewAll,
  onRowClick,
  emptyMessage = 'No items to display',
}) => {
  const { currentUser } = useAuth();

  const tableConfig = useMemo(() => {
    if (!data || !data.slice || data.slice.length === 0) {
      return {
        type: 'empty' as const,
        items: [],
        total: 0,
        displayFields: [],
      };
    }

    const firstItem = data.slice[0];
    const total = data.length;

    if (isUser(firstItem)) {
      return {
        type: 'user' as const,
        items: data.slice as User[],
        total,
        displayFields: [
          { key: 'name', label: 'Name', render: (item: User) => `${item.firstName} ${item.lastName}` },
          { key: 'email', label: 'Email', render: (item: User) => item.email },
          { key: 'createdAt', label: 'Joined', render: (item: User) => formatDate(new Date(item.createdAt)) },
        ],
      };
    }

    if (isRecord(firstItem)) {
      return {
        type: 'record' as const,
        items: data.slice as Record[],
        total,
        displayFields: [
          { key: 'title', label: 'Title', render: (item: Record) => item.title },
          { key: 'patient', label: 'Patient', render: (item: Record) => `${item.patient.firstName} ${item.patient.lastName}` },
          { key: 'createdAt', label: 'Created', render: (item: Record) => formatDate(new Date(item.createdAt)) },
        ],
      };
    }

    if (isAppointment(firstItem)) {
      return {
        type: 'appointment' as const,
        items: data.slice as Appointment[],
        total,
        displayFields: [
          { key: 'patient', label: 'Patient', render: (item: Appointment) => `${item.patient.firstName} ${item.patient.lastName}` },
          { key: 'start', label: 'Date & Time', render: (item: Appointment) => new Date(item.start).toLocaleString() },
          { key: 'duration', label: 'Duration', render: (item: Appointment) => {
            const duration = new Date(item.end).getTime() - new Date(item.start).getTime();
            const minutes = Math.floor(duration / 60000);
            return `${minutes} min`;
          }},
        ],
      };
    }

    return {
      type: 'empty' as const,
      items: [],
      total: 0,
      displayFields: [],
    };
  }, [data]);

  const getDefaultTitle = () => {
    if (title) return title;

    switch (tableConfig.type) {
      case 'user':
        return 'Doctor Contracts';
      case 'record':
        return 'Record Drafts';
      case 'appointment':
        return 'Latest Patients';
      default:
        return 'Items';
    }
  };

  const getDefaultSubtitle = () => {
    if (subtitle) return subtitle;

    switch (tableConfig.type) {
      case 'user':
        return 'Recently signed contracts';
      case 'record':
        return 'Recently created medical record drafts';
      case 'appointment':
        return 'Recently scheduled patients';
      default:
        return '';
    }
  };

  const getItemIcon = (item: any) => {
    if (isUser(item)) {
      return <UserCircle className="w-6 h-6 text-[var(--primary-deep-blue)] opacity-60" />;
    }
    if (isRecord(item)) {
      return <FileText className="w-6 h-6 text-[var(--primary-deep-blue)] opacity-60" />;
    }
    if (isAppointment(item)) {
      return <Calendar className="w-6 h-6 text-[var(--primary-deep-blue)] opacity-60" />;
    }
    return <UserCircle className="w-6 h-6 text-[var(--primary-deep-blue)] opacity-60" />;
  };

  const getItemName = (item: any): string => {
    if (isUser(item)) {
      return `${item.firstName} ${item.lastName}`;
    }
    if (isRecord(item)) {
      return item.title;
    }
    if (isAppointment(item)) {
      return `${item.patient.firstName} ${item.patient.lastName}`;
    }
    return 'Unknown';
  };

  const getItemSubtext = (item: any): string | null => {
    if (isUser(item)) {
      return `${formatDate(new Date(item.createdAt))}`;
    }
    if (isRecord(item)) {
      return `${item.patient.firstName} ${item.patient.lastName}`;
    }
    if (isAppointment(item)) {
      return formatDate(new Date(item.start));
    }
    return null;
  };

  const handleRowClick = (item: any) => {
    if (onRowClick) {
      onRowClick(item);
    }
  };

  if (!data || data.slice.length === 0) {
    return (
      <div
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: 'var(--color-primary-light-gray)'}}
      >
        <div className="p-4 md:p-2 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-primary-light-gray)' }}>
          <div>
            <h3 className="font-semibold text-lg" style={{ color: 'var(--color-primary-deep-blue)' }}>
              {getDefaultTitle()}
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-primary-slate-gray)' }}>
              {getDefaultSubtitle()}
            </p>
          </div>
        </div>
        <div className="p-8 text-center text-sm text-[var(--color-secondary-light-blue)]">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: 'var(--color-primary-light-gray)' }}
    >
      <div className="p-4 md:p-2 border-b flex items-center justify-between" 
        style={{ 
          borderColor: 'var(--color-primary-light-gray)', 
          backgroundColor: 'var(--color-primary-light-gray)'
        }}>
        <div>
          <h3 className="font-semibold text-lg" >
            {getDefaultTitle()}
          </h3>
          <p className="text-sm">
            {getDefaultSubtitle()}
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="text-sm font-medium transition-all duration-200 hover:opacity-70"
          style={{ color: 'var(--color-accent-purple)' }}
        >
          View All ({tableConfig.total})
        </button>
      </div>

      <div className="divide-y" style={{ borderColor: 'var(--color-primary-light-gray)' }}>
        {tableConfig.items.map((item: any, index: any) => (
          <div
            key={item.id || index}
            className="px-3 py-1 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => handleRowClick(item)}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0">
                {getItemIcon(item)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm truncate" style={{ color: 'var(--color-primary-slate-gray)' }}>
                  {getItemName(item)}
                </p>
                <div className="flex items-center gap-2">
                  {getItemSubtext(item) && (
                    <>
                      {currentUser?.userRole === 'admin' && (
                      <>
                        <span className="text-xs truncate" style={{ color: 'var(--color-primary-slate-gray)' }}>created</span>
                        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-primary-medium-gray)' }} />
                        <span className="text-xs truncate" style={{ color: 'var(--color-primary-slate-gray)' }}>
                          <em>{getItemSubtext(item)}</em>
                        </span>
                      </>)
                      }
                      {currentUser?.userRole === 'doctor' && isRecord(item) && (
                      <>
                        <span className="text-xs truncate" style={{ color: 'var(--color-primary-slate-gray)' }}>{getItemSubtext(item)}</span>
                        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-primary-medium-gray)' }} />
                        <span className="text-xs truncate" style={{ color: 'var(--color-primary-slate-gray)' }}>
                          <em>{formatDate(new Date(item.createdAt))}</em>
                        </span>
                      </>)
                      }
                      {currentUser?.userRole === 'doctor' && isAppointment(item) && (
                      <>
                        <span className="text-xs truncate" style={{ color: 'var(--color-primary-slate-gray)' }}>
                          {formatTime(new Date(item.start))}
                        </span>
                        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-primary-medium-gray)' }} />
                        <span className="text-xs truncate" style={{ color: 'var(--color-primary-slate-gray)' }}>
                          <em>{formatDate(new Date(item.start))}</em>
                        </span>
                      </>)
                      }
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isAppointment(item) && (
                <DateStatusBadge timestamp={item.start} />
              )}
              <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <MoreVertical className="w-4 h-4" style={{ color: 'var(--color-secondary-light-blue)' }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};