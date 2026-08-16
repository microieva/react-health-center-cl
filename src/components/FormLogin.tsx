import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn,
  Shield,
  Sparkles
} from 'lucide-react';

export const LoginFormPsw = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center p-4" 
         style={{ backgroundColor: '#f1f5f9' }}>
      {/* Decorative gradient orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] rounded-full opacity-30 blur-3xl"
           style={{ background: 'radial-gradient(circle, rgba(175, 111, 174, 0.15), transparent 70%)' }} />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] rounded-full opacity-20 blur-3xl"
           style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent 70%)' }} />

      {/* Main Card */}
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
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#334155' }}>
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200"
                     style={{ color: '#64748b' }}>
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 outline-none"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    color: '#0f172a'
                  }}
                  placeholder="you@example.com"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#af6faee6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(175, 111, 174, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#cbd5e1';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#334155' }}>
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200"
                     style={{ color: '#64748b' }}>
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-200 outline-none"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    color: '#0f172a'
                  }}
                  placeholder="••••••••"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#af6faee6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(175, 111, 174, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#cbd5e1';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 hover:opacity-70"
                  style={{ color: '#64748b' }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password & Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded transition-all duration-200"
                  style={{
                    accentColor: '#af6faee6',
                    borderColor: '#cbd5e1'
                  }}
                />
                <span style={{ color: '#475569' }} className="group-hover:opacity-80 transition-opacity">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-sm transition-all duration-200 hover:opacity-70"
                style={{ color: '#af6faee6' }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-3 rounded-lg font-medium transition-all duration-300 overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #af6faee6, rgba(175, 111, 174, 0.8))',
                color: '#ffffff',
                boxShadow: '0 4px 15px rgba(175, 111, 174, 0.25)'
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: '#64748b' }}>
              Don't have an account?{' '}
              <button
                type="button"
                className="font-medium transition-all duration-200 hover:opacity-70"
                style={{ color: '#af6faee6' }}
              >
                Sign up now
              </button>
            </p>
          </div>

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
                Secure login with 2FA
              </span>
            </div>
          </div>

          {/* Demo credentials hint */}
          <div className="text-center p-3 rounded-lg border border-dashed"
               style={{
                 borderColor: 'rgba(175, 111, 174, 0.2)',
                 backgroundColor: '#f1f5f9'
               }}>
            <p className="text-xs" style={{ color: '#64748b' }}>
              <span className="font-medium" style={{ color: '#af6faee6' }}>Demo:</span>{' '}
              admin@email.com / demo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
