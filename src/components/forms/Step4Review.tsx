import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { FileCheck, Download, CheckCircle, ArrowRight, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export const Step4Review: React.FC = () => {
  const { formData, setStep, saveData, resetForm, setView } = useFormContext();
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await saveData();
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

   if (isSubmitted) {
    return (
      <div className="max-w-[700px] mx-auto text-center py-20 px-6">
         <motion.div 
           initial={{ scale: 0.5, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="w-24 h-24 bg-emerald-50 border border-emerald-200 rounded-[2rem] flex items-center justify-center text-emerald-600 mx-auto mb-10 shadow-xl"
         >
            <CheckCircle size={48} />
         </motion.div>
         <h2 className="text-4xl font-black text-slate-800 mb-6 tracking-tight leading-tight uppercase">Registry Synchronized</h2>
         <p className="text-lg text-slate-500 font-medium mb-12 leading-relaxed">
            Identity credentials have successfully been verified and synchronized with the national registry. 
            The applicant record is now active in the system.
         </p>
         
         <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button 
                onClick={() => { resetForm(); setView('dashboard'); }}
                className="bg-slate-100 text-slate-600 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-200 transition-all"
              >
                Return to Dashboard
              </button>
              <button 
                onClick={() => { resetForm(); setStep(0); setView('form'); }}
                className="bg-[#1a4a8c] text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-[#1a4a8c]/90 transition-all shadow-xl shadow-blue-900/20 group"
              >
                <Plus size={18} />
                <span>Start New Registry</span>
              </button>
           </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 max-w-[1200px] mx-auto px-4">
       <div className="flex items-center justify-between mb-12 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Verification Review</h2>
          <div className="bg-amber-50 text-amber-600 border border-amber-200 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
             <FileCheck size={14} />
             Awaiting Final Confirmation
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Personal Summary */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 relative overflow-hidden group">
            <h3 className="text-[10px] font-black text-[#1a4a8c] uppercase tracking-[0.25em] mb-10 border-b border-slate-100 pb-4">Personal Identifiers</h3>
            <div className="space-y-6 relative z-10">
               <SummaryItem label="Full Name (EN)" value={`${formData.firstNameEn} ${formData.lastNameEn}`} />
               <SummaryItem label="Full Name (NP)" value={`${formData.firstNameNp} ${formData.lastNameNp}`} />
               <SummaryItem label="Birth Date" value={formData.dobEn} />
               <SummaryItem label="Gender" value={formData.gender} />
               <SummaryItem label="Citizenship No" value={formData.citizenshipNo} />
               <SummaryItem label="NID Number" value={formData.nidNo} />
               <SummaryItem label="Business" value={formData.business} />
               <SummaryItem label="Caste" value={formData.caste} />
               <SummaryItem label="Religion" value={formData.religion} />
            </div>
          </div>

          {/* Contact Summary */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 group">
             <h3 className="text-[10px] font-black text-[#1a4a8c] uppercase tracking-[0.25em] mb-10 border-b border-slate-100 pb-4">Geolocation Data</h3>
             <div className="space-y-6">
                <SummaryItem label="Regional State" value={formData.permState} />
                <SummaryItem label="Administrative District" value={formData.permDistrict} />
                <SummaryItem label="Locality" value={formData.permVillage} />
                <SummaryItem label="Secure Mobile" value={formData.permMobile} />
             </div>
          </div>
       </div>

       <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 mb-16 relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-[#1a4a8c]/5 rounded-full blur-[120px] pointer-events-none" />
          <h3 className="text-[10px] font-black text-[#1a4a8c] uppercase tracking-[0.25em] mb-10 border-b border-slate-100 pb-4">Family Lineage Registry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Father</h4>
                <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">{formData.fatherFirstNameEn} {formData.fatherLastNameEn}</p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Permanent Address</p>
                   <p className="text-[10px] text-slate-500 uppercase">
                     {formData.fatherPermLocalLevel}-{formData.fatherPermWard}, {formData.fatherPermDistrict}, {formData.fatherPermState}
                   </p>
                </div>
             </div>
             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Mother</h4>
                <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">{formData.motherFirstNameEn} {formData.motherLastNameEn}</p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Permanent Address</p>
                   <p className="text-[10px] text-slate-500 uppercase">
                     {formData.motherPermLocalLevel}-{formData.motherPermWard}, {formData.motherPermDistrict}, {formData.motherPermState}
                   </p>
                </div>
             </div>
             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Grandfather</h4>
                <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">{formData.grandFatherFirstNameEn} {formData.grandFatherLastNameEn}</p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Permanent Address</p>
                   <p className="text-[10px] text-slate-500 uppercase">
                     {formData.grandFatherPermLocalLevel}-{formData.grandFatherPermWard}, {formData.grandFatherPermDistrict}, {formData.grandFatherPermState}
                   </p>
                </div>
             </div>
          </div>
       </div>

       <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pb-12">
          <button 
             onClick={() => setStep(2)}
             className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-[#1a4a8c] transition-colors"
          >
             Modify Parameters
          </button>
          <button 
             onClick={handleSubmit}
             disabled={isSaving}
             className="w-full sm:w-auto px-20 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-emerald-900/20 hover:bg-emerald-500 transition-all flex items-center justify-center gap-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
             {isSaving ? 'Synchronizing...' : 'Finalize Submission'}
             {!isSaving && <ArrowRight size={18} />}
             {isSaving && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
          </button>
       </div>
    </div>
  );
};

const SummaryItem = ({ label, value }: { label: string, value?: any }) => (
  <div className="flex justify-between items-center group/item border-b border-slate-100 pb-4 last:border-0 last:pb-0">
    <span className="text-[9px] font-black text-slate-400 group-hover/item:text-[#1a4a8c] uppercase tracking-widest transition-colors">{label}</span>
    <span className="text-sm font-bold text-slate-800 uppercase tracking-tighter transition-all group-hover/item:scale-105">{value || 'UNSPECIFIED'}</span>
  </div>
);
