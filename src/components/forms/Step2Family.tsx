import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { familySchema, FamilyData } from '../../lib/schema';
import { useFormContext } from '../../context/FormContext';
import { cn } from '../../lib/utils';
import locationsData from '../../lib/locations.json';

type Locations = {
  [state: string]: {
    [district: string]: {
      [localLevel: string]: string[];
    };
  };
};

const locations = locationsData as Locations;

const Row = ({ labelNp, labelEn, name, register, error, required, as = 'input', options = [], disabled, onChange }: any) => (
  <div className="grid grid-cols-[1fr_1fr] items-center gap-8 py-3 border-b border-white/5 last:border-0 group transition-all px-4">
     <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter group-hover:text-indigo-400 transition-colors">{labelNp}{required && <span className="text-red-400 ml-1">*</span>}</span>
        <span className="text-xs font-semibold text-white/50 group-hover:text-white transition-colors">{labelEn}</span>
     </div>
     <div className="flex flex-col">
        {as === 'select' ? (
          <select 
            {...register(name)} 
            disabled={disabled}
            onChange={onChange}
            className={cn(
              "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase [color-scheme:dark] disabled:opacity-30",
              error && "border-red-400/50 bg-red-400/5"
            )}
          >
            {options.map((opt: any) => <option key={opt.val} value={opt.val} className="bg-[#0f172a]">{opt.label}</option>)}
          </select>
        ) : (
          <input 
            {...register(name)} 
            disabled={disabled}
            className={cn(
              "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase placeholder:text-slate-600 disabled:opacity-30",
              error && "border-red-400/50 bg-red-400/5"
            )}
          />
        )}
        {error && <p className="text-[10px] text-red-400 font-medium mt-1 ml-1">{error.message}</p>}
     </div>
  </div>
);

const GroupHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-4 mb-6 mt-12 first:mt-0">
    <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] whitespace-nowrap">{title}</h3>
    <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/20 to-transparent" />
  </div>
);

export const Step2Family: React.FC = () => {
  const { formData, updateFormData, setStep } = useFormContext();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FamilyData>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      ...formData as FamilyData,
      fatherMirrorAddress: formData.fatherMirrorAddress || false
    }
  });

  const watchAll = watch();
  const fatherPermState = watchAll.fatherPermState;
  const fatherPermDistrict = watchAll.fatherPermDistrict;
  const fatherPermLocalLevel = watchAll.fatherPermLocalLevel;
  const fatherMirrorAddress = watchAll.fatherMirrorAddress;
  
  const fatherTempState = watchAll.fatherTempState;
  const fatherTempDistrict = watchAll.fatherTempDistrict;
  const fatherTempLocalLevel = watchAll.fatherTempLocalLevel;

  const stateOptions = useMemo(() => [
    { val: '', label: 'SELECT STATE' },
    ...Object.keys(locations).map(s => ({ val: s, label: s }))
  ], []);

  const getDistrictOptions = (state: string | undefined) => {
    if (!state || !locations[state]) return [{ val: '', label: 'SELECT DISTRICT' }];
    return [
      { val: '', label: 'SELECT DISTRICT' },
      ...Object.keys(locations[state]).map(d => ({ val: d, label: d }))
    ];
  };

  const getLocalLevelOptions = (state: string | undefined, district: string | undefined) => {
    if (!state || !district || !locations[state]?.[district]) return [{ val: '', label: 'SELECT LOCAL LEVEL' }];
    return [
      { val: '', label: 'SELECT LOCAL LEVEL' },
      ...Object.keys(locations[state][district]).map(l => ({ val: l, label: l }))
    ];
  };

  const getWardOptions = (state: string | undefined, district: string | undefined, localLevel: string | undefined) => {
    if (!state || !district || !localLevel || !locations[state]?.[district]?.[localLevel]) return [{ val: '', label: 'SELECT WARD' }];
    return [
      { val: '', label: 'SELECT WARD' },
      ...locations[state][district][localLevel].map(w => ({ val: w, label: w }))
    ];
  };

  const fatherPermDistrictOptions = useMemo(() => getDistrictOptions(fatherPermState), [fatherPermState]);
  const fatherPermLocalLevelOptions = useMemo(() => getLocalLevelOptions(fatherPermState, fatherPermDistrict), [fatherPermState, fatherPermDistrict]);
  const fatherPermWardOptions = useMemo(() => getWardOptions(fatherPermState, fatherPermDistrict, fatherPermLocalLevel), [fatherPermState, fatherPermDistrict, fatherPermLocalLevel]);

  const fatherTempDistrictOptions = useMemo(() => getDistrictOptions(fatherTempState), [fatherTempState]);
  const fatherTempLocalLevelOptions = useMemo(() => getLocalLevelOptions(fatherTempState, fatherTempDistrict), [fatherTempState, fatherTempDistrict]);
  const fatherTempWardOptions = useMemo(() => getWardOptions(fatherTempState, fatherTempDistrict, fatherTempLocalLevel), [fatherTempState, fatherTempDistrict, fatherTempLocalLevel]);

  // Sync Logic for Father
  React.useEffect(() => {
    if (fatherMirrorAddress) {
      setValue('fatherTempState', fatherPermState);
      setValue('fatherTempDistrict', fatherPermDistrict);
      setValue('fatherTempLocalLevel', fatherPermLocalLevel);
      setValue('fatherTempWard', watchAll.fatherPermWard);
    }
  }, [fatherMirrorAddress, fatherPermState, fatherPermDistrict, fatherPermLocalLevel, watchAll.fatherPermWard, setValue]);

  const onSubmit = (data: FamilyData) => {
    updateFormData(data);
    setStep(3);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-[1200px] mx-auto animate-in fade-in zoom-in-95 duration-700 px-4">
      <SectionCard title="Patrilineal Lineage">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-1 p-6">
            <Row labelNp="पहिलो नाम" labelEn="First Name" name="fatherFirstNameNp" register={register} error={errors.fatherFirstNameNp} />
            <Row labelNp="First Name" labelEn="पहिलो नाम" name="fatherFirstNameEn" register={register} error={errors.fatherFirstNameEn} />
            <Row labelNp="थर" labelEn="Last Name" name="fatherLastNameNp" register={register} error={errors.fatherLastNameNp} />
            <Row labelNp="Last Name" labelEn="थर" name="fatherLastNameEn" register={register} error={errors.fatherLastNameEn} />
            <Row labelNp="नागरिकता प्रमाण पत्र नं." labelEn="Citizenship No" name="fatherCitizenshipNo" register={register} />
            <Row labelNp="Nationality" labelEn="राष्ट्रियता" name="fatherNationality" register={register} />
         </div>

         <div className="px-10 pb-6">
           <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 opacity-70">Permanent Address</div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              <Row labelNp="प्रदेश" labelEn="State" name="fatherPermState" register={register} as="select" options={stateOptions} />
              <Row labelNp="जिल्ला" labelEn="District" name="fatherPermDistrict" register={register} as="select" options={fatherPermDistrictOptions} />
              <Row labelNp="गा.पा. / न.पा." labelEn="Local Level" name="fatherPermLocalLevel" register={register} as="select" options={fatherPermLocalLevelOptions} />
              <Row labelNp="वडा नं." labelEn="Ward" name="fatherPermWard" register={register} as="select" options={fatherPermWardOptions} />
           </div>

           <div 
             className="flex items-center gap-4 my-8 bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/20 cursor-pointer hover:bg-indigo-500/10 transition-all"
             onClick={() => setValue('fatherMirrorAddress', !fatherMirrorAddress)}
           >
             <div className={cn(
               "w-5 h-5 rounded border flex items-center justify-center transition-all",
               fatherMirrorAddress ? "bg-indigo-600 border-indigo-600" : "bg-white/5 border-white/10"
             )}>
               {fatherMirrorAddress && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
             </div>
             <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Mirror Permanent Address to Temporary</span>
             <input type="hidden" {...register('fatherMirrorAddress')} />
           </div>

           <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 opacity-70">Temporary Address</div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              <Row labelNp="प्रदेश" labelEn="State" name="fatherTempState" register={register} as="select" options={stateOptions} disabled={fatherMirrorAddress} />
              <Row labelNp="जिल्ला" labelEn="District" name="fatherTempDistrict" register={register} as="select" options={fatherTempDistrictOptions} disabled={fatherMirrorAddress} />
              <Row labelNp="गा.पा. / न.पा." labelEn="Local Level" name="fatherTempLocalLevel" register={register} as="select" options={fatherTempLocalLevelOptions} disabled={fatherMirrorAddress} />
              <Row labelNp="वडा नं." labelEn="Ward" name="fatherTempWard" register={register} as="select" options={fatherTempWardOptions} disabled={fatherMirrorAddress} />
           </div>
         </div>
      </SectionCard>

      <SectionCard title="Matrilineal Lineage">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-1 p-6">
            <Row labelNp="पहिलो नाम" labelEn="First Name" name="motherFirstNameNp" register={register} error={errors.motherFirstNameNp} />
            <Row labelNp="First Name" labelEn="पहिलो नाम" name="motherFirstNameEn" register={register} error={errors.motherFirstNameEn} />
            <Row labelNp="थर" labelEn="Last Name" name="motherLastNameNp" register={register} error={errors.motherLastNameNp} />
            <Row labelNp="Last Name" labelEn="थर" name="motherLastNameEn" register={register} error={errors.motherLastNameEn} />
         </div>
      </SectionCard>

       <SectionCard title="Ancestral Registry">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-1 p-6">
            <Row labelNp="पहिलो नाम" labelEn="First Name" name="grandFatherFirstNameNp" register={register} error={errors.grandFatherFirstNameNp} />
            <Row labelNp="First Name" labelEn="पहिलो नाम" name="grandFatherFirstNameEn" register={register} error={errors.grandFatherFirstNameEn} />
            <Row labelNp="थर" labelEn="Last Name" name="grandFatherLastNameNp" register={register} error={errors.grandFatherLastNameNp} />
            <Row labelNp="Last Name" labelEn="थर" name="grandFatherLastNameEn" register={register} error={errors.grandFatherLastNameEn} />
         </div>
      </SectionCard>

      <div className="flex justify-between items-center mt-16 pb-12">
        <button 
          type="button"
          onClick={() => setStep(1)}
          className="px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 border border-white/10 hover:text-white hover:bg-white/5 transition-all"
        >
          Return to Contact
        </button>
        <button 
          type="submit"
          className="px-16 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
        >
          Proceed to Preview
        </button>
      </div>
    </form>
  );
};

const SectionCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-10">
     <GroupHeader title={title} />
     <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
        {children}
     </div>
  </div>
);
