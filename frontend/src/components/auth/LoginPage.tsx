import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Shield, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (credentials: any) => Promise<void>;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('regUser@gmail.com');
  const [password, setPassword] = useState('StrongPass123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onLogin({ email, password });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-200">
          <div className="text-center space-y-4 mb-10">
            <div className="w-20 h-20 bg-[#1a4a8c]/10 rounded-3xl flex items-center justify-center mx-auto border border-[#1a4a8c]/10">
              <Shield className="text-[#1a4a8c] w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Registry Access</h1>
              <p className="text-slate-500 text-sm font-medium tracking-tight mt-1 px-4">Authorized Personnel Only. Please verify your identity.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:border-[#1a4a8c]/50 transition-all"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Security Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:border-[#1a4a8c]/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100"
              >
                <AlertCircle size={18} className="shrink-0" />
                <p className="text-xs font-bold uppercase tracking-tight leading-relaxed">{error}</p>
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a4a8c] hover:bg-[#1a4980] text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all transform active:scale-95 shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  Authorize Access
                </>
              )}
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-slate-100">
            <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
              Proprietary System. Access monitoring is active. <br/> Unauthorized attempts will be logged.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
