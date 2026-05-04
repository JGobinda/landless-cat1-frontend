import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactData } from '../../lib/schema';
import { useFormContext } from '../../context/FormContext';
import { cn } from '../../lib/utils';
import locationsData from '../../lib/locations.json';
import { demographicService } from '../../services/demographicService';
import { toast } from 'react-hot-toast';
import Sanscript from 'sanscript';

// Type definition for the locations data
type Locations = {
  [state: string]: {
    [district: string]: {
      [localLevel: string]: string[];
    };
  };
};

const locations = locationsData as Locations;

// Helper component for this step
const FormField = ({ labelNp, labelEn, name, register, error, required, type = 'text', as = 'input', options = [], disabled, onChange }: any) => (
  <div className="flex flex-col sm:grid sm:grid-cols-[1fr_2fr] sm:items-center gap-2 sm:gap-6 py-4 border-b border-slate-100 last:border-0 group">
    <div className="flex flex-col gap-0.5 sm:mb-0 mb-1">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-[#1a4a8c] transition-colors">{labelNp}{required && <span className="text-[#dc2626]">*</span>}</span>
      <span className="text-xs font-bold text-slate-600 group-hover:text-slate-800 transition-colors">{labelEn}{required && <span className="text-[#dc2626]">*</span>}</span>
    </div>
    <div>
      {as === 'select' ? (
        <select 
          {...register(name)} 
          disabled={disabled}
          onChange={onChange}
          className={cn(
            "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a4a8c]/20 focus:bg-white outline-none uppercase transition-all disabled:opacity-30", 
            error && "border-red-500/50"
          )}
        >
          {options.map((opt: any) => <option key={opt.val} value={opt.val}>{opt.label}</option>)}
        </select>
      ) : (
        <input 
          type={type} 
          {...register(name)} 
          disabled={disabled}
          className={cn(
            "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a4a8c]/20 focus:bg-white outline-none uppercase transition-all placeholder:text-slate-400 disabled:opacity-30", 
            error && "border-red-500/50"
          )} 
        />
      )}
      {error && <span className="text-[10px] text-[#dc2626] font-bold mt-1 block">{error.message}</span>}
    </div>
  </div>
);

export const Step1Contact: React.FC = () => {
  const { formData, updateFormData, setStep, processId, setProcessId } = useFormContext();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
       permMobile: formData.permMobile || '',
       permState: formData.permState || '',
       permDistrict: formData.permDistrict || '',
       permLocalLevel: formData.permLocalLevel || '',
       permWard: formData.permWard || '',
       permVillageNp: formData.permVillageNp || '',
       permVillageEn: formData.permVillageEn || '',
       copyToTemp: formData.copyToTemp || false,
       ...formData as ContactData
    }
  });

  const handleTransliteration = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, name: keyof ContactData, enNameField?: keyof ContactData) => {
    const value = e.target.value;
    if (!value) return;
    
    // Round-Robin detection for phonetic typing
    const roman = Sanscript.t(value, 'devanagari', 'itrans');
    const transliterated = Sanscript.t(roman, 'itrans', 'devanagari');
    
    setValue(name, transliterated as any);
    
    if (enNameField) {
      setValue(enNameField, roman.toUpperCase() as any);
    }
  };

  const watchAllFields = watch();
  const copyToTemp = watchAllFields.copyToTemp;

  // Permanent Address Watches
  const permState = watchAllFields.permState;
  const permDistrict = watchAllFields.permDistrict;
  const permLocalLevel = watchAllFields.permLocalLevel;

  // Temporary Address Watches
  const tempState = watchAllFields.tempState;
  const tempDistrict = watchAllFields.tempDistrict;
  const tempLocalLevel = watchAllFields.tempLocalLevel;

  // Options memoization for Permanent Address
  const stateOptions = useMemo(() => [
    { val: '', label: 'SELECT STATE' },
    ...Object.keys(locations).map(s => ({ val: s, label: s }))
  ], []);

  const districtOptions = useMemo(() => {
    if (!permState || !locations[permState]) return [{ val: '', label: 'SELECT DISTRICT' }];
    return [
      { val: '', label: 'SELECT DISTRICT' },
      ...Object.keys(locations[permState]).map(d => ({ val: d, label: d }))
    ];
  }, [permState]);

  const localLevelOptions = useMemo(() => {
    if (!permState || !permDistrict || !locations[permState]?.[permDistrict]) return [{ val: '', label: 'SELECT LOCAL LEVEL' }];
    return [
      { val: '', label: 'SELECT LOCAL LEVEL' },
      ...Object.keys(locations[permState][permDistrict]).map(l => ({ val: l, label: l }))
    ];
  }, [permState, permDistrict]);

  const wardOptions = useMemo(() => {
    if (!permState || !permDistrict || !permLocalLevel || !locations[permState]?.[permDistrict]?.[permLocalLevel]) return [{ val: '', label: 'SELECT WARD' }];
    return [
      { val: '', label: 'SELECT WARD' },
      ...locations[permState][permDistrict][permLocalLevel].map(w => ({ val: w, label: w }))
    ];
  }, [permState, permDistrict, permLocalLevel]);

  // Options memoization for Temporary Address
  const tempDistrictOptions = useMemo(() => {
    const state = copyToTemp ? permState : tempState;
    if (!state || !locations[state]) return [{ val: '', label: 'SELECT DISTRICT' }];
    return [
      { val: '', label: 'SELECT DISTRICT' },
      ...Object.keys(locations[state]).map(d => ({ val: d, label: d }))
    ];
  }, [tempState, permState, copyToTemp]);

  const tempLocalLevelOptions = useMemo(() => {
    const state = copyToTemp ? permState : tempState;
    const district = copyToTemp ? permDistrict : tempDistrict;
    if (!state || !district || !locations[state]?.[district]) return [{ val: '', label: 'SELECT LOCAL LEVEL' }];
    return [
      { val: '', label: 'SELECT LOCAL LEVEL' },
      ...Object.keys(locations[state][district]).map(l => ({ val: l, label: l }))
    ];
  }, [tempState, tempDistrict, permState, permDistrict, copyToTemp]);

  const tempWardOptions = useMemo(() => {
    const state = copyToTemp ? permState : tempState;
    const district = copyToTemp ? permDistrict : tempDistrict;
    const localLevel = copyToTemp ? permLocalLevel : tempLocalLevel;
    if (!state || !district || !localLevel || !locations[state]?.[district]?.[localLevel]) return [{ val: '', label: 'SELECT WARD' }];
    return [
      { val: '', label: 'SELECT WARD' },
      ...locations[state][district][localLevel].map(w => ({ val: w, label: w }))
    ];
  }, [tempState, tempDistrict, tempLocalLevel, permState, permDistrict, permLocalLevel, copyToTemp]);

  // Sync Logic (Targeted dependencies instead of watchAllFields)
  const fieldsToSync = [
    watchAllFields.permPhone,
    watchAllFields.permMobile,
    watchAllFields.permState,
    watchAllFields.permDistrict,
    watchAllFields.permLocalLevel,
    watchAllFields.permWard,
    watchAllFields.permVillageNp,
    watchAllFields.permVillageEn
  ];

  React.useEffect(() => {
    if (copyToTemp) {
      setValue('tempPhone', watchAllFields.permPhone);
      setValue('tempMobile', watchAllFields.permMobile);
      setValue('tempState', watchAllFields.permState);
      setValue('tempDistrict', watchAllFields.permDistrict);
      setValue('tempLocalLevel', watchAllFields.permLocalLevel);
      setValue('tempWard', watchAllFields.permWard);
      setValue('tempVillageNp', watchAllFields.permVillageNp);
      setValue('tempVillageEn', watchAllFields.permVillageEn);
    }
  }, [copyToTemp, setValue, ...fieldsToSync]);

  const onSubmit = async (data: ContactData) => {
    setIsSubmitting(true);
    const updatedData = { ...formData, ...data };
    
    try {
      if (!processId) {
        // Create new record
        const response = await demographicService.createDemographic(updatedData);
        if (response.success) {
          setProcessId(response.data.processId);
          toast.success('Demographic record initialized');
        }
      } else {
        // Update existing record
        await demographicService.patchDemographic(processId, updatedData);
        toast.success('Demographic record updated');
      }
      
      updateFormData(data);
      setStep(2);
    } catch (error: any) {
      console.error('Demographic API Error:', error);
      toast.error(error.response?.data?.message || 'Failed to save demographic data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-right-8 duration-700 px-4">
       <div className="relative flex items-center gap-4 my-12">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-[11px] font-black text-[#1a4a8c] uppercase tracking-[0.25em] px-8 bg-slate-50 py-2 rounded-full border border-slate-200">Applicant Permanent Address</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 mb-10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-1">
           <FormField labelNp="फोन नं." labelEn="Phone" name="permPhone" register={register} error={errors.permPhone} />
           <FormField labelNp="मोबाईल नं." labelEn="Mobile" name="permMobile" register={register} error={errors.permMobile} />
           
           <FormField 
             labelNp="प्रदेश" 
             labelEn="State" 
             name="permState" 
             register={register} 
             error={errors.permState} 
             as="select" 
             options={stateOptions}
             onChange={(e: any) => {
               register('permState').onChange(e);
               setValue('permDistrict', '');
               setValue('permLocalLevel', '');
               setValue('permWard', '');
             }}
           />
           <FormField 
             labelNp="जिल्ला" 
             labelEn="District" 
             name="permDistrict" 
             register={register} 
             error={errors.permDistrict} 
             as="select" 
             options={districtOptions}
             onChange={(e: any) => {
               register('permDistrict').onChange(e);
               setValue('permLocalLevel', '');
               setValue('permWard', '');
             }}
           />

           <FormField 
             labelNp="गा.पा. / न.पा." 
             labelEn="Local Level" 
             name="permLocalLevel" 
             register={register} 
             error={errors.permLocalLevel} 
             as="select" 
             options={localLevelOptions}
             onChange={(e: any) => {
               register('permLocalLevel').onChange(e);
               setValue('permWard', '');
             }}
           />
           <FormField labelNp="वडा नं." labelEn="Ward" name="permWard" register={register} error={errors.permWard} as="select" options={wardOptions} />
           
           <FormField 
             labelNp="गाउँ / टोल" 
             name="permVillageNp" 
             register={register} 
             error={errors.permVillageNp} 
             placeholder="ENTER IN NEPALI"
             onChange={(e: any) => handleTransliteration(e, 'permVillageNp', 'permVillageEn')}
           />
           <FormField labelEn="Village/Tole" name="permVillageEn" register={register} error={errors.permVillageEn} placeholder="ENTER IN ENGLISH" />

        </div>
      </div>

      <div className="flex items-center gap-4 mb-8 bg-[#1a4a8c]/5 p-6 rounded-2xl border border-[#1a4a8c]/10 group transition-all hover:bg-[#1a4a8c]/10 cursor-pointer" onClick={() => setValue('copyToTemp', !copyToTemp)}>
        <div className={cn(
          "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
          copyToTemp ? "bg-[#1a4a8c] border-[#1a4a8c]" : "bg-white border-slate-200"
        )}>
          {copyToTemp && <div className="w-2 h-2 bg-white rounded-sm" />}
        </div>
        <span className="text-xs font-black text-[#1a4a8c] uppercase tracking-widest">Copy Permanent Address to Temporary</span>
        <input type="hidden" {...register('copyToTemp')} />
      </div>

      <div className="relative flex items-center gap-4 my-12">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-[11px] font-black text-[#1a4a8c] uppercase tracking-[0.25em] px-8 bg-slate-50 py-2 rounded-full border border-slate-200">Applicants Temporary Address</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 mb-10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-1">
           <FormField 
             labelNp="प्रदेश" 
             labelEn="State" 
             name="tempState" 
             register={register} 
             as="select" 
             options={stateOptions} 
             disabled={copyToTemp}
             onChange={(e: any) => {
               register('tempState').onChange(e);
               setValue('tempDistrict', '');
               setValue('tempLocalLevel', '');
               setValue('tempWard', '');
             }}
           />
           <FormField 
             labelNp="जिल्ला" 
             labelEn="District" 
             name="tempDistrict" 
             register={register} 
             as="select" 
             options={tempDistrictOptions} 
             disabled={copyToTemp}
             onChange={(e: any) => {
               register('tempDistrict').onChange(e);
               setValue('tempLocalLevel', '');
               setValue('tempWard', '');
             }}
           />
           <FormField 
             labelNp="गा.पा. / न.पा." 
             labelEn="Local Level" 
             name="tempLocalLevel" 
             register={register} 
             as="select" 
             options={tempLocalLevelOptions} 
             disabled={copyToTemp}
             onChange={(e: any) => {
               register('tempLocalLevel').onChange(e);
               setValue('tempWard', '');
             }}
           />
           <FormField labelNp="वडा नं." labelEn="Ward" name="tempWard" register={register} as="select" options={tempWardOptions} disabled={copyToTemp} />
           <FormField 
             labelNp="गाउँ / टोल" 
             name="tempVillageNp" 
             register={register} 
             error={errors.tempVillageNp} 
             disabled={copyToTemp}
             placeholder="ENTER IN NEPALI"
             onChange={(e: any) => handleTransliteration(e, 'tempVillageNp', 'tempVillageEn')}
           />
           <FormField labelEn="Village/Tole" name="tempVillageEn" register={register} error={errors.tempVillageEn} disabled={copyToTemp} placeholder="ENTER IN ENGLISH" />

        </div>
      </div>

      <div className="flex justify-between items-center mt-16 pb-12">
        <button 
          type="button"
          onClick={() => setStep(0)}
          className="px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 border border-slate-200 bg-white hover:text-slate-600 transition-all font-sans"
        >
          Return to Identity
        </button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="px-16 py-5 bg-[#1a4a8c] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#1a4a8c]/90 shadow-xl shadow-[#1a4a8c]/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? 'SAVING DATA...' : 'Confirm Registry'}
        </button>
      </div>
    </form>
  );
};
