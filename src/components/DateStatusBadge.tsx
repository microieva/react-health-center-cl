import React from 'react';

interface DateStatusBadgeProps {
  timestamp?: string;
  isNext?: boolean;
  icon?: React.ReactNode;
  label?: string;
}

interface StatusColor {
  background: string;
  text: string;
  border: string;
  statusLabel?: string;
}

const getDateStatusColor = (timestamp?: string): StatusColor => {
  const date = new Date(timestamp ? timestamp : '');
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  // Upcoming - more than 1 day in the future
  if (diffInDays > 1) {
    return {
      background: 'var(--color-accent-purple)',
      text: 'var(--color-primary-light-gray)',
      border: 'var(--color-accent-purple-border)',
      statusLabel: 'upcoming'
    };
  }

  // Today - within the next 24 hours
  if (diffInDays >= 0 && diffInDays <= 1) {
    return {
      background: '#dcfce7',
      text: '#166534',
      border: '#86efac',
      statusLabel: 'today'
    };
  }

  // Past - more than 1 day in the past
  if (diffInDays <1) {
    return {
      background: 'var(--color-primary-slate-gray)',
      text: 'var(--color-primary-medium-gray)',
      border: 'var(--color-primary-slate-gray)',
      statusLabel: 'past'
    };
  }

  // Fallback
  return {
    background: 'var(--color-bg-light-blue)',
    text: 'var(--color-primary-slate-gray)',
    border: 'var(--color-primary-light-gray)',
    statusLabel: 'pending'
  };
};

export const DateStatusBadge: React.FC<DateStatusBadgeProps> = ({ 
  timestamp, 
  isNext,
  icon,
  label
}) => {
  const statusColor = getDateStatusColor(timestamp);
  const { background, text, border, statusLabel } = statusColor;

  return (
    <div className="inline-flex items-center gap-1">
      {isNext && (
        <span 
          className="px-3 py-0.2 border border-status-green rounded-full text-xs font-bold bg-status-green text-primary-light-gray flex-shrink-0"
        >
          next
        </span>
      )}
      <span
        className={`px-3 py-0.2 rounded-full text-xs font-bold border `}
        style={{ 
          backgroundColor: background,
          color: text,
          borderColor: border,
        }}
      >
        {icon && <span className="mr-1 w-2 h-2">{icon}</span>}
        {label || statusLabel}
      </span>
    </div>
  );
};
