import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { cn } from '../../lib/utils';
import { LogOut, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';
import { Footer } from './Footer';
import nepalEmblem from '../../assets/Emblem_of_Nepal.svg';

const steps = [
  'Applicant Data',
  'Contact Details',
  'Family Details',
  'Land & Housing',
  'Economic & Health',
  'Biometrics',
  'Preview',
];

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { step, setStep, user, view, setView, resetForm, logout } = useFormContext();

  return (
    <div className="min-h-screen font-sans bg-slate-50 flex flex-col">
      {/* Top Banner */}
      <div className="bg-[#1a4a8c] text-white border-b-4 border-[#dc2626]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-4">
              <img 
                src={nepalEmblem} 
                alt="Logo" 
                className="w-10 h-10 md:w-12 md:h-12 object-contain" 
              />
              <div className="flex flex-col">
                <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-[#e2e8f0]/80 leading-tight">नेपाल सरकार | Government of Nepal</span>
                <span className="text-sm md:text-base font-black tracking-tight uppercase leading-tight">Digital registry for landless and informal settlements</span>
              </div>
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
          
          <div className="ml-auto">
            <button 
              onClick={async () => {
                await logout();
                toast.success('Logged out successfully');
              }}
              className="flex items-center gap-2 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all rounded-lg"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
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


      <main className="max-w-[1400px] mx-auto py-8 flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
};
