import React, { useState } from 'react';
import { X, Shield, Lock, Mail, Eye, EyeOff, KeyRound, AlertTriangle } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useApp } from '../../context/AppContext';

export const AdminLoginModal: React.FC = () => {
  const { isAdminLoginOpen, setIsAdminLoginOpen, loginAdmin } = useApp();

  const [email, setEmail] = useState('admin@glossytheory.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAdminLoginOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = loginAdmin(password.trim());
    if (!success) {
      setErrorMsg('Invalid administrative credentials. Access restricted to authorized staff.');
    }
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@glossytheory.com');
    setPassword('admin123');
    loginAdmin('admin123');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-[#1C1A19] text-[#EDE0D4] rounded-3xl max-w-md w-full overflow-hidden border border-[#3E3734] shadow-2xl relative animate-scale-in">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAdminLoginOpen(false)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#292624] hover:bg-[#383330] text-stone-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Banner */}
        <div className="p-8 text-center bg-gradient-to-b from-[#282321] to-[#1C1A19] border-b border-[#36302D]">
          <div className="w-12 h-12 rounded-2xl bg-[#DC143C]/20 border border-[#DC143C]/40 text-[#DC143C] flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <Logo size="md" light={true} className="justify-center" />
          <h2 className="font-serif text-lg font-semibold text-white mt-3">
            Atelier Staff & Administrator Portal
          </h2>
          <p className="text-xs text-[#9E8B83] mt-1">
            Restricted access for inventory, orders, products, and analytics management.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#BCAEA6] mb-1">
              Staff Email / Operator ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#242120] border border-[#443D39] rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-[#DC143C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#BCAEA6] mb-1">
              Master Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password (e.g. admin123)"
                required
                className="w-full pl-9 pr-10 py-2.5 text-xs bg-[#242120] border border-[#443D39] rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-[#DC143C]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Authenticate Staff Session</span>
          </button>

          {/* 1-Click Demo Login Helper */}
          <div className="pt-4 border-t border-[#312B28] text-center">
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="px-4 py-2 bg-[#2D2826] hover:bg-[#3B3431] text-[#FDEBD0] text-xs font-semibold rounded-full border border-[#4A423E] transition-colors"
            >
              ⚡ Instant 1-Click Admin Access (Demo Mode)
            </button>
            <p className="text-[10px] text-stone-500 mt-1.5">
              Default password: <code className="text-[#DC143C]">admin123</code>
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
