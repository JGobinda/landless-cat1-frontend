import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { CameraCapture } from '../CameraCapture';
import { GroupTitle } from './Step0Applicant';

export const Step5Biometric: React.FC = () => {
  const { formData, updateFormData, setStep } = useFormContext();
  const applicantPhoto = formData.applicantPhoto;

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in zoom-in-95 duration-700 px-4">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-12 flex flex-col items-center">
        <div className="text-center mb-12">
           <h2 className="text-2xl font-black text-[#1a4a8c] uppercase tracking-tight mb-2">Biometric Verification</h2>
           <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">बायोमेट्रिक प्रमाणीकरण</span>
        </div>

        <div className="w-full max-w-2xl bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 p-12 flex flex-col items-center justify-center">
           <CameraCapture 
             onCapture={(img) => updateFormData({ applicantPhoto: img })} 
             currentImage={applicantPhoto}
           />
           
           <div className="mt-10 text-center max-w-md">
             <p className="text-sm font-bold text-slate-600 leading-relaxed">
               Please capture a clear Photo.
             </p>
             <p className="text-[11px] font-medium text-slate-400 mt-2 italic">
               (कृपया अन्तिम पहिचान प्रमाणीकरणको लागि आवेदकको स्पष्ट र अगाडि फर्केको फोटो खिच्नुहोस्।)
             </p>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 mt-16 w-full max-w-2xl">
           <button 
             type="button"
             onClick={() => setStep(4)}
             className="flex-1 w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:text-slate-600 transition-all"
           >
             Back to Economic Data
           </button>
           <button 
             type="button"
             onClick={() => setStep(6)}
             className="flex-1 w-full py-5 bg-[#1a4a8c] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#1a4a8c]/90 shadow-xl shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
             disabled={!applicantPhoto}
           >
             Proceed to Final Review
           </button>
        </div>
        {!applicantPhoto && (
          <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest mt-4">Photo capture is required to proceed</span>
        )}
      </div>
    </div>
  );
};
