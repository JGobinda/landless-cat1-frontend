import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CategorySelection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('CAT1');
  const { updateFormData, setStep, setView } = useFormContext();

  const handleNext = () => {
    updateFormData({ category: selectedCategory as any });
    setStep(0);
  };

  const handleBack = () => {
    setView('dashboard'); 
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="p-8 border-b border-slate-100">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter">Applicants Category</h2>
          <p className="text-slate-500 mt-1 font-medium text-sm">Please Select Applicants according to their documents.</p>
        </div>

        <div className="p-8 space-y-4">
          {/* Category 1 */}
          <label 
            className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
              selectedCategory === 'CAT1' 
                ? 'border-slate-800 bg-slate-100' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="pt-1">
              <input 
                type="radio" 
                name="category" 
                value="CAT1"
                checked={selectedCategory === 'CAT1'}
                onChange={() => setSelectedCategory('CAT1')}
                className="w-5 h-5 accent-slate-800"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-bold text-slate-800 text-lg">Category First</span>
                <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">CAT1</span>
              </div>
              <p className="text-slate-500 text-sm">Having All Doucments</p>
            </div>
          </label>

          <label 
            className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
              selectedCategory === 'CAT2' 
                ? 'border-slate-800 bg-slate-100' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="pt-1">
              <input 
                type="radio" 
                name="category" 
                value="CAT2"
                checked={selectedCategory === 'CAT2'}
                onChange={() => setSelectedCategory('CAT2')}
                className="w-5 h-5 accent-slate-800"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-bold text-slate-800 text-lg">Category Second</span>
                <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">CAT2</span>
              </div>
              <p className="text-slate-500 text-sm">No NIN but having citizenship or voting card</p>
            </div>
          </label>

          <label 
            className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
              selectedCategory === 'CAT3' 
                ? 'border-slate-800 bg-slate-100' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="pt-1">
              <input 
                type="radio" 
                name="category" 
                value="CAT3"
                checked={selectedCategory === 'CAT3'}
                onChange={() => setSelectedCategory('CAT3')}
                className="w-5 h-5 accent-slate-800"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-bold text-slate-800 text-lg">Category Three</span>
                <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">CAT3</span>
              </div>
              <p className="text-slate-500 text-sm">Having No any documents</p>
            </div>
          </label>
        </div>

        <div className="p-8 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-4 px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.22em] hover:bg-slate-50 active:scale-95 transition-all"
          >
            <ChevronLeft size={18} />
            Back
          </button>
          
          <button
            onClick={handleNext}
            className="flex items-center gap-4 px-8 py-4 bg-[#1a4a8c] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.22em] hover:bg-[#1a4a8c]/90 active:scale-95 transition-all shadow-xl shadow-[#1a4a8c]/20"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
