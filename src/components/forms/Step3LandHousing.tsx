import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { cn } from '../../lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { landHousingSchema, LandHousingData } from '../../lib/schema';

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

export const Step3LandHousing: React.FC = () => {
  const { formData, updateFormData, setStep } = useFormContext();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<LandHousingData>({
    resolver: zodResolver(landHousingSchema),
    defaultValues: formData as LandHousingData
  });

  const watchHasLand = watch('hasLandNepal');
  const watchHasHouse = watch('hasHouse');

  const onSubmit = (data: LandHousingData) => {
    updateFormData(data);
    setStep(4);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-[1200px] mx-auto animate-in fade-in zoom-in-95 duration-700 px-4">
      <SectionCard title="Land Ownership Details (जगगा स्वामित्व सम्बन्धी विवरण)">
        <div className="p-6 space-y-1">
          <Row 
            labelNp="नेपालमा कतै जग्गा स्वामित्व छ?" 
            labelEn="Do you or your family own land in Nepal?" 
            name="hasLandNepal" 
            register={register} 
            as="select"
            options={[
              { val: '', label: 'Select' },
              { val: 'yes', label: 'छ (Yes)' },
              { val: 'no', label: 'छैन (No)' }
            ]}
          />

          {watchHasLand === 'yes' && (
            <div className="animate-in slide-in-from-top duration-300">
              <Row labelNp="जग्गाधनीको नाम" labelEn="Landowner's Name" name="landOwnerName" register={register} />
              <Row labelNp="प्रमुखसँग सम्बन्ध" labelEn="Relation with Head" name="landRelationToHead" register={register} />
              <Row labelNp="स्थान (जिल्ला/स्थानीय तह)" labelEn="Location (District/Local Level)" name="landLocation" register={register} />
              <Row labelNp="क्षेत्रफल" labelEn="Area" name="landArea" register={register} />
              <Row 
                labelNp="जग्गा प्रयोगयोग्य अवस्थामा छ?" 
                labelEn="Is the land in usable condition?" 
                name="isLandUsable" 
                register={register} 
                as="select"
                options={[
                  { val: '', label: 'Select' },
                  { val: 'usable', label: 'छ (बसोबास/खेती गर्न मिल्ने) - Yes (Suitable)' },
                  { val: 'not_usable', label: 'छैन (अनुत्पादक/दूर/उपयोग गर्न नसकिने) - No (Unusable)' }
                ]}
              />
            </div>
          )}

          {watchHasLand === 'no' && (
            <Row 
              labelNp="जग्गा नहुनुको कारण" 
              labelEn="Reason for not owning land" 
              name="landNoOwnershipReason" 
              register={register} 
              placeholder="e.g. भूमिहीन, सुकुम्बासी आदि (e.g. Landless, Squatter etc.)"
            />
          )}

          {(watchHasLand === 'no' || watch('isLandUsable') === 'not_usable') && (
            <Row 
              labelNp="जग्गा सम्बन्धी समाधान विकल्प" 
              labelEn="Land Solution Option" 
              name="landSolutionOption" 
              register={register} 
              as="radio"
              options={[
                { val: 'self_arrangement', labelNp: 'स्व-व्यवस्था (आफै जग्गा खरिद/व्यवस्था गर्ने)', labelEn: 'Self-arrangement (Purchase/arrange yourself)' },
                { val: 'cost_sharing', labelNp: 'लागत सह-भागिता (सरकारसँग मिलेर आंशिक लागत बहन गर्ने)', labelEn: 'Cost sharing (Partial sharing with gov)' },
                { val: 'government_arrangement', labelNp: 'सरकारी व्यवस्था (नि:शुल्क/अनुदानमा जग्गा उपलब्ध गराउने)', labelEn: 'Government arrangement (Free/grant property)' },
                { val: 'resettlement', labelNp: 'पुर्नवास (सुरक्षित स्थानमा स्थानान्तरण गरी जग्गा उपलब्ध गराउने)', labelEn: 'Resettlement (Relocation to safe place)' }
              ]}
            />
          )}
        </div>
      </SectionCard>

      <SectionCard title="Housing Details (आवास (घर) सम्बन्धी विवरण)">
        <div className="p-6 space-y-1">
          <Row 
            labelNp="आवेदकको घर निर्माण गरिएको छ?" 
            labelEn="Is the applicant's house built?" 
            name="hasHouse" 
            register={register} 
            as="select"
            options={[
              { val: '', label: 'Select' },
              { val: 'yes', label: 'छ (Yes)' },
              { val: 'no', label: 'छैन (No)' }
            ]}
          />

          {watchHasHouse === 'yes' && (
            <Row 
              labelNp="घरको प्रकार" 
              labelEn="House Type" 
              name="houseType" 
              register={register} 
              as="select"
              options={[
                { val: '', label: 'Select Type' },
                { val: 'permanent', label: 'स्थायी (RCC/पक्का) - Permanent' },
                { val: 'semi_permanent', label: 'अर्ध-स्थायी - Semi-permanent' },
                { val: 'temporary', label: 'अस्थायी (झुपडी/टहरो) - Temporary' }
              ]}
            />
          )}

          {watchHasHouse === 'no' && (
            <Row 
              labelNp="आवास सम्बन्धी समाधान विकल्प" 
              labelEn="Housing Solution Option" 
              name="housingSolutionOption" 
              register={register} 
              as="radio"
              options={[
                { val: 'self_construction', labelNp: 'स्व-निर्माण (आफ्नै स्रोतबाट घर निर्माण गर्ने)', labelEn: 'Self-construction (Build from own resources)' },
                { val: 'cost_sharing', labelNp: 'लागत सह-भागिता (सरकार र लाभग्राही मिलेर निर्माण गर्ने)', labelEn: 'Cost sharing (Jointly with gov)' },
                { val: 'government_housing', labelNp: 'सरकारी आवास (सरकारद्वारा निर्मित आवास प्राप्त गर्ने)', labelEn: 'Government housing (Receive gov-built house)' },
                { val: 'rental_assistance', labelNp: 'भाडा सहयोग (भाडामा बस्न सहयोग प्राप्त गर्ने)', labelEn: 'Rental assistance (Help with rent)' },
                { val: 'improvement', labelNp: 'घर सुधार/पुनर्निर्माण (विद्यमान घरलाई सुरक्षित बनाउने)', labelEn: 'Home improvement (Make existing house safe)' }
              ]}
            />
          )}

          <Row 
            labelNp="प्राथमिकताअनुसार चाहिने आवासको स्वरूप" 
            labelEn="Form of housing required as per priority" 
            name="requiredHousingForm" 
            register={register} 
            as="radio"
            options={[
              { val: 'individual_unit', labelNp: 'व्यक्तिगत आवास इकाइ (स्वतन्त्र घर)', labelEn: 'Individual housing unit (Independent house)' },
              { val: 'multi_residential', labelNp: 'बहु-आवासीय भवन (अपार्टमेन्ट प्रकार)', labelEn: 'Multi-residential building (Apartment type)' },
              { val: 'integrated_settlement', labelNp: 'एकीकृत बस्तीमा आधारित आवास (समुदाय-आधारित)', labelEn: 'Integrated settlement-based housing (community-based)' }
            ]}
          />
        </div>
      </SectionCard>

      <div className="flex justify-between items-center mt-16 pb-12">
        <button 
          type="button"
          onClick={() => setStep(2)}
          className="px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 border border-slate-200 bg-white shadow-sm hover:text-slate-600 transition-all font-sans"
        >
          Return to Family
        </button>
        <button 
          type="submit"
          className="px-16 py-5 bg-[#1a4a8c] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#1a4a8c]/90 shadow-xl shadow-blue-900/20 transition-all active:scale-95"
        >
          Proceed to Economic & Health
        </button>
      </div>
    </form>
  );
};
