import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { cn } from '../../lib/utils';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { economicHealthSchema, EconomicHealthData } from '../../lib/schema';
import { Plus, Trash2 } from 'lucide-react';
import { demographicService } from '../../services/demographicService';
import { toast } from 'react-hot-toast';

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
          ) : as === 'radio' ? (
            <div className="flex flex-col gap-2 py-2">
              {options.map((opt: any) => (
                <label key={opt.val} className="flex items-center gap-3 cursor-pointer group/radio">
                  <input
                    type="radio"
                    value={opt.val}
                    {...registered}
                    className="w-4 h-4 text-[#1a4a8c] border-slate-300 focus:ring-[#1a4a8c]/20"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700 group-hover/radio:text-[#1a4a8c] transition-colors">{opt.labelNp}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{opt.labelEn}</span>
                  </div>
                </label>
              ))}
            </div>
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

const SectionCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-10">
     <GroupHeader title={title} />
     <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
        {children}
     </div>
  </div>
);

export const Step4EconomicHealth: React.FC = () => {
  const { formData, updateFormData, setStep, processId } = useFormContext();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<EconomicHealthData>({
    resolver: zodResolver(economicHealthSchema),
    defaultValues: {
      ...formData as EconomicHealthData,
      chronicIllnessDetails: formData.chronicIllnessDetails || [
        { who: '', disease: '', condition: '' },
        { who: '', disease: '', condition: '' }
      ]
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "chronicIllnessDetails"
  });

  const watchChronicIllness = watch('hasChronicIllness');
  const watchSavings = watch('hasSavings');

  const onSubmit = async (data: EconomicHealthData) => {
    setIsSubmitting(true);
    const updatedData = { ...formData, ...data };
    
    try {
      if (processId) {
        await demographicService.patchDemographic(processId, updatedData);
        toast.success('Economic profile synchronized');
      }
      updateFormData(data);
      setStep(5);
    } catch (error: any) {
      console.error('Demographic API Error:', error);
      toast.error(error.response?.data?.message || 'Failed to update economic profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-[1200px] mx-auto animate-in fade-in zoom-in-95 duration-700 px-4">
      <SectionCard title="Economic Status Details (आर्थिक अवस्था सम्बन्धी विवरण)">
        <div className="p-6 space-y-1">
          <Row 
            labelNp="३.१ परिवारको मुख्य आय स्रोत के हो?" 
            labelEn="3.1 What is the family's main source of income?" 
            name="mainIncomeSource" 
            register={register} 
            as="select"
            options={[
              { val: '', label: 'Select' },
              { val: 'wages', label: 'ज्याला मजदुरी (Wages)' },
              { val: 'agriculture', label: 'कृषि (Agriculture)' },
              { val: 'business', label: 'सानो व्यवसाय (Small Business)' },
              { val: 'service', label: 'जागिर/सेवा (Service)' },
              { val: 'other', label: 'अन्य (Other)' }
            ]}
          />

          <Row 
            labelNp="३.२ परिवारको मासिक कुल आम्दानी कति छ?" 
            labelEn="3.2 What is the family's total monthly income?" 
            name="monthlyIncome" 
            register={register} 
            as="select"
            options={[
              { val: '', label: 'Select Range' },
              { val: 'under_10k', label: 'रु १०,००० भन्दा कम (Below 10,000)' },
              { val: '10k_25k', label: 'रु १०,००० - २५,००० (10,000 - 25,000)' },
              { val: '25k_50k', label: 'रु २५,००० - ५०,००० (25,000 - 50,000)' },
              { val: 'above_50k', label: 'रु ५०,००० भन्दा माथि (Above 50,000)' }
            ]}
          />

          <Row 
            labelNp="३.३ के परिवारसँग बचत वा अन्य सम्पत्ति (जस्तै: बैंक बचत, गहना, पशु आदि) रहेको छ?" 
            labelEn="3.3 Does the family have savings or other assets (e.g., bank, jewelry, livestock)?" 
            name="hasSavings" 
            register={register} 
            as="select"
            options={[
              { val: '', label: 'Select' },
              { val: 'yes', label: 'छ (Yes)' },
              { val: 'no', label: 'छैन (No)' }
            ]}
          />

          {watchSavings === 'yes' && (
            <Row 
              labelNp="बचत वा सम्पत्तिको विवरण" 
              labelEn="Details of savings or assets" 
              name="savingsDetails" 
              register={register} 
              placeholder="e.g. बैंक मौज्दात, सुन, गाईवस्तु आदि (e.g. Bank balance, Gold, Livestock etc.)"
            />
          )}

          <Row 
            labelNp="३.४ आर्थिक सशक्तिकरण सम्बन्धी विकल्प" 
            labelEn="3.4 Economic Empowerment Option" 
            name="empowermentOption" 
            register={register} 
            as="radio"
            options={[
              { val: 'self_employed', labelNp: 'स्व-रोजगार (आफै व्यवसाय/उद्यम सञ्चालन गर्ने)', labelEn: 'Self-employment (Running own business)' },
              { val: 'cost_sharing', labelNp: 'लागत सह-भागिता (सरकारसँग मिलेर व्यवसायमा लगानी गर्ने)', labelEn: 'Cost sharing (Investing jointly with gov)' },
              { val: 'government_support', labelNp: 'सरकारी सहयोग (अनुदान, ऋण, सीप तालिम प्राप्त गर्ने)', labelEn: 'Gov support (Receive grants, loans, training)' },
              { val: 'employment', labelNp: 'रोजगारी अवसर (रोजगारीमा संलग्न हुने)', labelEn: 'Employment opportunity (Getting a job)' },
              { val: 'skill_development', labelNp: 'सीप विकास (प्राविधिक/व्यावसायिक तालिम लिने)', labelEn: 'Skill development (Technical/Vocational training)' }
            ]}
          />
        </div>
      </SectionCard>

      <SectionCard title="Family Health Details (पारिवारिक स्वास्थ्य अवस्था सम्बन्धी विवरण)">
        <div className="p-6 space-y-1">
          <Row 
            labelNp="दीर्घरोगी" 
            labelEn="Chronic Illness" 
            name="hasChronicIllness" 
            register={register} 
            as="select"
            options={[
              { val: '', label: 'Select' },
              { val: 'yes', label: 'छ (Yes)' },
              { val: 'no', label: 'छैन (No)' }
            ]}
          />

          {watchChronicIllness === 'yes' && fields.map((field, index) => (
            <div key={field.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 mt-4">
              <div className="text-[10px] font-black text-[#1a4a8c] uppercase mb-4">Patient {index + 1} ({index === 0 ? 'क' : 'ख'})</div>
              <Row labelNp="कसलाई" labelEn="Who (Name)" name={`chronicIllnessDetails.${index}.who`} register={register} />
              <Row labelNp="रोगको प्रकार" labelEn="Type of Disease" name={`chronicIllnessDetails.${index}.disease`} register={register} />
              <Row labelNp="बिरामी अवस्था" labelEn="Patient State" name={`chronicIllnessDetails.${index}.condition`} register={register} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Family Specific Details (पारिवारिक विवरण - संख्या)">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <Row labelNp="क. गर्भवती" labelEn="a. Pregnant" name="pregnantCount" register={register} />
          <Row labelNp="ख. सुत्केरी" labelEn="b. Nursing" name="nursingCount" register={register} />
          
          <div className="col-span-full h-px bg-slate-100 my-4" />
          
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 col-span-full">ग. ५ वर्ष भन्दा मुनिका बालबालिका (c. Children under 5)</div>
          <Row labelNp="केटा" labelEn="Boy" name="childrenUnder5Boy" register={register} />
          <Row labelNp="केटी" labelEn="Girl" name="childrenUnder5Girl" register={register} />

          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6 mb-2 col-span-full">घ. ५ देखि १६ सम्मका बालबालिका (d. Children 5 to 16)</div>
          <Row labelNp="पुरुष" labelEn="Male (Boy)" name="children5to16Boy" register={register} />
          <Row labelNp="महिला" labelEn="Female (Girl)" name="children5to16Girl" register={register} />

          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6 mb-2 col-span-full">ङ. ६५ देखि माथिको उमेर समूह (e. Senior Citizens 65+)</div>
          <Row labelNp="पुरुष" labelEn="Male" name="seniors65PlusMale" register={register} />
          <Row labelNp="महिला" labelEn="Female" name="seniors65PlusFemale" register={register} />

          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6 mb-2 col-span-full">च. अपाङ्गता विवरण (f. Disability Details)</div>
          <Row labelNp="पुरुष" labelEn="Male" name="disabilityMale" register={register} />
          <Row labelNp="महिला" labelEn="Female" name="disabilityFemale" register={register} />
        </div>
      </SectionCard>

      <div className="flex justify-between items-center mt-16 pb-12">
        <button 
          type="button"
          onClick={() => setStep(3)}
          className="px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 border border-slate-200 bg-white shadow-sm hover:text-slate-600 transition-all font-sans"
        >
          Return to Land & Housing
        </button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="px-16 py-5 bg-[#1a4a8c] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#1a4a8c]/90 shadow-xl shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? 'SYNCING...' : 'Proceed to Biometric Photo'}
        </button>
      </div>
    </form>
  );
};
