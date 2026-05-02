import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, LogIn, Lock, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth
    setTimeout(() => {
      onLogin();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-[#0f172a] flex items-center justify-center p-4 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden p-10">
          {/* Header */}
          <div className="text-center mb-10">
             <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-400/20 mb-8 shadow-inner shadow-indigo-500/50"
             >
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/23/Emblem_of_Nepal.svg" alt="Nepal Logo" className="h-12" />
             </motion.div>
             <h1 className="text-3xl font-light text-white tracking-tight leading-tight">Secure Portal Access</h1>
             <p className="text-slate-400 text-sm mt-3 font-medium uppercase tracking-widest text-[10px]">National Identity System</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-5">
               <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Request Identification</label>
                  <div className="relative group">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="ENTER APPLICATION NO."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 transition-all uppercase placeholder:text-slate-600 text-sm"
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Access Key (DOB)</label>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="date" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 transition-all text-sm [color-scheme:dark]"
                    />
                  </div>
               </div>
            </div>

            <button 
              disabled={isLoading}
              type="submit"
              className={cn(
                "w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl py-5 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50",
                isLoading && "cursor-wait"
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  Authenticate
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
             <p className="text-slate-500 text-xs font-medium">Technical support? <span className="text-indigo-400 cursor-pointer hover:underline">Contact Center</span></p>
          </div>
        </div>
      </motion.div>
      <div className="absolute bottom-8 text-white/10 text-[10px] font-mono tracking-widest uppercase">
        Protected by Government Cryptography v4.2
      </div>
    </div>
  );
};
