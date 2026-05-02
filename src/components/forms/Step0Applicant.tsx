import React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicantSchema, ApplicantData } from '../../lib/schema';
import { useFormContext } from '../../context/FormContext';
import { cn } from '../../lib/utils';

import locationsData from '../../lib/locations.json';

const districts = Object.values(locationsData).flatMap(province => Object.keys(province)).sort();

interface InputFieldProps {
  labelNp: string;
  labelEn: string;
  name: keyof ApplicantData;
  register: any;
  error?: any;
  required?: boolean;
  type?: string;
  as?: 'input' | 'select';
  children?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ 
  labelNp, 
  labelEn, 
  name, 
  register, 
  error, 
  required, 
  type = 'text',
  as = 'input',
  children
}) => (
  <div className="grid grid-cols-[1fr_2fr] items-center gap-4 py-3 border-b border-white/5 last:border-0 group">
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{labelNp}{required && <span className="text-red-400 ml-1">*</span>}</span>
      <span className="text-xs font-semibold text-white/60 group-hover:text-white transition-colors">{labelEn}{required && <span className="text-red-400 ml-1">*</span>}</span>
    </div>
    <div className="flex flex-col">
      {as === 'select' ? (
        <select 
          {...register(name)}
          className={cn(
            "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 outline-none uppercase transition-all [color-scheme:dark]",
            error && "border-red-500/50 bg-red-500/5"
          )}
        >
          {children}
        </select>
      ) : (
        <input 
          type={type}
          {...register(name)}
          className={cn(
            "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 outline-none transition-all placeholder:text-slate-600 uppercase [color-scheme:dark]",
            error && "border-red-500/50 bg-red-500/5"
          )}
        />
      )}
      {error && <span className="text-[10px] text-red-400 font-medium mt-1 ml-1">{error.message}</span>}
    </div>
  </div>
);

const GroupTitle: React.FC<{ title: string }> = ({ title }) => (
  <div className="relative flex items-center gap-4 my-10">
    <div className="flex-1 h-px bg-white/10" />
    <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] px-4">{title}</span>
    <div className="flex-1 h-px bg-white/10" />
  </div>
);

const Section: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 mb-8 shadow-2xl overflow-hidden">
    {children}
  </div>
);

export const Step0Applicant: React.FC = () => {
  const { formData, updateFormData, setStep } = useFormContext();
  const { register, handleSubmit, formState: { errors } } = useForm<ApplicantData>({
    resolver: zodResolver(applicantSchema),
    defaultValues: formData as ApplicantData
  });

  const onSubmit = (data: ApplicantData) => {
    updateFormData(data);
    setStep(1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 px-4">
      <div className="flex justify-between items-center mb-8 bg-white/5 p-4 rounded-2xl border border-white/10">
        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest pl-2">System Status: Basic Registry Parameters</span>
        <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Process ID</span>
            <span className="bg-white/10 text-white px-4 py-1.5 rounded-lg text-xs font-mono tracking-widest border border-white/5">9702686905585</span>
        </div>
      </div>

      <GroupTitle title="Application Identification" />
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-2">
          <InputField labelNp="पहिलो नाम" labelEn="First Name" name="firstNameNp" register={register} error={errors.firstNameNp} required />
          <InputField labelNp="First Name" labelEn="पहिलो नाम" name="firstNameEn" register={register} error={errors.firstNameEn} required />
          
          <InputField labelNp="बीचको नाम" labelEn="Middle Name" name="middleNameNp" register={register} error={errors.middleNameNp} />
          <InputField labelNp="Middle Name" labelEn="बीचको नाम" name="middleNameEn" register={register} error={errors.middleNameEn} />
          
          <InputField labelNp="थर" labelEn="Last Name" name="lastNameNp" register={register} error={errors.lastNameNp} required />
          <InputField labelNp="Last Name" labelEn="थर" name="lastNameEn" register={register} error={errors.lastNameEn} required />
          
          <InputField labelNp="जन्म मिति" labelEn="Date of Birth" name="dobNp" type="date" register={register} error={errors.dobNp} />
          <InputField labelNp="Date of Birth" labelEn="जन्म मिति" name="dobEn" type="date" register={register} error={errors.dobEn} />
          
          <InputField labelNp="जन्म स्थान" labelEn="Birth Place" name="birthPlace" register={register} error={errors.birthPlace} as="select">
            <option value="" className="bg-[#0f172a]">SELECT BIRTH DISTRICT</option>
            {districts.map(d => (
              <option key={`bp-${d}`} value={d} className="bg-[#0f172a]">{d}</option>
            ))}
          </InputField>
          
          <InputField labelNp="नागरिकताको किसिम" labelEn="CC Type" name="ccType" register={register} error={errors.ccType} as="select">
             <option value="" className="bg-[#0f172a]">SELECT CC TYPE</option>
             <option value="descent" className="bg-[#0f172a]">CITIZENSHIP BY DESCENT</option>
             <option value="naturalized" className="bg-[#0f172a]">NATURALIZED CITIZENSHIP</option>
          </InputField>
 
          <InputField labelNp="जारी जिल्ला" labelEn="Issued District" name="district" register={register} error={errors.district} as="select">
             <option value="" className="bg-[#0f172a]">SELECT ISSUED DISTRICT</option>
             {districts.map(d => (
              <option key={`id-${d}`} value={d} className="bg-[#0f172a]">{d}</option>
            ))}
          </InputField>
 
          <InputField labelNp="जारी मिति" labelEn="Issued Date" name="issuedDate" register={register} error={errors.issuedDate} type="date" />
          <InputField labelNp="राष्ट्रिय परिचय पत्र नं" labelEn="National ID Number" name="nidNo" register={register} error={errors.nidNo} placeholder="NID Number" />
        </div>
      </Section>
 
      <GroupTitle title="Registry Metadata" />
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-2">
          <InputField labelNp="लिंग" labelEn="Gender" name="gender" register={register} error={errors.gender} as="select">
            <option value="" className="bg-[#0f172a]">SELECT GENDER</option>
            <option value="male" className="bg-[#0f172a]">MALE</option>
            <option value="female" className="bg-[#0f172a]">FEMALE</option>
          </InputField>
 
          <InputField labelNp="वैवाहिक स्थिती" labelEn="Marital Status" name="maritalStatus" register={register} error={errors.maritalStatus} as="select">
            <option value="" className="bg-[#0f172a]">SELECT MARITAL STATUS</option>
            <option value="single" className="bg-[#0f172a]">SINGLE</option>
            <option value="married" className="bg-[#0f172a]">MARRIED</option>
          </InputField>

          <InputField labelNp="पितृत्वको स्थिती" labelEn="Father Status" name="fatherStatus" register={register} error={errors.fatherStatus} as="select">
            <option value="known" className="bg-[#0f172a]">KNOWN</option>
            <option value="unknown" className="bg-[#0f172a]">UNKNOWN</option>
          </InputField>

          <InputField labelNp="शैक्षिक योग्यता" labelEn="Education" name="education" register={register} error={errors.education} as="select">
            <option value="" className="bg-[#0f172a]">SELECT EDUCATION</option>
            <option value="literate" className="bg-[#0f172a]">LITERATE</option>
            <option value="undergrade" className="bg-[#0f172a]">UNDER GRADUATE</option>
          </InputField>

          <InputField labelNp="ब्यबसाय" labelEn="Business" name="business" register={register} error={errors.business} as="select">
            <option value="" className="bg-[#0f172a]">SELECT BUSINESS</option>
            <option value="business" className="bg-[#0f172a]">BUSINESS</option>
            <option value="service" className="bg-[#0f172a]">SERVICE</option>
            <option value="agriculture" className="bg-[#0f172a]">AGRICULTURE</option>
            <option value="student" className="bg-[#0f172a]">STUDENT</option>
            <option value="other" className="bg-[#0f172a]">OTHER</option>
          </InputField>

          <InputField labelNp="जाति" labelEn="Caste" name="caste" register={register} error={errors.caste} as="select">
            <option value="" className="bg-[#0f172a]">SELECT CASTE</option>
            <option value="brahmin" className="bg-[#0f172a]">BRAHMIN</option>
            <option value="chhetri" className="bg-[#0f172a]">CHHETRI</option>
            <option value="magar" className="bg-[#0f172a]">MAGAR</option>
            <option value="tharu" className="bg-[#0f172a]">THARU</option>
            <option value="tamang" className="bg-[#0f172a]">TAMANG</option>
            <option value="newar" className="bg-[#0f172a]">NEWAR</option>
            <option value="other" className="bg-[#0f172a]">OTHER</option>
          </InputField>

          <InputField labelNp="धर्म" labelEn="Religion" name="religion" register={register} error={errors.religion} as="select">
            <option value="" className="bg-[#0f172a]">SELECT RELIGION</option>
            <option value="hindu" className="bg-[#0f172a]">HINDU</option>
            <option value="buddhist" className="bg-[#0f172a]">BUDDHIST</option>
            <option value="muslim" className="bg-[#0f172a]">MUSLIM</option>
            <option value="christian" className="bg-[#0f172a]">CHRISTIAN</option>
            <option value="kirat" className="bg-[#0f172a]">KIRAT</option>
            <option value="other" className="bg-[#0f172a]">OTHER</option>
          </InputField>
        </div>
      </Section>

      <div className="flex justify-end mt-12 pb-12">
        <button 
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-16 py-4 rounded-2xl shadow-xl shadow-indigo-600/20 font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center gap-3"
        >
          Initialize Next Phase
        </button>
      </div>
    </form>
  );
};
