import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { cn } from '../../lib/utils';
import { Home, LogOut, User, LayoutDashboard } from 'lucide-react';
import { signOut } from '../../lib/firebase';

const steps = [
  'Applicant Data',
  'Contact Details',
  'Family Details',
  'Land & Housing',
  'Economic & Health',
  'Preview',
];

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { step, setStep, user, view, setView, resetForm } = useFormContext();

  return (
    <div className="min-h-screen font-sans bg-slate-50">
      {/* Top Banner - Government Branding */}
      <div className="bg-[#1a4a8c] text-white border-b-4 border-[#dc2626]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <div 
              className={cn(
                "flex items-center gap-3 cursor-pointer p-2 rounded-xl transition-all group",
                view === 'dashboard' ? "bg-white/10 border border-white/20" : "hover:bg-white/5"
              )}
              onClick={() => setView('dashboard')}
            >
              <div className="bg-white/20 p-2 rounded-lg">
                <LayoutDashboard size={18} />
              </div>
              <span className="font-bold text-sm tracking-tight hidden sm:block">Portal Home</span>
            </div>
            <div className="flex flex-col border-l border-white/20 pl-4 md:pl-6">
                <img src="https://citizenportal.donidcr.gov.np/_next/image?url=%2Femblem_of_Nepal.png&w=256&q=75" alt="Logo" className="w-8 h-8 mb-2" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#e2e8f0]/80">नेपl सरकार | Government of Nepal</span>
              <span className="text-xs md:text-sm font-black tracking-tight uppercase">Digital registry for landless and informal settlements</span>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
             <div className="flex items-center gap-2 md:gap-3 bg-white/10 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-white/10">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30 overflow-hidden shrink-0">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={14} className="text-white" />
                  )}
                </div>
                <div className="flex flex-col hidden xs:flex">
                  <span className="text-[10px] font-black uppercase tracking-tight text-white leading-none truncate max-w-[100px] md:max-w-none">
                    {user?.email === 'test@gmail.com' ? 'SYSTEM PERSONNEL' : (user?.displayName || 'PORTAL USER')}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-slate-300 mt-1">
                    {user?.email === 'test@gmail.com' ? 'ADMIN' : 'USER'}
                  </span>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                  title="Sign Out"
                >
                   <LogOut size={16} />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30 hidden md:block">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex items-center gap-1">
          <button 
            onClick={() => setView('dashboard')} 
            className={cn("px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors border-b-2", view === 'dashboard' ? "border-[#1a4a8c] text-[#1a4a8c]" : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50")}
          >
            Dashboard
          </button>
          <button 
            onClick={() => { resetForm(); setView('form'); }} 
            className={cn("px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors border-b-2", view === 'form' ? "border-[#1a4a8c] text-[#1a4a8c]" : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50")}
          >
            New Applicant
          </button>
          <button 
            onClick={() => setView('list')}
            className={cn("px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors border-b-2", view === 'list' ? "border-[#1a4a8c] text-[#1a4a8c]" : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50")}
          >
            Applicants
          </button>
        </div>
      </div>

      {/* Navigation Tabs - Light Mode Stepper */}
      {view === 'form' && step >= 0 && (
        <div className="sticky top-0 z-20 pt-4 bg-slate-50/80 backdrop-blur-md px-4">
          <div className="max-w-[1400px] mx-auto flex items-center gap-1 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm overflow-x-auto no-scrollbar">
            {steps.map((label, idx) => (
              <button
                key={label}
                onClick={() => setStep(idx)}
                className={cn(
                  "flex-1 min-w-[80px] sm:min-w-0 text-center py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  step === idx 
                    ? "bg-[#1a4a8c] text-white shadow-md" 
                    : idx < step 
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100" 
                      : "text-slate-400 hover:bg-slate-100"
                )}
              >
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{idx + 1}</span>
              </button>
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
