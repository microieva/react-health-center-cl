import React from 'react';

interface DateStatusBadgeProps {
  timestamp: string;
  showIcon?: boolean;
}

interface StatusColor {
  background: string;
  text: string;
  border: string;
  label: string;
}

const getDateStatusColor = (timestamp: string): StatusColor => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  // Upcoming - more than 1 day in the future
  if (diffInDays > 1) {
    return {
      background: 'var(--color-accent-purple)',
      text: 'var(--color-primary-light-gray)',
      border: 'var(--color-accent-purple-border)',
      label: 'upcoming',
    };
  }

  // Today - within the next 24 hours
  if (diffInDays >= 0 && diffInDays <= 1) {
    return {
      background: '#dcfce7',
      text: '#166534',
      border: '#86efac',
      label: 'today',
    };
  }

  // Past - more than 1 day in the past
  if (diffInDays <1) {
    return {
      background: 'var(--color-primary-slate-gray)',// var(--color-primary-charcoal)',
      text: 'var(--color-primary-medium-gray)',
      border: 'var(--color-primary-slate-gray)',
      label: 'past',
    };
  }

  // Fallback
  return {
    background: 'var(--color-bg-light-blue)',
    text: 'var(--color-primary-dark-gray)',
    border: 'var(--color-primary-light-gray)',
    label: 'unknown',
  };
};

export const DateStatusBadge: React.FC<DateStatusBadgeProps> = ({ 
  timestamp, 
  showIcon = false 
}) => {
  const statusColor = getDateStatusColor(timestamp);
  const { background, text, border, label } = statusColor;

  return (
    <span
      className={`px-3 py-0.2 rounded-full text-xs font-bold border inline-flex items-center gap-1`}
      style={{ 
        backgroundColor: background,
        color: text,
        borderColor: border,
      }}
    >
      {showIcon && (
        <span 
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: text }}
        />
      )}
      {label}
    </span>
  );
};
