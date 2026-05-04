import React, { useEffect, useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import { motion, AnimatePresence } from 'motion/react';
import { User, Plus, Search, Calendar, FileText, ChevronRight, Filter, X, MapPin, Phone, Users, ShieldCheck, Clock, FileCheck, XCircle, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';

const MOCK_APPLICATIONS = [
  {
    id: 'D-2026-NID-88392',
    firstNameEn: 'Ram',
    lastNameEn: 'Bahadur Thapa',
    nidNo: '987-223-9128',
    citizenshipNo: '12-01-72-04532',
    gender: 'MALE',
    nationality: 'NEPALI',
    maritalStatus: 'MARRIED',
    education: 'Secondary Level',
    business: 'Agriculture',
    caste: 'Chhetri',
    religion: 'Hinduism',
    birthPlace: 'Kathmandu',
    district: 'Kathmandu',
    issuedDate: '2072-05-12',
    ccType: 'Citizenship',
    permMobile: '9841XXXXXX',
    permEmail: 'ram.bahadur@example.com',
    permState: 'Bagmati',
    permDistrict: 'Kathmandu',
    permLocalLevel: 'Kathmandu Metropolitan',
    permWard: '32',
    fatherFirstNameEn: 'Hari',
    fatherLastNameEn: 'Thapa',
    fatherPermState: 'Bagmati',
    fatherPermDistrict: 'Kathmandu',
    fatherPermLocalLevel: 'Kathmandu Metropolitan',
    fatherPermWard: '32',
    motherFirstNameEn: 'Sita',
    motherLastNameEn: 'Thapa',
    grandFatherFirstNameEn: 'Krishna',
    grandFatherLastNameEn: 'Thapa',
    currentStep: 3,
    category: 'Category 1',
    updatedAt: { toDate: () => new Date('2026-05-01T10:30:00Z') },
    photoUrl: null
  },
  {
    id: 'D-2026-NID-44581',
    firstNameEn: 'Sita',
    lastNameEn: 'Kumari Shah',
    nidNo: '882-119-3382',
    citizenshipNo: '67-22-09-11234',
    gender: 'FEMALE',
    nationality: 'NEPALI',
    maritalStatus: 'MARRIED',
    education: 'Bachelor Degree',
    business: 'Service',
    caste: 'Shah',
    religion: 'Hinduism',
    birthPlace: 'Pokhara',
    district: 'Kaski',
    issuedDate: '2075-08-20',
    ccType: 'Citizenship',
    permMobile: '9851XXXXXX',
    permEmail: 'sita.shah@example.com',
    permState: 'Gandaki',
    permDistrict: 'Kaski',
    permLocalLevel: 'Pokhara Metropolitan',
    permWard: '15',
    fatherFirstNameEn: 'Manish',
    fatherLastNameEn: 'Shah',
    motherFirstNameEn: 'Maya',
    motherLastNameEn: 'Shah',
    grandFatherFirstNameEn: 'Gopal',
    grandFatherLastNameEn: 'Shah',
    currentStep: 3,
    category: 'Category 2',
    updatedAt: { toDate: () => new Date('2026-05-02T14:45:00Z') },
    photoUrl: null
  },
  {
    id: 'D-2026-NID-22910',
    firstNameEn: 'Bikram',
    lastNameEn: 'Sunuwar',
    nidNo: '112-998-4452',
    citizenshipNo: 'None',
    gender: 'MALE',
    nationality: 'NEPALI',
    maritalStatus: 'SINGLE',
    education: 'Under-SLC',
    business: 'Labor',
    caste: 'Sunuwar',
    religion: 'Kirat',
    birthPlace: 'Dhankuta',
    district: 'Dhankuta',
    issuedDate: 'N/A',
    ccType: 'Birth Registration',
    permMobile: '9812XXXXXX',
    permEmail: 'bikram.s@example.com',
    permState: 'Koshi',
    permDistrict: 'Dhankuta',
    permLocalLevel: 'Dhankuta Municipality',
    permWard: '04',
    fatherFirstNameEn: 'Purna',
    fatherLastNameEn: 'Sunuwar',
    motherFirstNameEn: 'Devi',
    motherLastNameEn: 'Sunuwar',
    grandFatherFirstNameEn: 'Lalit',
    grandFatherLastNameEn: 'Sunuwar',
    currentStep: 1,
    category: 'Category 3',
    updatedAt: { toDate: () => new Date('2026-05-04T08:00:00Z') },
    photoUrl: null
  }
];

const DeleteConfirmationModal = ({ app, onClose, onConfirm, isDeleting }: { app: any, onClose: () => void, onConfirm: () => void, isDeleting: boolean }) => {
  if (!app) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 pb-4 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-3xl mx-auto flex items-center justify-center mb-6 border border-red-100">
            <X className="text-red-500 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">Delete Record?</h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            You are about to permanently remove <span className="font-bold text-slate-800">{app.firstNameEn} {app.lastNameEn}</span>'s registration. This action cannot be reversed.
          </p>
        </div>
        <div className="p-8 pt-4 flex flex-col gap-3">
          <button 
            disabled={isDeleting}
            onClick={onConfirm}
            className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-red-900/20 disabled:opacity-50"
          >
            {isDeleting ? 'Erasing Record...' : 'Confirm Destruction'}
          </button>
          <button 
            disabled={isDeleting}
            onClick={onClose}
            className="w-full py-5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ApplicationModal = ({ app, onClose, startEditing, onDeleteClick }: { app: any, onClose: () => void, startEditing: (uid: string, data: any) => void, onDeleteClick: (app: any) => void }) => {
  if (!app) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-100 p-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1a4a8c]/10 flex items-center justify-center border border-[#1a4a8c]/20">
                 <User className="text-[#1a4a8c]" />
              </div>
              <div>
                 <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{app.firstNameEn} {app.lastNameEn}</h2>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Application ID: {app.id.slice(0, 15)}</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
              <X size={24} />
           </button>
        </div>

        <div className="p-4 md:p-8 space-y-8 md:space-y-12">
          {/* Section: Core Identity */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
             <div className="space-y-1">
                <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">NID Number</p>
                <p className="text-xs md:text-sm font-bold text-slate-800 font-mono truncate">{app.nidNo || 'N/A'}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Citizenship No</p>
                <p className="text-xs md:text-sm font-bold text-slate-800 font-mono truncate">{app.citizenshipNo || 'N/A'}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Gender</p>
                <p className="text-xs md:text-sm font-bold text-slate-800 uppercase">{app.gender || 'N/A'}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Nationality</p>
                <p className="text-xs md:text-sm font-bold text-slate-800 uppercase">{app.nationality || 'NEPALI'}</p>
             </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8 bg-slate-50 p-4 md:p-6 rounded-3xl border border-slate-100">
             <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                <p className="text-[10px] md:text-xs font-bold text-slate-800 uppercase">{app.maritalStatus || 'N/A'}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Education</p>
                <p className="text-[10px] md:text-xs font-bold text-slate-800 uppercase line-clamp-1">{app.education || 'N/A'}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Business</p>
                <p className="text-[10px] md:text-xs font-bold text-slate-800 uppercase">{app.business || 'N/A'}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Caste</p>
                <p className="text-[10px] md:text-xs font-bold text-slate-800 uppercase">{app.caste || 'N/A'}</p>
             </div>
             <div className="space-y-1 hidden lg:block">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Religion</p>
                <p className="text-[10px] md:text-xs font-bold text-slate-800 uppercase">{app.religion || 'N/A'}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             {/* Left Column: Contact & Birth */}
             <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[#1a4a8c] mb-2">
                     <MapPin size={16} />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Contact & Birth</h3>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-5">
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Birth Place</p>
                          <p className="text-xs text-slate-800 uppercase font-bold">{app.birthPlace || 'N/A'}</p>
                       </div>
                       <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Issued District</p>
                          <p className="text-xs text-slate-800 uppercase font-bold">{app.district || 'N/A'}</p>
                       </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Issued Date</p>
                           <p className="text-xs text-slate-800 uppercase font-bold">{app.issuedDate || 'N/A'}</p>
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">CC Type</p>
                           <p className="text-xs text-slate-800 uppercase font-bold">{app.ccType || 'N/A'}</p>
                        </div>
                     </div>
                     <div className="pt-4 border-t border-slate-200">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</p>
                        <p className="text-xs text-slate-800 font-bold">{app.permMobile || 'N/A'}</p>
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                        <p className="text-xs text-slate-800 font-bold">{app.permEmail || 'N/A'}</p>
                     </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-emerald-600 mb-2">
                     <ShieldCheck size={16} />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Residential Address</h3>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                     <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Permanent</p>
                        <p className="text-xs text-slate-800 uppercase leading-relaxed">
                          {app.permLocalLevel}-{app.permWard}, {app.permDistrict}, {app.permState}
                        </p>
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Temporary</p>
                        <p className="text-xs text-slate-800 uppercase leading-relaxed">
                          {app.tempLocalLevel || app.permLocalLevel}-{app.tempWard || app.permWard}, 
                          {app.tempDistrict || app.permDistrict}, 
                          {app.tempState || app.permState}
                        </p>
                     </div>
                  </div>
                </div>
             </div>

             {/* Right Column: Lineage */}
             <div className="space-y-4">
                <div className="flex items-center gap-3 text-amber-600 mb-2">
                   <Users size={16} />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Ancestral Lineage</h3>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
                   <div className="space-y-3">
                      <div className="flex justify-between items-center">
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Father</span>
                         <span className="text-xs font-bold text-slate-800 uppercase">{app.fatherFirstNameEn} {app.fatherLastNameEn}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase leading-tight ml-4">
                        {app.fatherPermLocalLevel}-{app.fatherPermWard}, {app.fatherPermDistrict}, {app.fatherPermState}
                      </p>
                   </div>
                   
                   <div className="pt-4 border-t border-slate-200 space-y-3">
                      <div className="flex justify-between items-center">
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Mother</span>
                         <span className="text-xs font-bold text-slate-800 uppercase">{app.motherFirstNameEn} {app.motherLastNameEn}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase leading-tight ml-4">
                        {app.motherPermLocalLevel || 'Address Not Recorded'}
                      </p>
                   </div>

                   <div className="pt-4 border-t border-slate-200 space-y-3">
                      <div className="flex justify-between items-center">
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Grandfather</span>
                         <span className="text-xs font-bold text-slate-800 uppercase">{app.grandFatherFirstNameEn} {app.grandFatherLastNameEn}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase leading-tight ml-4">
                        {app.grandFatherPermLocalLevel || 'Address Not Recorded'}
                      </p>
                   </div>
                </div>
                
                <div className="p-6 bg-[#1a4a8c]/5 rounded-2xl border border-[#1a4a8c]/10">
                   <div className="flex items-center gap-3 text-[#1a4a8c] mb-3">
                      <FileText size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Record Metadata</span>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <p className="text-[8px] font-bold text-slate-400 uppercase">Created On</p>
                         <p className="text-[10px] text-slate-600">{app.updatedAt && typeof app.updatedAt.toDate === 'function' ? app.updatedAt.toDate().toLocaleDateString() : 'SYSTEM'}</p>
                      </div>
                      <div>
                         <p className="text-[8px] font-bold text-slate-400 uppercase">Security Level</p>
                         <p className="text-[10px] text-[#1a4a8c] font-black">CLASSIFIED</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
             <button 
               onClick={() => onDeleteClick(app)}
               className="px-6 md:px-10 py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-200"
             >
                Delete Record
             </button>
             <button 
               onClick={onClose}
               className="px-6 md:px-10 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
             >
                Close
             </button>
             <button 
               onClick={() => { onClose(); startEditing(app.id, app); }}
               className="px-6 md:px-10 py-4 bg-[#1a4a8c] hover:bg-[#1a4a8c]/90 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
             >
                Modify Record
             </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Dashboard: React.FC = () => {
  const { setView, resetForm, startEditing, deleteApplication, view } = useFormContext();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [appToDelete, setAppToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (!appToDelete) return;
    setIsDeleting(true);
    // Hardcoded delete: just update local state
    setTimeout(() => {
      setApplications(prev => prev.filter(a => a.id !== appToDelete.id));
      setAppToDelete(null);
      if (selectedApp?.id === appToDelete.id) {
        setSelectedApp(null);
      }
      setIsDeleting(false);
    }, 500);
  };

  useEffect(() => {
    // ─── Simulation of Identity Server Query ───────────────────────────────
    const timer = setTimeout(() => {
      setApplications(MOCK_APPLICATIONS);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const filteredApps = applications.filter((app, idx) => {
    const matchesSearch = `${app.firstNameEn} ${app.lastNameEn}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.citizenshipNo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const cat = app.category || `Category ${(idx % 3) + 1}`;
    const matchesCategory = categoryFilter === 'all' || cat === categoryFilter;

    const matchesStatus = statusFilter === 'all' ? true : 
      statusFilter === 'finalized' ? app.currentStep === 3 : app.currentStep < 3;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const topStats = [
    { label: 'Total Applicants', value: applications.length, icon: Users, color: 'text-blue-600' },
    { label: 'Pending Applicants', value: applications.filter(a => a.currentStep < 3).length, icon: Clock, color: 'text-amber-500' },
    { label: 'Approved Applicants', value: applications.filter(a => a.currentStep === 3).length, icon: FileCheck, color: 'text-emerald-500' },
    { label: 'Rejected Applicants', value: 0, icon: XCircle, color: 'text-red-500' },
  ];

  const bottomStats = [
    { label: 'First Category', sublabel: 'NID, नागरिकता र मतदाता परिचयपत्र भएका', value: applications.filter(a => a.category === 'Category 1').length },
    { label: 'Second Category', sublabel: 'NID छैन तर नागरिकता वा मतदाता परिचयपत्र छ', value: applications.filter(a => a.category === 'Category 2').length },
    { label: 'Third Category', sublabel: 'कुनै सरकारी कागजात नभएका', value: applications.filter(a => a.category === 'Category 3').length },
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-10 space-y-8 md:space-y-12 animate-in fade-in duration-700">
      <AnimatePresence>
        {selectedApp && (
          <ApplicationModal 
            app={selectedApp} 
            onClose={() => setSelectedApp(null)} 
            startEditing={startEditing} 
            onDeleteClick={(app) => setAppToDelete(app)}
          />
        )}
        {appToDelete && (
          <DeleteConfirmationModal 
            app={appToDelete} 
            onClose={() => setAppToDelete(null)} 
            onConfirm={handleDelete}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>


      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 bg-[#1a4a8c]/5 p-6 md:p-0 rounded-3xl md:bg-transparent">
        <div className="space-y-1 md:space-y-2">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter ">
            {view === 'list' ? 'Applicant List' : 'Dashboard'}
          </h1>
          <p className="text-slate-500 text-sm font-medium tracking-tight">सुकुम्बासी निवेदकहरूको समग्र विवरण</p>
        </div>
      </div>

      {/* Stats Section */}
      {view === 'dashboard' && (
      <div className="space-y-4">
        {/* Top 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {topStats.map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-slate-200 p-6 rounded-[1rem] flex items-center justify-between shadow-sm"
            >
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={cn("p-2", stat.color)}>
                <stat.icon size={28} strokeWidth={2} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {bottomStats.map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (topStats.length + idx) * 0.1 }}
              className="bg-white border border-slate-200 p-6 rounded-[1rem] flex flex-col gap-4 shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <p className="font-bold text-slate-800">{stat.label}</p>
                <p className="text-xs text-slate-400">{stat.sublabel}</p>
              </div>
              <div className="flex flex-col mt-2">
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">निवेदक</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      )}

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Name, Citizen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-6 py-4 text-xs text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#1a4a8c]/50 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="md:w-48 bg-white border border-slate-200 rounded-lg px-4 py-4 text-xs font-medium text-slate-600 outline-none focus:border-[#1a4a8c]/50 transition-all cursor-pointer"
            >
              <option value="all">Status</option>
              <option value="pending">Pending</option>
              <option value="finalized">Finalized</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="md:w-48 bg-white border border-slate-200 rounded-lg px-4 py-4 text-xs font-medium text-slate-600 outline-none focus:border-[#1a4a8c]/50 transition-all cursor-pointer"
            >
              <option value="all">All Category</option>
              <option value="Category 1">Category 1</option>
              <option value="Category 2">Category 2</option>
              <option value="Category 3">Category 3</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="bg-slate-50">
                   <th className="px-8 py-5 w-24 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">Photo</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">NIN/Citizenship</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">Applicant Name</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">Record Status</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">Category</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">Submission Date</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-[#1a4a8c]/20 border-t-[#1a4a8c] rounded-full animate-spin" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Querying Identity Server...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest italic">
                      Zero matching records found
                    </td>
                  </tr>
                ) : filteredApps.map((app, idx) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6 w-24">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {app.photoUrl ? (
                          <img src={app.photoUrl} alt="Applicant" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-mono font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        {app.citizenshipNo || 'N/A'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-700 tracking-tight uppercase">{app.firstNameEn} {app.lastNameEn}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                        app.currentStep === 3 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                      )}>
                        {app.currentStep === 3 ? 'Finalized' : `Step ${app.currentStep + 1} Pending`}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-medium text-slate-700 uppercase">
                        {app.category || `Category ${(idx % 3) + 1}`}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-medium text-slate-400">
                        {app.updatedAt && typeof app.updatedAt.toDate === 'function' ? app.updatedAt.toDate().toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right relative">
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setActiveMenu(activeMenu === app.id ? null : app.id);
                         }}
                         className="p-2 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-xl transition-all text-slate-400 hover:text-slate-600"
                       >
                         <MoreHorizontal size={20} />
                       </button>
                       {activeMenu === app.id && (
                         <div 
                           className="absolute right-12 top-10 w-36 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 text-left"
                           onClick={(e) => e.stopPropagation()}
                         >
                           <button 
                             onClick={() => { setActiveMenu(null); setSelectedApp(app); }}
                             className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                           >
                               View
                           </button>
                           <button 
                             onClick={() => { setActiveMenu(null); startEditing(app.id, app); }}
                             className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                           >
                               Edit
                           </button>
                           <button 
                             onClick={() => { setActiveMenu(null); /* Placeholder for Status functionality */ }}
                             className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                           >
                               Status
                           </button>
                         </div>
                       )}
                    </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
