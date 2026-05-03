import React from 'react';
import { loginWithEmail } from '../../lib/firebase';
import { LogIn, UserCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const Login: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      setError('Invalid credentials. Please ensure test@gmail.com / test@123 is enabled in Firebase Console.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-[#dc2626]" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-[#1a4a8c]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#1a4a8c]/20">
              <img src="https://citizenportal.donidcr.gov.np/_next/image?url=%2Femblem_of_Nepal.png&w=256&q=75" alt="Logo" className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">नेपाल सरकार</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Government of Nepal</p>
            </div>
          </div>
          
          <h1 className="text-2xl font-black text-slate-800 mb-2 tracking-tighter uppercase text-center">Digital Registry for landless and informal settlements</h1>
          {/* <p className="text-slate-500 text-xs mb-10 font-medium tracking-tight text-center">Department of National ID and Civil Registration</p> */}

          <form onSubmit={handleLogin} className="w-full space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. test@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm text-slate-800 placeholder:text-slate-300 outline-none focus:border-[#1a4a8c]/50 focus:ring-4 focus:ring-[#1a4a8c]/5 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-800 placeholder:text-slate-300 outline-none focus:border-[#1a4a8c]/50 focus:ring-4 focus:ring-[#1a4a8c]/5 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-xl"
              >
                <p className="text-[10px] text-[#dc2626] font-bold tracking-tight uppercase leading-relaxed text-center">{error}</p>
              </motion.div>
            )}

            <button
              disabled={isLoggingIn}
              className="w-full group flex items-center justify-center gap-4 px-6 py-5 bg-[#1a4a8c] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#1a4a8c]/90 transition-all active:scale-95 shadow-xl shadow-blue-900/20 disabled:opacity-50"
            >
              {isLoggingIn ? 'Verifying...' : 'Login'}
              {!isLoggingIn && <LogIn className="w-4 h-4" />}
            </button>
          </form>

          <p className="mt-10 text-[9px] text-slate-400 uppercase tracking-widest font-black text-center">
            Authorized Personnel Only — Unauthorized access is prohibited
          </p>
        </div>
      </motion.div>
    </div>
  );
};