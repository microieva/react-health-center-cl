export const getRedirectPath = (role?: string) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'patient':
        return '/patient/dashboard';
      default:
        return '/dashboard';
    }
  };

export const clearCallbackParams = (): void => {
  window.history.replaceState({}, '', window.location.pathname);
};

  export const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  export const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  export const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Expired':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  export const formatTimeAgo = (dateString?: string): string => {
    if (!dateString) {
      return "-"
    }
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // Less than 2 minutes
    if (diffInMinutes < 2) {
      return 'Just now';
    }

    // Less than 1 hour (under 60 minutes)
    if (diffInHours < 1) {
      return `${diffInMinutes} min ago`;
    }

    // Over 1 hour and under 6 hours
    if (diffInHours >= 1 && diffInHours < 6) {
      const remainingMinutes = diffInMinutes - (diffInHours * 60);
      if (remainingMinutes === 0) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      }
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ${remainingMinutes} min ago`;
    }

    // Over 6 hours and under 24 hours
    if (diffInHours >= 6 && diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    // Over 24 hours and under 72 hours
    if (diffInDays >= 1 && diffInDays < 3) {
      const remainingHours = diffInHours - (diffInDays * 24);
      if (remainingHours === 0) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      }
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ${remainingHours} hour${remainingHours > 1 ? 's' : ''} ago`;
    }

    // Over 72 hours
    //return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return formatDate(new Date(dateString))
  };

  export const capitalize = (str: string): string => {
    if (!str || str.length === 0) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  