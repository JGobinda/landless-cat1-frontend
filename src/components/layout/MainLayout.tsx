import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { cn } from '../../lib/utils';
import { Home, LogOut, User, LayoutDashboard } from 'lucide-react';
import { signOut } from '../../lib/firebase';

const steps = [
  'Applicant Data',
  'Contact Details',
  'Family Details',
  'Preview',
];

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { step, user, view, setView } = useFormContext();

  return (
    <div className="min-h-screen font-sans">
      {/* Top Banner */}
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10 text-white">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div 
              className={cn(
                "flex items-center gap-3 cursor-pointer p-2 rounded-xl transition-all group",
                view === 'dashboard' ? "bg-indigo-600/20 text-indigo-400 border border-indigo-600/30" : "hover:bg-white/5"
              )}
              onClick={() => setView('dashboard')}
            >
              <div className="bg-white/10 p-2 rounded-lg border border-white/10">
                <LayoutDashboard size={18} />
              </div>
              <span className="font-bold text-sm tracking-tight">Dashboard</span>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Government of Nepal</span>
              <span className="text-sm font-light tracking-tight tracking-tighter uppercase font-black">Passport Registration Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center border border-indigo-600/30 overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={14} className="text-indigo-400" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-tight text-white leading-none">
                    {user?.email === 'test@gmail.com' ? 'System Personnel' : (user?.displayName || 'User')}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 mt-1">
                    {user?.email === 'test@gmail.com' ? 'Verified Operator' : 'Applicant Access'}
                  </span>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="ml-2 p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                  title="Sign Out"
                >
                   <LogOut size={16} />
                </button>
             </div>
             <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Nepal.svg" alt="Nepal Flag" className="h-4" />
             </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Only show in form view */}
      {view === 'form' && (
        <div className="sticky top-0 z-20 mt-4 px-4">
          <div className="max-w-[1400px] mx-auto flex items-center gap-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 shadow-2xl">
            {steps.map((label, idx) => (
              <div
                key={label}
                className={cn(
                  "flex-1 text-center py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-default",
                  step === idx 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                    : idx < step 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "text-slate-400 hover:text-white"
                )}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      )}


      <main className="max-w-[1400px] mx-auto py-8">
        {children}
      </main>
    </div>
  );
};
