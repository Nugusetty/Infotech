import React, { useState, useEffect } from 'react';
import { X, Lock, User, LogIn, ArrowRight, Info } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string) => void;
  onSignInComplete: () => void;
}

type AuthStep = 'signin' | 'login';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onSignInComplete }) => {
  const [step, setStep] = useState<AuthStep>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('signin');
      setUsername('');
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (username && password) {
      // Trigger the "Sign in is completed" message
      onSignInComplete();
      
      // Move to Login step after a brief delay to allow the user to see the transition
      setTimeout(() => {
        setStep('login');
      }, 500);
    } else {
      setError('Please enter both username and password');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Accept whatever credentials were entered in the first step
    // This allows the user to register as admin with their chosen name
    if (username.trim() && password.trim()) {
      onLogin(username);
    } else {
      setError('Invalid credentials');
    }
  };

  const isSignInStep = step === 'signin';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 transition-all duration-300 transform">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            {isSignInStep ? (
               <>
                 <User size={18} className="text-accent" />
                 Sign In
               </>
            ) : (
               <>
                 <Lock size={18} className="text-accent" />
                 Admin Login
               </>
            )}
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-red-500 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={isSignInStep ? handleSignInSubmit : handleLoginSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center font-medium animate-pulse">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                // In login step, we still allow editing but it comes pre-filled
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-accent hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
            >
              {isSignInStep ? (
                <>
                    <span>Sign In</span>
                    <ArrowRight size={18} />
                </>
              ) : (
                <>
                    <LogIn size={18} />
                    <span>Login</span>
                </>
              )}
            </button>
          </div>
          
          {/* Helper / Info Text */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-2">
             <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
             <p className="text-xs text-blue-700">
               {isSignInStep 
                 ? "Create your session credentials to access the admin dashboard." 
                 : "Confirm your credentials to complete the login process."}
             </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;