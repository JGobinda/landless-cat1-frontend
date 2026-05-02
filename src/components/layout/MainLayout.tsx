import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { cn } from '../../lib/utils';
import { Home } from 'lucide-react';

const steps = [
  'Applicant Data',
  'Contact Details',
  'Family Details',
  'Preview',
];

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { step } = useFormContext();

  return (
    <div className="min-h-screen font-sans">
      {/* Top Banner */}
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10 text-white">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all group">
              <div className="bg-white/10 p-2 rounded-lg border border-white/10">
                <Home size={18} />
              </div>
              <span className="font-bold text-sm tracking-tight">Portal Home</span>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Government of Nepal</span>
              <span className="text-sm font-light tracking-tight">National ID & Civil Registration</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Nepal.svg" alt="Nepal Flag" className="h-4" />
             </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
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

      <main className="max-w-[1400px] mx-auto py-8">
        {children}
      </main>
    </div>
  );
};
