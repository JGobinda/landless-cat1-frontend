import React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicantSchema, ApplicantData } from '../../lib/schema';
import { useFormContext } from '../../context/FormContext';
import { cn } from '../../lib/utils';
import Sanscript from 'sanscript';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

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
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
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
  children,
  placeholder,
  onChange
}) => {
  const registered = register(name);
  
  return (
    <div className="flex flex-col sm:grid sm:grid-cols-[1fr_2fr] sm:items-center gap-2 sm:gap-4 py-4 border-b border-slate-100 last:border-0 group">
      <div className="flex flex-col gap-0.5 sm:mb-0 mb-1">
        <span className="text-[10px] font-black text-slate-400 group-hover:text-[#1a4a8c] transition-colors uppercase tracking-tight">{labelNp}{required && <span className="text-[#dc2626] ml-1">*</span>}</span>
        <span className="text-xs font-bold text-slate-600 group-hover:text-slate-800 transition-colors">{labelEn}{required && <span className="text-[#dc2626] ml-1">*</span>}</span>
      </div>
      <div className="flex flex-col">
        {as === 'select' ? (
          <select 
            {...registered}
            onChange={(e) => {
              registered.onChange(e);
              onChange?.(e);
            }}
            className={cn(
              "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a4a8c]/20 focus:bg-white outline-none uppercase transition-all",
              error && "border-red-500/50 bg-red-50"
            )}
          >
            {children}
          </select>
        ) : (
          <input 
            type={type}
            placeholder={placeholder}
            {...registered}
            onChange={(e) => {
              registered.onChange(e);
              onChange?.(e);
            }}
            className={cn(
              "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a4a8c]/20 focus:bg-white outline-none transition-all placeholder:text-slate-400 uppercase",
              error && "border-red-500/50 bg-red-50"
            )}
          />
        )}
        {error && <span className="text-[10px] text-[#dc2626] font-bold mt-1 ml-1">{error.message}</span>}
      </div>
    </div>
  );
};

const GroupTitle: React.FC<{ title: string }> = ({ title }) => (
  <div className="relative flex items-center gap-4 my-12">
    <div className="flex-1 h-px bg-slate-200" />
    <span className="text-xs font-black text-[#1a4a8c] uppercase tracking-[0.2em] px-6 bg-slate-100 py-2 rounded-full border border-slate-200">{title}</span>
    <div className="flex-1 h-px bg-slate-200" />
  </div>
);

const Section: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white border border-slate-200 rounded-[2rem] p-8 mb-8 shadow-sm overflow-hidden">
    {children}
  </div>
);

export const Step0Applicant: React.FC = () => {
  const { formData, updateFormData, setStep, editingUid } = useFormContext();
  const [isChecking, setIsChecking] = React.useState(false);
  const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm<ApplicantData>({
    resolver: zodResolver(applicantSchema),
    defaultValues: formData as ApplicantData
  });

  const onSubmit = async (data: ApplicantData) => {
    setIsChecking(true);
    try {
      const q = query(
        collection(db, 'applications'),
        where('citizenshipNo', '==', data.citizenshipNo)
      );
      
      const querySnapshot = await getDocs(q);
      const exists = querySnapshot.docs.some(doc => doc.id !== editingUid);
      
      if (exists) {
        setError('citizenshipNo', {
          type: 'manual',
          message: 'Citizenship Number already registered / यो नागरिकता नं पहिले नै दर्ता भइसकेको छ'
        });
        setIsChecking(false);
        return;
      }

      updateFormData(data);
      setStep(1);
    } catch (error) {
      console.error("Uniqueness check error:", error);
      setError('citizenshipNo', {
        type: 'manual',
        message: 'Error verifying uniqueness. Please try again.'
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleTransliteration = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, name: keyof ApplicantData, enNameField?: keyof ApplicantData) => {
    const value = e.target.value;
    if (!value) return;
    
    // Use Round-Robin to detect the intended Roman string from mixed/Devanagari input
    const roman = Sanscript.t(value, 'devanagari', 'itrans');
    const transliterated = Sanscript.t(roman, 'itrans', 'devanagari');
    
    setValue(name, transliterated);
    
    // Auto-fill English name field if it's provided and we have a valid roman string
    if (enNameField) {
      setValue(enNameField, roman.toUpperCase() as any);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest sm:pl-2">System Status: Basic Registry Parameters</span>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Process ID</span>
            <span className="bg-slate-50 text-slate-600 px-4 py-1.5 rounded-lg text-xs font-mono tracking-widest border border-slate-200">9702686905585</span>
        </div>
      </div>

      <GroupTitle title="Application Identification" />
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-2">
          <InputField 
            labelNp="पहिलो नाम" 
            labelEn="First Name" 
            name="firstNameNp" 
            register={register} 
            error={errors.firstNameNp} 
            required 
            placeholder="e.g. 'nepAl' for 'नेपाल'"
            onChange={(e) => handleTransliteration(e, 'firstNameNp', 'firstNameEn')}
          />
          <InputField labelNp="First Name" labelEn="पहिलो नाम" name="firstNameEn" register={register} error={errors.firstNameEn} required />
          
          <InputField 
            labelNp="बीचको नाम" 
            labelEn="Middle Name" 
            name="middleNameNp" 
            register={register} 
            error={errors.middleNameNp} 
            placeholder="e.g. 'prasAda' for 'प्रसाद'"
            onChange={(e) => handleTransliteration(e, 'middleNameNp', 'middleNameEn')}
          />
          <InputField labelNp="Middle Name" labelEn="बीचको नाम" name="middleNameEn" register={register} error={errors.middleNameEn} />
          
          <InputField 
            labelNp="थर" 
            labelEn="Last Name" 
            name="lastNameNp" 
            register={register} 
            error={errors.lastNameNp} 
            required 
            placeholder="e.g. 'sharma' for 'शर्मा''"
            onChange={(e) => handleTransliteration(e, 'lastNameNp', 'lastNameEn')}
          />
          <InputField labelNp="Last Name" labelEn="थर" name="lastNameEn" register={register} error={errors.lastNameEn} required />
          
          <InputField labelNp="जन्म मिति" labelEn="Date of Birth" name="dobNp" type="date" register={register} error={errors.dobNp} />
          <InputField labelNp="Date of Birth" labelEn="जन्म मिति" name="dobEn" type="date" register={register} error={errors.dobEn} />
          
          <InputField 
            labelNp="नागरिकता नं" 
            labelEn="Citizenship No" 
            name="citizenshipNo" 
            register={register} 
            error={errors.citizenshipNo} 
            required
            placeholder="e.g. 12-34-56-789" 
          />
          
          <InputField labelNp="जन्म स्थान" labelEn="Birth Place" name="birthPlace" register={register} error={errors.birthPlace} as="select">
            <option value="">SELECT BIRTH DISTRICT</option>
            {districts.map(d => (
              <option key={`bp-${d}`} value={d}>{d}</option>
            ))}
          </InputField>
          
          <InputField labelNp="नागरिकताको किसिम" labelEn="CC Type" name="ccType" register={register} error={errors.ccType} as="select">
             <option value="">SELECT CC TYPE</option>
             <option value="descent">Citizenship by Descent/वंशज</option>
             <option value="naturalized">Naturalized Citizenship/अङ्गीकृत</option>
             <option value="marriage">Naturalized Citizenship by Marriage/वैवाहिक अङ्गीकृत</option>
             <option value="birth">Citizenship by Birth/जन्मको आधारमा</option>
             <option value="birth_at">Citizenship at Birth/जन्मसिद्ध</option>
             <option value="honorary">Honorary Citizenship/सम्मानार्थ</option>
          </InputField>
 
          <InputField labelNp="जारी जिल्ला" labelEn="Issued District" name="district" register={register} error={errors.district} as="select">
             <option value="">SELECT ISSUED DISTRICT</option>
             {districts.map(d => (
              <option key={`id-${d}`} value={d}>{d}</option>
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
            <option value="">SELECT GENDER</option>
            <option value="male">MALE</option>
            <option value="female">FEMALE</option>
          </InputField>
 
          <InputField labelNp="वैवाहिक स्थिती" labelEn="Marital Status" name="maritalStatus" register={register} error={errors.maritalStatus} as="select">
            <option value="">SELECT MARITAL STATUS</option>
            <option value="single">SINGLE</option>
            <option value="married">MARRIED</option>
          </InputField>
 
          <InputField labelNp="पितृत्वको स्थिती" labelEn="Father Status" name="fatherStatus" register={register} error={errors.fatherStatus} as="select">
            <option value="known">KNOWN</option>
            <option value="unknown">UNKNOWN</option>
          </InputField>
 
          <InputField labelNp="शैक्षिक योग्यता" labelEn="Education" name="education" register={register} error={errors.education} as="select">
            <option value="">SELECT EDUCATION</option>
            <option value="literate">LITERATE</option>
            <option value="undergrade">UNDER GRADUATE</option>
          </InputField>
 
          <InputField labelNp="ब्यबसाय" labelEn="Business" name="business" register={register} error={errors.business} as="select">
            <option value="">SELECT BUSINESS</option>
            <option value="business">BUSINESS</option>
            <option value="service">SERVICE</option>
            <option value="agriculture">AGRICULTURE</option>
            <option value="student">STUDENT</option>
            <option value="other">OTHER</option>
          </InputField>
 
          <InputField labelNp="जाति" labelEn="Caste" name="caste" register={register} error={errors.caste} as="select">
            <option value="">SELECT CASTE</option>
            <option value="brahmin">BRAHMIN</option>
            <option value="chhetri">CHHETRI</option>
            <option value="magar">MAGAR</option>
            <option value="tharu">THARU</option>
            <option value="tamang">TAMANG</option>
            <option value="newar">NEWAR</option>
            <option value="other">OTHER</option>
          </InputField>
 
          <InputField labelNp="धर्म" labelEn="Religion" name="religion" register={register} error={errors.religion} as="select">
            <option value="">SELECT RELIGION</option>
            <option value="hindu">HINDU</option>
            <option value="buddhist">BUDDHIST</option>
            <option value="muslim">MUSLIM</option>
            <option value="christian">CHRISTIAN</option>
            <option value="kirat">KIRAT</option>
            <option value="other">OTHER</option>
          </InputField>

          <InputField labelNp="हालको होल्डिङ सेन्टर" labelEn="Current Holding Center" name="currentHoldingCenter" register={register} error={errors.currentHoldingCenter} placeholder="Enter Current Holding Center" />
        </div>
      </Section>
 
      <div className="flex justify-end mt-12 pb-12">
        <button 
          type="submit"
          disabled={isChecking}
          className="bg-[#1a4a8c] hover:bg-[#1a4a8c]/90 text-white px-16 py-5 rounded-2xl shadow-xl shadow-[#1a4a8c]/20 font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isChecking ? 'Verifying Registry...' : 'Initialize Next Phase'}
        </button>
      </div>
    </form>
  );
};
