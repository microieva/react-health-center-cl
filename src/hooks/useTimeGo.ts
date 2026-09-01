import { useState, useEffect } from 'react';
import { formatTimeAgo } from '../utils/utils';


export const useTimeAgo = (dateString?: string) => {
  const [timeAgo, setTimeAgo] = useState<string>(() => formatTimeAgo(dateString));

  useEffect(() => {
    setTimeAgo(formatTimeAgo(dateString));

    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(dateString));
    }, 1000);

    return () => clearInterval(interval);
  }, [dateString]);

  return timeAgo;
};