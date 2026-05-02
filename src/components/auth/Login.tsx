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
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-600/20 blur-3xl -ml-16 -mb-16" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-8 border border-indigo-600/30">
            <LogIn className="w-8 h-8 text-indigo-400" />
          </div>
          
          <h1 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase">Personnel Login</h1>
          <p className="text-slate-500 text-xs mb-10 font-medium tracking-tight">Authentication required for data entry portal</p>

          <form onSubmit={handleLogin} className="w-full space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E.g. test@gmail.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white placeholder:text-slate-700 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-slate-700 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <p className="text-[10px] text-red-400 font-bold tracking-tight uppercase leading-relaxed text-center">{error}</p>
              </motion.div>
            )}

            <button
              disabled={isLoggingIn}
              className="w-full group flex items-center justify-center gap-4 px-6 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all active:scale-95 shadow-2xl shadow-indigo-600/20 disabled:opacity-50"
            >
              {isLoggingIn ? 'Verifying...' : 'Access Portal'}
              {!isLoggingIn && <LogIn className="w-4 h-4" />}
            </button>
          </form>

          <p className="mt-10 text-[9px] text-slate-600 uppercase tracking-widest font-black">
            Classified Environment — Do not share credentials
          </p>
        </div>
      </motion.div>
    </div>
  );
};
