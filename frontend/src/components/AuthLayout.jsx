import React from 'react';
import { LampContainer } from './ui/Lamp';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 antialiased">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <LampContainer className="opacity-50 sm:opacity-70" />
        </div>
        <div className="relative z-10 w-full">
          {/* Logo or branding could go here */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Scholars Connect
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Connecting mentors and students for success
            </p>
          </div>
          
          {/* Auth form container */}
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;