import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactData } from '../../lib/schema';
import { useFormContext } from '../../context/FormContext';
import { cn } from '../../lib/utils';
import locationsData from '../../lib/locations.json';

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
  <div className="grid grid-cols-[1fr_2fr] items-center gap-6 py-4 border-b border-white/5 last:border-0 group">
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter group-hover:text-indigo-400 transition-colors">{labelNp}{required && <span className="text-red-400">*</span>}</span>
      <span className="text-xs font-semibold text-white/50 group-hover:text-white transition-colors">{labelEn}{required && <span className="text-red-400">*</span>}</span>
    </div>
    <div>
      {as === 'select' ? (
        <select 
          {...register(name)} 
          disabled={disabled}
          onChange={onChange}
          className={cn(
            "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all uppercase [color-scheme:dark] disabled:opacity-30", 
            error && "border-red-500/50"
          )}
        >
          {options.map((opt: any) => <option key={opt.val} value={opt.val} className="bg-[#0f172a]">{opt.label}</option>)}
        </select>
      ) : (
        <input 
          type={type} 
          {...register(name)} 
          disabled={disabled}
          className={cn(
            "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all uppercase placeholder:text-slate-600 disabled:opacity-30", 
            error && "border-red-500/50"
          )} 
        />
      )}
      {error && <span className="text-[10px] text-red-400 font-medium mt-1 block">{error.message}</span>}
    </div>
  </div>
);

export const Step1Contact: React.FC = () => {
  const { formData, updateFormData, setStep } = useFormContext();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
       permMobile: formData.permMobile || '',
       permState: formData.permState || '',
       permDistrict: formData.permDistrict || '',
       permLocalLevel: formData.permLocalLevel || '',
       permWard: formData.permWard || '',
       permVillage: formData.permVillage || '',
       copyToTemp: formData.copyToTemp || false,
       ...formData as ContactData
    }
  });

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
    if (!tempState || !locations[tempState]) return [{ val: '', label: 'SELECT DISTRICT' }];
    return [
      { val: '', label: 'SELECT DISTRICT' },
      ...Object.keys(locations[tempState]).map(d => ({ val: d, label: d }))
    ];
  }, [tempState]);

  const tempLocalLevelOptions = useMemo(() => {
    if (!tempState || !tempDistrict || !locations[tempState]?.[tempDistrict]) return [{ val: '', label: 'SELECT LOCAL LEVEL' }];
    return [
      { val: '', label: 'SELECT LOCAL LEVEL' },
      ...Object.keys(locations[tempState][tempDistrict]).map(l => ({ val: l, label: l }))
    ];
  }, [tempState, tempDistrict]);

  const tempWardOptions = useMemo(() => {
    if (!tempState || !tempDistrict || !tempLocalLevel || !locations[tempState]?.[tempDistrict]?.[tempLocalLevel]) return [{ val: '', label: 'SELECT WARD' }];
    return [
      { val: '', label: 'SELECT WARD' },
      ...locations[tempState][tempDistrict][tempLocalLevel].map(w => ({ val: w, label: w }))
    ];
  }, [tempState, tempDistrict, tempLocalLevel]);

  // Sync Logic
  React.useEffect(() => {
    if (copyToTemp) {
      setValue('tempPhone', watchAllFields.permPhone);
      setValue('tempMobile', watchAllFields.permMobile);
      setValue('tempState', watchAllFields.permState);
      setValue('tempDistrict', watchAllFields.permDistrict);
      setValue('tempLocalLevel', watchAllFields.permLocalLevel);
      setValue('tempWard', watchAllFields.permWard);
      setValue('tempVillage', watchAllFields.permVillage);
    }
  }, [copyToTemp, setValue, watchAllFields]);

  const onSubmit = (data: ContactData) => {
    updateFormData(data);
    setStep(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-right-8 duration-700 px-4">
       <div className="relative flex items-center gap-4 my-10">
        <div className="flex-1 h-px bg-indigo-500/20" />
        <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.25em] px-8">Section: Permanent Geolocation</span>
        <div className="flex-1 h-px bg-indigo-500/20" />
      </div>

      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 mb-10 shadow-2xl">
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
           
           <FormField labelNp="गाउँ / टोल" labelEn="Village/Tole" name="permVillage" register={register} error={errors.permVillage} />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8 bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/20 group transition-all hover:bg-indigo-500/10 cursor-pointer" onClick={() => setValue('copyToTemp', !copyToTemp)}>
        <div className={cn(
          "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
          copyToTemp ? "bg-indigo-600 border-indigo-600" : "bg-white/5 border-white/10"
        )}>
          {copyToTemp && <div className="w-2 h-2 bg-white rounded-sm" />}
        </div>
        <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Mirror Permanent Address to Temporary</span>
        <input type="hidden" {...register('copyToTemp')} />
      </div>

      <div className="relative flex items-center gap-4 my-10">
        <div className="flex-1 h-px bg-indigo-500/20" />
        <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.25em] px-8">Section: Temporary Residency</span>
        <div className="flex-1 h-px bg-indigo-500/20" />
      </div>

      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 mb-10 shadow-2xl">
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
           <FormField labelNp="गाउँ / टोल" labelEn="Village/Tole" name="tempVillage" register={register} disabled={copyToTemp} />
        </div>
      </div>

      <div className="flex justify-between items-center mt-16 pb-12">
        <button 
          type="button"
          onClick={() => setStep(0)}
          className="px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 border border-white/10 hover:text-white hover:bg-white/5 transition-all"
        >
          Return to Identity
        </button>
        <button 
          type="submit"
          className="px-16 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
        >
          Confirm Registry
        </button>
      </div>
    </form>
  );
};

