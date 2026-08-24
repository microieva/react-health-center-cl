import { 
  Shield,
  Sparkles,
  ArrowRight,
  User,
  Clock
} from 'lucide-react';

type GoogleLoginProps = {
  onGoogleLogin: () => void;
  isLoading?: boolean;
};

const GoogleLogin = ({ 
  onGoogleLogin,
  isLoading = false
}: GoogleLoginProps) => {
  return (
    <div className="flex items-center justify-center p-4" 
         style={{ backgroundColor: '#f1f5f9' }}>
      {/* Decorative gradient orbs */}
      <div className="absolute top-[-20%] right-[-10%]  rounded-full opacity-30 blur-3xl"
           style={{ background: 'radial-gradient(circle, rgba(175, 111, 174, 0.15), transparent 70%)' }} />
      <div className="absolute bottom-[-20%] left-[-10%]  rounded-full opacity-20 blur-3xl"
           style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent 70%)' }} />

      {/* Main Container */}
      <div className="relative w-full max-w-md">
        {/* Decorative header accent */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-1 rounded-full"
             style={{ background: 'linear-gradient(90deg, #af6faee6, rgba(175, 111, 174, 0.3))' }} />

        <div className="rounded-2xl p-8 shadow-xl border"
             style={{
               backgroundColor: '#ffffff',
               borderColor: '#e2e8f0',
               boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 10px 10px -5px rgba(15, 23, 42, 0.04)'
             }}>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-xl"
                   style={{ 
                     background: 'linear-gradient(135deg, rgba(175, 111, 174, 0.1), rgba(175, 111, 174, 0.03))',
                     borderColor: 'rgba(175, 111, 174, 0.15)',
                     border: '1px solid'
                   }}>
                <Shield className="w-8 h-8" style={{ color: '#af6faee6' }} />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#0f172a' }}>
              Welcome Back
            </h2>
            <p className="text-sm" style={{ color: '#475569' }}>
              Continue with Google to access your account
            </p>
            
            {/* Quick info badges */}
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs" style={{ color: '#64748b' }}>
                <Shield className="w-3.5 h-3.5" />
                <span>Secure OAuth</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: '#64748b' }}>
                <Clock className="w-3.5 h-3.5" />
                <span>Quick Access</span>
              </div>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={onGoogleLogin}
            disabled={isLoading}
            className="relative w-full group transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-lg border-2 transition-all duration-300"
                 style={{
                   backgroundColor: '#ffffff',
                   borderColor: '#e2e8f0'
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.borderColor = '#af6faee6';
                   e.currentTarget.style.boxShadow = '0 8px 25px rgba(175, 111, 174, 0.12)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.borderColor = '#e2e8f0';
                   e.currentTarget.style.boxShadow = 'none';
                 }}>
              
              {/* Google Icon */}
              <div className="flex-shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              
              {/* Button Text */}
              <span className="flex-1 text-sm font-medium" style={{ color: '#0f172a' }}>
                {isLoading ? 'Connecting...' : 'Continue with Google'}
              </span>
              
              {/* Arrow Icon */}
              <div className="flex-shrink-0 transition-all duration-300 group-hover:translate-x-1"
                   style={{ color: '#64748b' }}>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
            
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg"
                   style={{
                     backgroundColor: 'rgba(255, 255, 255, 0.8)',
                     backdropFilter: 'blur(2px)'
                   }}>
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#af6faee6" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="#af6faee6" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: '#e2e8f0' }} />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3" style={{ 
                backgroundColor: '#ffffff',
                color: '#64748b'
              }}>
                Secure OAuth 2.0 Authentication
              </span>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg"
                 style={{
                   backgroundColor: '#f1f5f9'
                 }}>
              <div className="p-1.5 rounded-full flex-shrink-0"
                   style={{
                     backgroundColor: 'rgba(175, 111, 174, 0.08)',
                     color: '#af6faee6'
                   }}>
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xs" style={{ color: '#475569' }}>
                Your Google account information is securely handled
              </span>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg"
                 style={{
                   backgroundColor: '#f1f5f9'
                 }}>
              <div className="p-1.5 rounded-full flex-shrink-0"
                   style={{
                     backgroundColor: 'rgba(175, 111, 174, 0.08)',
                     color: '#af6faee6'
                   }}>
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs" style={{ color: '#475569' }}>
                No password needed - quick and secure access
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5" style={{ color: '#af6faee6' }} />
              <span className="text-xs" style={{ color: '#64748b' }}>
                Trusted by thousands of users
              </span>
              <Sparkles className="w-3.5 h-3.5" style={{ color: '#af6faee6' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default GoogleLogin;