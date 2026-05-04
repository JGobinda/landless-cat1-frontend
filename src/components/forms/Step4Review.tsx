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
            <div className="flex flex-col items-center mb-10">
               {formData.applicantPhoto ? (
                 <img src={formData.applicantPhoto} alt="Applicant" className="w-32 h-32 rounded-3xl object-cover border-4 border-slate-50 shadow-lg shadow-blue-900/10" />
               ) : (
                 <div className="w-32 h-32 rounded-3xl bg-slate-50 border-4 border-slate-100 flex items-center justify-center text-slate-300">
                   <Plus size={32} />
                 </div>
               )}
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-4">Verified Biometric Photo</span>
            </div>
            <div className="space-y-6 relative z-10">
               <SummaryItem label="Full Name (EN)" value={`${formData.firstNameEn} ${formData.lastNameEn}`} />
               <SummaryItem label="Full Name (NP)" value={`${formData.firstNameNp} ${formData.lastNameNp}`} />
               <SummaryItem label="Birth Date" value={formData.dobEn} />
               <SummaryItem label="Gender" value={formData.gender} />
               <SummaryItem label="Citizenship No" value={formData.citizenshipNo} />
               <SummaryItem label="NID Number" value={formData.nidNo} />
               <SummaryItem label="Rescue Location" value={formData.rescueLocation} />
               <SummaryItem label="Holding Center" value={formData.currentHoldingCenter} />
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
                <SummaryItem label="Locality (NP)" value={formData.permVillageNp} />
                <SummaryItem label="Locality (EN)" value={formData.permVillageEn} />
                <SummaryItem label="Secure Mobile" value={formData.permMobile} />
             </div>
          </div>
       </div>

       <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 mb-16 relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-[#1a4a8c]/5 rounded-full blur-[120px] pointer-events-none" />
          <h3 className="text-[10px] font-black text-[#1a4a8c] uppercase tracking-[0.25em] mb-10 border-b border-slate-100 pb-4">Family Lineage Registry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Grandmother</h4>
                <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">{formData.grandMotherFirstNameEn} {formData.grandMotherLastNameEn}</p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Permanent Address</p>
                   <p className="text-[10px] text-slate-500 uppercase">
                     {formData.grandMotherPermLocalLevel}-{formData.grandMotherPermWard}, {formData.grandMotherPermDistrict}, {formData.grandMotherPermState}
                   </p>
                </div>
             </div>
             {formData.spouseFirstNameEn && (
               <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Spouse</h4>
                  <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">{formData.spouseFirstNameEn} {formData.spouseLastNameEn}</p>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Permanent Address</p>
                     <p className="text-[10px] text-slate-500 uppercase">
                       {formData.spousePermLocalLevel}-{formData.spousePermWard}, {formData.spousePermDistrict}, {formData.spousePermState}
                     </p>
                  </div>
               </div>
             )}
          </div>
       </div>

       {formData.familyMembers && formData.familyMembers.length > 0 && (
         <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 mb-16 relative overflow-hidden">
            <h3 className="text-[10px] font-black text-[#1a4a8c] uppercase tracking-[0.25em] mb-10 border-b border-slate-100 pb-4">Other Family Members</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {formData.familyMembers.map((member: any, index: number) => (
                 <div key={index} className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Member {index + 1}</h4>
                    <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">{member.name}</p>
                    <div className="mt-4 space-y-2">
                       <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400 font-bold uppercase">Relation:</span>
                          <span className="text-slate-700 font-black uppercase tracking-tight">{member.relation}</span>
                       </div>
                       <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400 font-bold uppercase">Gender:</span>
                          <span className="text-slate-700 font-black uppercase tracking-tight">{member.landElsewhere}</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
       )}

         <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 mb-10 group relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
            <h3 className="text-[10px] font-black text-[#1a4a8c] uppercase tracking-[0.25em] mb-10 border-b border-slate-100 pb-4">Land & Housing Assets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
               <SummaryItem label="Land Ownership" value={formData.hasLandNepal === 'yes' ? 'HAS LAND' : 'NO LAND'} />
               {formData.hasLandNepal === 'no' && formData.landNoOwnershipReason && (
                 <SummaryItem label="Reason (Landless)" value={formData.landNoOwnershipReason} />
               )}
               {formData.hasLandNepal === 'yes' && (
                 <>
                   <SummaryItem label="Landowner" value={formData.landOwnerName} />
                   <SummaryItem label="Relation" value={formData.landRelationToHead} />
                   <SummaryItem label="Location" value={formData.landLocation} />
                   <SummaryItem label="Area" value={formData.landArea} />
                   <SummaryItem label="Usability" value={formData.isLandUsable} />
                 </>
               )}
               {(formData.hasLandNepal === 'no' || formData.isLandUsable === 'not_usable') && (
                 <SummaryItem label="Land Solution" value={formData.landSolutionOption} />
               )}
               <SummaryItem label="Has House" value={formData.hasHouse === 'yes' ? 'YES' : 'NO'} />
               {formData.hasHouse === 'yes' ? (
                 <SummaryItem label="House Type" value={formData.houseType} />
               ) : (
                 <SummaryItem label="Housing Solution" value={formData.housingSolutionOption} />
               )}
               <SummaryItem label="Required Form" value={formData.requiredHousingForm} />
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
            {/* Economic Summary */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 group relative overflow-hidden">
               <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
               <h3 className="text-[10px] font-black text-[#1a4a8c] uppercase tracking-[0.25em] mb-10 border-b border-slate-100 pb-4">Economic Status</h3>
               <div className="space-y-6">
                  <SummaryItem label="Main Income Source" value={formData.mainIncomeSource} />
                  <SummaryItem label="Monthly Income" value={formData.monthlyIncome} />
                  <SummaryItem label="Savings/Assets" value={formData.hasSavings === 'yes' ? 'HAS SAVINGS' : 'NO SAVINGS'} />
                  {formData.hasSavings === 'yes' && formData.savingsDetails && (
                    <SummaryItem label="Details" value={formData.savingsDetails} />
                  )}
                  <SummaryItem label="Empowerment Option" value={formData.empowermentOption} />
               </div>
            </div>

            {/* Health Summary */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 group relative overflow-hidden">
               <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
               <h3 className="text-[10px] font-black text-[#1a4a8c] uppercase tracking-[0.25em] mb-10 border-b border-slate-100 pb-4">Health Status</h3>
               <div className="space-y-6">
                  <SummaryItem label="Chronic Illness" value={formData.hasChronicIllness === 'yes' ? 'YES' : 'NO'} />
                  {formData.hasChronicIllness === 'yes' && formData.chronicIllnessDetails?.map((d: any, i: number) => d.who && (
                    <div key={i} className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Patient {i+1}</p>
                      <p className="text-xs font-bold text-slate-800">{d.who} - {d.disease} ({d.condition})</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 mb-16 relative overflow-hidden">
            <h3 className="text-[10px] font-black text-[#1a4a8c] uppercase tracking-[0.25em] mb-10 border-b border-slate-100 pb-4">Family Demographic Census</h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
               <SummaryItem label="Pregnant" value={formData.pregnantCount || '0'} />
               <SummaryItem label="Nursing" value={formData.nursingCount || '0'} />
               <SummaryItem label="Child < 5 (B)" value={formData.childrenUnder5Boy || '0'} />
               <SummaryItem label="Child < 5 (G)" value={formData.childrenUnder5Girl || '0'} />
               <SummaryItem label="Child 5-16 (M)" value={formData.children5to16Boy || '0'} />
               <SummaryItem label="Child 5-16 (F)" value={formData.children5to16Girl || '0'} />
               <SummaryItem label="Senior 65+ (M)" value={formData.seniors65PlusMale || '0'} />
               <SummaryItem label="Senior 65+ (F)" value={formData.seniors65PlusFemale || '0'} />
               <SummaryItem label="Disability (M)" value={formData.disabilityMale || '0'} />
               <SummaryItem label="Disability (F)" value={formData.disabilityFemale || '0'} />
            </div>
         </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pb-12">
           <button 
              onClick={() => setStep(5)}
              className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-[#1a4a8c] transition-colors"
           >
              Back to Biometrics
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
