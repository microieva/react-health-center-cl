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