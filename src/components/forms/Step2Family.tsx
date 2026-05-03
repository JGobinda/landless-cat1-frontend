import React, { useMemo } from 'react';
import { useFormContext } from '../../context/FormContext';
import { cn } from '../../lib/utils';
import { useFieldArray, useForm } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { familySchema, FamilyData } from '../../lib/schema';
import locationsData from '../../lib/locations.json';
import Sanscript from 'sanscript';

type Locations = {
  [state: string]: {
    [district: string]: {
      [localLevel: string]: string[];
    };
  };
};

const locations = locationsData as Locations;

const Row = ({ labelNp, labelEn, name, register, error, required, as = 'input', options = [], disabled, onChange, placeholder }: any) => {
  const registered = register(name);
  return (
    <div className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr] sm:items-center gap-2 sm:gap-8 py-3 border-b border-slate-100 last:border-0 group transition-all px-4">
       <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-[#1a4a8c] transition-colors">{labelNp}{required && <span className="text-[#dc2626] ml-1">*</span>}</span>
          <span className="text-xs font-bold text-slate-600 group-hover:text-slate-800 transition-colors">{labelEn}</span>
       </div>
       <div className="flex flex-col">
          {as === 'select' ? (
            <select 
              {...registered} 
              disabled={disabled}
              onChange={(e) => {
                registered.onChange(e);
                onChange?.(e);
              }}
              className={cn(
                "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#1a4a8c]/50 focus:ring-2 focus:ring-[#1a4a8c]/20 transition-all uppercase disabled:opacity-30",
                error && "border-red-400/50 bg-red-400/5"
              )}
            >
              {options.map((opt: any) => <option key={opt.val} value={opt.val}>{opt.label}</option>)}
            </select>
          ) : (
            <input 
              {...registered} 
              disabled={disabled}
              placeholder={placeholder}
              onChange={(e) => {
                registered.onChange(e);
                onChange?.(e);
              }}
              className={cn(
                "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#1a4a8c]/50 focus:ring-2 focus:ring-[#1a4a8c]/20 transition-all uppercase placeholder:text-slate-400 disabled:opacity-30",
                error && "border-red-400/50 bg-red-400/5"
              )}
            />
          )}
          {error && <p className="text-[10px] text-[#dc2626] font-bold mt-1 ml-1">{error.message}</p>}
       </div>
    </div>
  );
};

const GroupHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-4 mb-6 mt-12 first:mt-0">
    <h3 className="text-xs font-black text-[#1a4a8c] uppercase tracking-[0.3em] whitespace-nowrap">{title}</h3>
    <div className="h-px flex-1 bg-slate-200" />
  </div>
);

export const Step2Family: React.FC = () => {
  const { formData, updateFormData, setStep } = useFormContext();
  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<FamilyData>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      ...formData as FamilyData,
      fatherMirrorAddress: formData.fatherMirrorAddress || false,
      motherMirrorAddress: formData.motherMirrorAddress || false,
      grandFatherMirrorAddress: formData.grandFatherMirrorAddress || false,
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "familyMembers"
  });

  const watchAll = watch();

  const handleTransliteration = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, name: keyof FamilyData, enNameField?: keyof FamilyData) => {
    const value = e.target.value;
    if (!value) return;
    
    // Round-Robin detection for phonetic typing
    const roman = Sanscript.t(value, 'devanagari', 'itrans');
    const transliterated = Sanscript.t(roman, 'itrans', 'devanagari');
    
    setValue(name, transliterated as any);
    
    // Auto-fill english field
    if (enNameField) {
      setValue(enNameField, roman.toUpperCase() as any);
    }
  };

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

  const RelativeAddressGroup = ({ prefix, label }: { prefix: 'father' | 'mother' | 'grandFather' | 'grandMother' | 'spouse', label: string }) => {
    const permState = watchAll[`${prefix}PermState` as keyof FamilyData] as string;
    const permDistrict = watchAll[`${prefix}PermDistrict` as keyof FamilyData] as string;
    const permLocalLevel = watchAll[`${prefix}PermLocalLevel` as keyof FamilyData] as string;
    const permWard = watchAll[`${prefix}PermWard` as keyof FamilyData] as string;
    const mirrorAddress = watchAll[`${prefix}MirrorAddress` as keyof FamilyData] as boolean;

    const tempState = watchAll[`${prefix}TempState` as keyof FamilyData] as string;
    const tempDistrict = watchAll[`${prefix}TempDistrict` as keyof FamilyData] as string;
    const tempLocalLevel = watchAll[`${prefix}TempLocalLevel` as keyof FamilyData] as string;

    const permDistrictOptions = useMemo(() => getDistrictOptions(permState), [permState]);
    const permLocalLevelOptions = useMemo(() => getLocalLevelOptions(permState, permDistrict), [permState, permDistrict]);
    const permWardOptions = useMemo(() => getWardOptions(permState, permDistrict, permLocalLevel), [permState, permDistrict, permLocalLevel]);

    const tempDistrictOptions = useMemo(() => getDistrictOptions(mirrorAddress ? permState : tempState), [tempState, permState, mirrorAddress]);
    const tempLocalLevelOptions = useMemo(() => getLocalLevelOptions(mirrorAddress ? permState : tempState, mirrorAddress ? permDistrict : tempDistrict), [tempState, tempDistrict, permState, permDistrict, mirrorAddress]);
    const tempWardOptions = useMemo(() => getWardOptions(mirrorAddress ? permState : tempState, mirrorAddress ? permDistrict : tempDistrict, mirrorAddress ? permLocalLevel : tempLocalLevel), [tempState, tempDistrict, tempLocalLevel, permState, permDistrict, permLocalLevel, mirrorAddress]);

    React.useEffect(() => {
      if (mirrorAddress) {
        setValue(`${prefix}TempState` as any, permState);
        setValue(`${prefix}TempDistrict` as any, permDistrict);
        setValue(`${prefix}TempLocalLevel` as any, permLocalLevel);
        setValue(`${prefix}TempWard` as any, permWard);
      }
    }, [mirrorAddress, permState, permDistrict, permLocalLevel, permWard, prefix]);

    return (
      <div className="px-10 pb-6">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{label}'s Permanent Address</div>
        <div 
          className="flex items-center gap-4 my-8 bg-[#1a4a8c]/5 p-4 rounded-xl border border-[#1a4a8c]/10 cursor-pointer hover:bg-[#1a4a8c]/10 transition-all font-sans"
          onClick={() => setValue(`${prefix}MirrorAddress` as any, !mirrorAddress)}
        >
          <div className={cn(
            "w-5 h-5 rounded border flex items-center justify-center transition-all",
            mirrorAddress ? "bg-[#1a4a8c] border-[#1a4a8c]" : "bg-white border-slate-300"
          )}>
            {mirrorAddress && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
          </div>
          <span className="text-[10px] font-black text-[#1a4a8c] uppercase tracking-widest">Copy Applicant's Permanent Address to {label}'s Permanent Address</span>
          <input type="hidden" {...register(`${prefix}MirrorAddress` as any)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <Row 
            labelNp="प्रदेश" labelEn="State" 
            name={`${prefix}PermState`} register={register} as="select" options={stateOptions} 
            onChange={(e: any) => { register(`${prefix}PermState` as any).onChange(e); setValue(`${prefix}PermDistrict` as any, ''); setValue(`${prefix}PermLocalLevel` as any, ''); setValue(`${prefix}PermWard` as any, ''); }}
          />
          <Row 
            labelNp="जिल्ला" labelEn="District" 
            name={`${prefix}PermDistrict`} register={register} as="select" options={permDistrictOptions} 
            onChange={(e: any) => { register(`${prefix}PermDistrict` as any).onChange(e); setValue(`${prefix}PermLocalLevel` as any, ''); setValue(`${prefix}PermWard` as any, ''); }}
          />
          <Row 
            labelNp="गा.पा. / न.पा." labelEn="Local Level" 
            name={`${prefix}PermLocalLevel`} register={register} as="select" options={permLocalLevelOptions} 
            onChange={(e: any) => { register(`${prefix}PermLocalLevel` as any).onChange(e); setValue(`${prefix}PermWard` as any, ''); }}
          />
          <Row labelNp="वडा नं." labelEn="Ward" name={`${prefix}PermWard`} register={register} as="select" options={permWardOptions} />
          <Row labelNp="गाउँ / टोल" name={`${prefix}PermVillage`} register={register} error={(errors as any)[`${prefix}PermVillage`]} />
          <Row labelEn="Foreign Address" name={`${prefix}ForeignAddress`} register={register} error={(errors as any)[`${prefix}ForeignAddress`]} />

        </div>
      </div>
    );
  };

  const onSubmit = (data: FamilyData) => {
    updateFormData(data);
    setStep(3);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-[1200px] mx-auto animate-in fade-in zoom-in-95 duration-700 px-4">
      <SectionCard title="Father's Details">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-1 p-6">
            <Row 
              labelNp="पहिलो नाम" 
              // labelEn="First Name" 
              name="fatherFirstNameNp" 
              register={register} 
              error={errors.fatherFirstNameNp} 
              placeholder="e.g. 'nepAl' for 'नेपाल'"
              onChange={(e: any) => handleTransliteration(e, 'fatherFirstNameNp', 'fatherFirstNameEn')}
            />
            <Row labelNp="First Name" name="fatherFirstNameEn" register={register} error={errors.fatherFirstNameEn} />
            <Row 
              labelNp="बीचको नाम" 
              // labelEn="First Name" 
              name="fatherMiddleNameNp" 
              register={register} 
              error={errors.fatherMiddleNameNp} 
              placeholder="e.g. 'nepAl' for 'नेपाल'"
              onChange={(e: any) => handleTransliteration(e, 'fatherMiddleNameNp', 'fatherMiddleNameEn')}
            />
            <Row labelNp="Middle Name" name="fatherMiddleNameEn" register={register} error={errors.fatherMiddleNameEn} />
            <Row 
              labelNp="थर" 
              // labelEn="Last Name" 
              name="fatherLastNameNp" 
              register={register} 
              error={errors.fatherLastNameNp} 
              placeholder="e.g. 'sharma' for 'शर्मा'"
              onChange={(e: any) => handleTransliteration(e, 'fatherLastNameNp', 'fatherLastNameEn')}
            />
            
            <Row labelNp="Last Name" name="fatherLastNameEn" register={register} error={errors.fatherLastNameEn} />
            <Row labelNp="नागरिकता प्रमाण पत्र नं." labelEn="Citizenship No" name="fatherCitizenshipNo" register={register} />
            <Row labelNp="राष्ट्रिय परिचय पत्र नं" labelEn="NIN" name="fatherNidNo" register={register} />
            <Row labelEn="राष्ट्रियता" name="fatherNationality" register={register} as="select" options={[{val: '', label: 'SELECT NATIONALITY'}, {val: 'NEPALI', label: 'NEPALI'}, {val: 'FOREIGN', label: 'FOREIGN'}]} />
            <Row labelNp="Nationality" name="fatherNationality" register={register} />

         </div>
         <RelativeAddressGroup prefix="father" label="Father" />
      </SectionCard>

      <SectionCard title="Mother's Details">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-1 p-6">
            <Row 
              labelNp="पहिलो नाम" 
              // labelEn="First Name" 
              name="motherFirstNameNp" 
              register={register} 
              error={errors.motherFirstNameNp} 
              placeholder="e.g. 'nepAl' for 'नेपाल'"
              onChange={(e: any) => handleTransliteration(e, 'motherFirstNameNp', 'motherFirstNameEn')}
            />
            <Row labelNp="First Name" name="motherFirstNameEn" register={register} error={errors.motherFirstNameEn} />
            <Row 
              labelNp="बीचको नाम" 
              // labelEn="First Name" 
              name="motherMiddleNameNp" 
              register={register} 
              error={errors.motherMiddleNameNp} 
              placeholder="e.g. 'nepAl' for 'नेपाल'"
              onChange={(e: any) => handleTransliteration(e, 'motherMiddleNameNp', 'motherMiddleNameEn')}
            />
            <Row labelNp="Middle Name" name="motherMiddleNameEn" register={register} error={errors.motherMiddleNameEn} />
            <Row 
              labelNp="थर" 
              // labelEn="Last Name" 
              name="motherLastNameNp" 
              register={register} 
              error={errors.motherLastNameNp} 
              placeholder="e.g. 'sharma' for 'शर्मा'"
              onChange={(e: any) => handleTransliteration(e, 'motherLastNameNp', 'motherLastNameEn')}
            />
            <Row labelNp="Last Name" name="motherLastNameEn" register={register} error={errors.motherLastNameEn} />
            <Row labelNp="नागरिकता प्रमाण पत्र नं." labelEn="Citizenship No" name="motherCitizenshipNo" register={register} />
            <Row labelNp="राष्ट्रिय परिचय पत्र नं" labelEn="NIN" name="motherNidNo" register={register} />
            <Row labelEn="राष्ट्रियता" name="motherNationality" register={register} as="select" options={[{val: '', label: 'SELECT NATIONALITY'}, {val: 'NEPALI', label: 'NEPALI'}, {val: 'FOREIGN', label: 'FOREIGN'}]} />
            <Row labelNp="Nationality" name="motherNationality" register={register} />
         </div>
         <RelativeAddressGroup prefix="mother" label="Mother" />
      </SectionCard>

       <SectionCard title="Grandfather's Details">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-1 p-6">
            <Row 
              labelNp="पहिलो नाम" 
              name="grandFatherFirstNameNp" 
              register={register} 
              error={errors.grandFatherFirstNameNp} 
              placeholder="e.g. 'nepAl' for 'नेपाल'"
              onChange={(e: any) => handleTransliteration(e, 'grandFatherFirstNameNp', 'grandFatherFirstNameEn')}
            />
            <Row labelNp="First Name" name="grandFatherFirstNameEn" register={register} error={errors.grandFatherFirstNameEn} />
            <Row 
              labelNp="बीचको नाम" 
              name="grandFatherMiddleNameNp" 
              register={register} 
              error={errors.grandFatherMiddleNameNp} 
              placeholder="e.g. 'nepAl' for 'नेपाल'"
              onChange={(e: any) => handleTransliteration(e, 'grandFatherMiddleNameNp', 'grandFatherMiddleNameEn')}
            />
            <Row labelNp="Middle Name" name="grandFatherMiddleNameEn" register={register} error={errors.grandFatherMiddleNameEn} />

            <Row 
              labelNp="थर" 
              name="grandFatherLastNameNp" 
              register={register} 
              error={errors.grandFatherLastNameNp} 
              placeholder="e.g. 'sharma' for 'शर्मा'"
              onChange={(e: any) => handleTransliteration(e, 'grandFatherLastNameNp', 'grandFatherLastNameEn')}
            />
            <Row labelNp="Last Name" name="grandFatherLastNameEn" register={register} error={errors.grandFatherLastNameEn} />
            <Row labelNp="नागरिकता प्रमाण पत्र नं." labelEn="Citizenship No" name="grandFatherCitizenshipNo" register={register} />
            <Row labelNp="राष्ट्रिय परिचय पत्र नं" labelEn="NIN" name="grandFatherNidNo" register={register} />
            <Row labelEn="राष्ट्रियता" name="grandFatherNationality" register={register} as="select" options={[{val: '', label: 'SELECT NATIONALITY'}, {val: 'NEPALI', label: 'NEPALI'}, {val: 'FOREIGN', label: 'FOREIGN'}]} />
            <Row labelNp="Nationality" name="grandFatherNationality" register={register} />

         </div>
         <RelativeAddressGroup prefix="grandFather" label="Grandfather" />
      </SectionCard>

      <SectionCard title="Grandmother's Details">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-1 p-6">
            <Row 
              labelNp="पहिलो नाम" 
              name="grandMotherFirstNameNp" 
              register={register} 
              error={errors.grandMotherFirstNameNp} 
              placeholder="e.g. 'nepAl' for 'नेपाल'"
              onChange={(e: any) => handleTransliteration(e, 'grandMotherFirstNameNp', 'grandMotherFirstNameEn')}
            />
            <Row labelNp="First Name" name="grandMotherFirstNameEn" register={register} error={errors.grandMotherFirstNameEn} />
            <Row 
              labelNp="बीचको नाम" 
              name="grandMotherMiddleNameNp" 
              register={register} 
              error={errors.grandMotherMiddleNameNp} 
              placeholder="e.g. 'nepAl' for 'नेपाल'"
              onChange={(e: any) => handleTransliteration(e, 'grandMotherMiddleNameNp', 'grandMotherMiddleNameEn')}
            />
            <Row labelNp="Middle Name" name="grandMotherMiddleNameEn" register={register} error={errors.grandMotherMiddleNameEn} />

            <Row 
              labelNp="थर" 
              name="grandMotherLastNameNp" 
              register={register} 
              error={errors.grandMotherLastNameNp} 
              placeholder="e.g. 'sharma' for 'शर्मा'"
              onChange={(e: any) => handleTransliteration(e, 'grandMotherLastNameNp', 'grandMotherLastNameEn')}
            />
            <Row labelNp="Last Name" name="grandMotherLastNameEn" register={register} error={errors.grandMotherLastNameEn} />
            <Row labelNp="नागरिकता प्रमाण पत्र नं." labelEn="Citizenship No" name="grandMotherCitizenshipNo" register={register} />
            <Row labelNp="राष्ट्रिय परिचय पत्र नं" labelEn="NIN" name="grandMotherNidNo" register={register} />
            <Row labelEn="राष्ट्रियता" name="grandMotherNationality" register={register} as="select" options={[{val: '', label: 'SELECT NATIONALITY'}, {val: 'NEPALI', label: 'NEPALI'}, {val: 'FOREIGN', label: 'FOREIGN'}]} />
            <Row labelNp="Nationality" name="grandMotherNationality" register={register} />

         </div>
         <RelativeAddressGroup prefix="grandMother" label="Grandmother" />
      </SectionCard>
      <SectionCard title="Spouse's Details">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-1 p-6">
            <Row 
              labelNp="पहिलो नाम" 
              name="spouseFirstNameNp" 
              register={register} 
              error={errors.spouseFirstNameNp} 
              placeholder="e.g. 'nepAl' for 'नेपाल'"
              onChange={(e: any) => handleTransliteration(e, 'spouseFirstNameNp', 'spouseFirstNameEn')}
            />
            <Row labelNp="First Name" name="spouseFirstNameEn" register={register} error={errors.spouseFirstNameEn} />
            <Row 
              labelNp="बीचको नाम" 
              name="spouseMiddleNameNp" 
              register={register} 
              error={errors.spouseMiddleNameNp} 
              placeholder="e.g. 'nepAl' for 'नेपाल'"
              onChange={(e: any) => handleTransliteration(e, 'spouseMiddleNameNp', 'spouseMiddleNameEn')}
            />
            <Row labelNp="Middle Name" name="spouseMiddleNameEn" register={register} error={errors.spouseMiddleNameEn} />

            <Row 
              labelNp="थर" 
              name="spouseLastNameNp" 
              register={register} 
              error={errors.spouseLastNameNp} 
              placeholder="e.g. 'sharma' for 'शर्मा'"
              onChange={(e: any) => handleTransliteration(e, 'spouseLastNameNp', 'spouseLastNameEn')}
            />
            <Row labelNp="Last Name" name="spouseLastNameEn" register={register} error={errors.spouseLastNameEn} />
            <Row labelNp="नागरिकता प्रमाण पत्र नं." labelEn="Citizenship No" name="spouseCitizenshipNo" register={register} />
            <Row labelNp="राष्ट्रिय परिचय पत्र नं" labelEn="NIN" name="spouseNidNo" register={register} />
            <Row labelEn="राष्ट्रियता" name="spouseNationality" register={register} as="select" options={[{val: '', label: 'SELECT NATIONALITY'}, {val: 'NEPALI', label: 'NEPALI'}, {val: 'FOREIGN', label: 'FOREIGN'}]} />
            <Row labelNp="Nationality" name="spouseNationality" register={register} />
         </div>
         <RelativeAddressGroup prefix="spouse" label="Spouse" />
      </SectionCard>
      
      <div className="mb-10 mt-12 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Family Information</h3>
          <button
            type="button"
            onClick={() => append({ name: '', relation: '', age: '', nin: '', generation: '', landElsewhere: '' })}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-[#1a4a8c] rounded-xl font-bold text-xs hover:bg-[#1a4a8c] hover:text-white hover:border-[#1a4a8c] transition-all shadow-sm group"
          >
            <Plus size={16} className="text-[#1a4a8c] group-hover:text-white transition-colors" />
            Add
          </button>
        </div>
        
        <div className="p-6 md:p-8 space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="p-6 border border-slate-200 rounded-2xl bg-white relative group">
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-slate-800 text-sm">Member {index + 1}</span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                  title="Remove Member"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600">Name</label>
                  <input 
                    {...register(`familyMembers.${index}.name` as const)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a4a8c]/20 placeholder:text-transparent"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600">Relation</label>
                  <select
                    {...register(`familyMembers.${index}.relation` as const)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a4a8c]/20"
                  >
                    <option value="">SELECT</option>
                    <option value="son">Son</option>
                    <option value="daughter">Daughter</option>
                    <option value="father">Father In Law</option>
                    <option value="mother">Mother In Law</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600">Age</label>
                  <input 
                    type="text"
                    {...register(`familyMembers.${index}.age` as const)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a4a8c]/20 placeholder:text-transparent"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600">NIN/ Citizen/ Birth Certificate</label>
                  <input 
                    type="text"
                    {...register(`familyMembers.${index}.nin` as const)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a4a8c]/20 placeholder:text-transparent"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600">Occupation</label>
                  <select
                    {...register(`familyMembers.${index}.generation` as const)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a4a8c]/20"
                  >
                    <option value="">SELECT</option>
                    <option value="1">Agriculture Work</option>
                    <option value="2">Self Employment</option>
                    <option value="3">Daily Wages Labour</option>
                    <option value="4">Foreign Employment</option>
                    <option value="5">Business</option>
                    <option value="6">Student</option>
                    <option value="7">Job/Service</option>
                    <option value="8">Minor (Child)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600">Gender</label>
                  <select
                    {...register(`familyMembers.${index}.landElsewhere` as const)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a4a8c]/20"
                  >
                    <option value="">SELECT</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          {fields.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm font-medium border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
              कुनै परिवारको सदस्य थपिएको छैन। (No family members added yet.)
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-16 pb-12">
        <button 
          type="button"
          onClick={() => setStep(1)}
          className="px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 border border-slate-200 bg-white shadow-sm hover:text-slate-600 transition-all font-sans"
        >
          Return to Contact
        </button>
        <button 
          type="submit"
          className="px-16 py-5 bg-[#1a4a8c] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#1a4a8c]/90 shadow-xl shadow-blue-900/20 transition-all active:scale-95"
        >
          Proceed to Land & Housing
        </button>
      </div>
    </form>
  );
};

const SectionCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-10">
     <GroupHeader title={title} />
     <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
        {children}
     </div>
  </div>
);
