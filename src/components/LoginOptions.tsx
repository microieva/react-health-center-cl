import { useState } from "react";
import { CustomModal } from "./Modal";
import {LoginFormPsw} from "./FormLogin";
import { 
  User, 
  Stethoscope, 
  Shield, 
  Sparkles,
  Hospital,
  Clock,
  Lock
} from 'lucide-react';
import { OptionCard } from "./OptionCard";
import GoogleLogin from "./GoogleLogin";
import { useAuth } from "../utils/AuthProvider";
import { useBankingAuth } from "../hooks/useBankingAuth";

export const LoginOptions: React.FC = () => {
  const [isAdminLoggingIn, setIsAdminLoggingIn] = useState(false);
  const [isDoctorLoggingIn, setIsDoctorLoggingIn] = useState(false);
  const [isPatientLoggingIn, setIsPatientLoggingIn] = useState(false);
  const { isLoggedIn } = useAuth();
  const { initiateLogin } = useBankingAuth();

  const handlePatientLoginClick = () => {
    setIsPatientLoggingIn(true);
    initiateLogin();
  };

  const handleDoctorLoginClick = () => {
    setIsDoctorLoggingIn(true);
  };

  const handleAdminLoginClick = () => {
    setIsAdminLoggingIn(true);
  };

  return (
    <>
    {
      !isAdminLoggingIn && !isDoctorLoggingIn && !isPatientLoggingIn && 
    
      <div className="min-h-screen flex items-center justify-center p-4" 
          style={{ backgroundColor: '#f1f5f9' }}>
        {/* Decorative gradient orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(175, 111, 174, 0.15), transparent 70%)' }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent 70%)' }} />

        {/* Main Container */}
        <div className="relative w-full max-w-4xl">
          {/* Decorative header accent */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-32 h-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, #af6faee6, rgba(175, 111, 174, 0.3))' }} />

          <div className="rounded-2xl p-8 shadow-xl border"
              style={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 10px 10px -5px rgba(15, 23, 42, 0.04)'
              }}>
            
            {/* Header */}
            <div className="text-center mb-10">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(175, 111, 174, 0.1), rgba(175, 111, 174, 0.03))',
                      borderColor: 'rgba(175, 111, 174, 0.15)',
                      border: '1px solid'
                    }}>
                  <Hospital className="w-8 h-8" style={{ color: '#af6faee6' }} />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#0f172a' }}>
                Welcome to Health Center
              </h2>
              <p className="text-sm" style={{ color: '#475569' }}>
                Select your role to access the platform
              </p>
              
              {/* Quick info badges */}
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-xs" style={{ color: '#64748b' }}>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Secure Login</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: '#64748b' }}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>24/7 Access</span>
                </div>
              </div>
            </div>

            {/* Role Selection Cards - Horizontal Layout */}
            <div className="flex flex-col gap-4">
              {/* Patient Card */}
              <OptionCard
                title="Patient"
                description="Book appointments, view medical records, and communicate with your healthcare providers"
                features={['Appointments', 'Records', 'Messaging']}
                icon={<User className="w-10 h-10" />}
                onClick={handlePatientLoginClick}
              />

              {/* Doctor Card  */}

              <OptionCard
                title="Doctor"
                description="Manage patient appointments, update medical records, and write prescriptions"
                features={['Patients', 'Schedule', 'EMR']}
                icon={<Stethoscope className="w-10 h-10" />}
                onClick={handleDoctorLoginClick}
              />

              {/* Admin Card  */}

              <OptionCard
                title="Admin"
                description="System administration, user management, and platform oversight"
                features={['Users', 'Settings', 'Analytics']}
                icon={<Shield className="w-10 h-10" />}
                onClick={handleAdminLoginClick}
              />

            </div>

            {/* Footer */}
            <div className="mt-10 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-4 h-4" style={{ color: '#af6faee6' }} />
                <span className="text-sm font-medium" style={{ color: '#0f172a' }}>
                  Secure • Reliable • Trusted
                </span>
                <Sparkles className="w-4 h-4" style={{ color: '#af6faee6' }} />
              </div>
              
              {/* Demo Credentials */}
              <div className="inline-block p-3 rounded-lg border border-dashed"
                  style={{
                    borderColor: 'rgba(175, 111, 174, 0.2)',
                    backgroundColor: '#f1f5f9'
                  }}>
                <p className="text-xs" style={{ color: '#64748b' }}>
                  <span className="font-medium" style={{ color: '#af6faee6' }}>Demo:</span>{' '}
                  Use any role with any email/password to test
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
      <CustomModal
          isOpen={isAdminLoggingIn && !isLoggedIn}
          onClose={() => setIsAdminLoggingIn(false)}
       >
        <LoginFormPsw />
      </CustomModal>

       <CustomModal
          isOpen={isDoctorLoggingIn}
          onClose={() => setIsDoctorLoggingIn(false)}
       >
        <GoogleLogin />
      </CustomModal>
    </>
  );
}
