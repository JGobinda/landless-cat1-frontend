import React, { useEffect, useState } from 'react';
import { db, OperationType, handleFirestoreError } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useFormContext } from '../../context/FormContext';
import { motion, AnimatePresence } from 'motion/react';
import { User, Plus, Search, Calendar, FileText, ChevronRight, Filter, X, MapPin, Phone, Users, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

const ApplicationModal = ({ app, onClose, startEditing }: { app: any, onClose: () => void, startEditing: (uid: string, data: any) => void }) => {
  if (!app) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-[#020617]/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 p-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center border border-indigo-600/30">
                 <User className="text-indigo-400" />
              </div>
              <div>
                 <h2 className="text-xl font-black text-white uppercase tracking-tight">{app.firstNameEn} {app.lastNameEn}</h2>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Application ID: {app.id.slice(0, 8)}</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400">
              <X size={24} />
           </button>
        </div>

        <div className="p-8 space-y-12">
          {/* Section: Core Identity */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
             <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">NID Number</p>
                <p className="text-sm font-bold text-white font-mono">{app.nidNo || 'NOT ASSIGNED'}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Citizenship No</p>
                <p className="text-sm font-bold text-white font-mono">{app.citizenshipNo || 'N/A'}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Gender</p>
                <p className="text-sm font-bold text-white uppercase">{app.gender || 'N/A'}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nationality</p>
                <p className="text-sm font-bold text-white uppercase">{app.nationality || 'NEPALI'}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 bg-white/5 p-6 rounded-3xl border border-white/5">
             <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Marital Status</p>
                <p className="text-xs font-bold text-white uppercase">{app.maritalStatus || 'N/A'}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Education</p>
                <p className="text-xs font-bold text-white uppercase">{app.education || 'N/A'}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Business</p>
                <p className="text-xs font-bold text-white uppercase">{app.business || 'N/A'}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Caste</p>
                <p className="text-xs font-bold text-white uppercase">{app.caste || 'N/A'}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Religion</p>
                <p className="text-xs font-bold text-white uppercase">{app.religion || 'N/A'}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             {/* Left Column: Contact & Birth */}
             <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-indigo-400 mb-2">
                     <MapPin size={16} />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Contact & Birth</h3>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-5">
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Birth Place</p>
                          <p className="text-xs text-white uppercase font-bold">{app.birthPlace || 'N/A'}</p>
                       </div>
                       <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Issued District</p>
                          <p className="text-xs text-white uppercase font-bold">{app.district || 'N/A'}</p>
                       </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Issued Date</p>
                           <p className="text-xs text-white uppercase font-bold">{app.issuedDate || 'N/A'}</p>
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">CC Type</p>
                           <p className="text-xs text-white uppercase font-bold">{app.ccType || 'N/A'}</p>
                        </div>
                     </div>
                     <div className="pt-4 border-t border-white/5">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</p>
                        <p className="text-xs text-white font-bold">{app.permMobile || 'N/A'}</p>
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                        <p className="text-xs text-white font-bold">{app.permEmail || 'N/A'}</p>
                     </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-emerald-400 mb-2">
                     <ShieldCheck size={16} />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Residential Address</h3>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-4">
                     <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Permanent</p>
                        <p className="text-xs text-white uppercase leading-relaxed">
                          {app.permLocalLevel}-{app.permWard}, {app.permDistrict}, {app.permState}
                        </p>
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Temporary</p>
                        <p className="text-xs text-white uppercase leading-relaxed">
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
                <div className="flex items-center gap-3 text-amber-400 mb-2">
                   <Users size={16} />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Ancestral Lineage</h3>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-6">
                   <div className="space-y-3">
                      <div className="flex justify-between items-center">
                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Father</span>
                         <span className="text-xs font-bold text-white uppercase">{app.fatherFirstNameEn} {app.fatherLastNameEn}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 uppercase leading-tight ml-4">
                        {app.fatherPermLocalLevel}-{app.fatherPermWard}, {app.fatherPermDistrict}, {app.fatherPermState}
                      </p>
                   </div>
                   
                   <div className="pt-4 border-t border-white/5 space-y-3">
                      <div className="flex justify-between items-center">
                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Mother</span>
                         <span className="text-xs font-bold text-white uppercase">{app.motherFirstNameEn} {app.motherLastNameEn}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 uppercase leading-tight ml-4">
                        {app.motherPermLocalLevel || 'Address Not Recorded'}
                      </p>
                   </div>

                   <div className="pt-4 border-t border-white/5 space-y-3">
                      <div className="flex justify-between items-center">
                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Grandfather</span>
                         <span className="text-xs font-bold text-white uppercase">{app.grandFatherFirstNameEn} {app.grandFatherLastNameEn}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 uppercase leading-tight ml-4">
                        {app.grandFatherPermLocalLevel || 'Address Not Recorded'}
                      </p>
                   </div>
                </div>
                
                <div className="p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                   <div className="flex items-center gap-3 text-indigo-400 mb-3">
                      <FileText size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Record Metadata</span>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <p className="text-[8px] font-bold text-slate-600 uppercase">Created On</p>
                         <p className="text-[10px] text-white/50">{app.updatedAt && typeof app.updatedAt.toDate === 'function' ? app.updatedAt.toDate().toLocaleDateString() : 'SYSTEM'}</p>
                      </div>
                      <div>
                         <p className="text-[8px] font-bold text-slate-600 uppercase">Security Level</p>
                         <p className="text-[10px] text-indigo-400/70 font-black">CLASSIFIED</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex justify-end gap-4">
             <button 
               onClick={onClose}
               className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
             >
                Close
             </button>
             <button 
               onClick={() => { onClose(); startEditing(app.id, app); }}
               className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
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
  const { setView, resetForm, startEditing } = useFormContext();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, 'applications'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'applications');
    });

    return () => unsubscribe();
  }, []);

  const filteredApps = applications.filter(app => 
    `${app.firstNameEn} ${app.lastNameEn}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.citizenshipNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Applications', value: applications.length, icon: FileText, color: 'text-indigo-400' },
    { label: 'Pending Verification', value: applications.filter(a => a.currentStep < 3).length, icon: ShieldCheck, color: 'text-amber-400' },
    { label: 'Registration Finalized', value: applications.filter(a => a.currentStep === 3).length, icon: Calendar, color: 'text-emerald-400' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-10 space-y-12 animate-in fade-in duration-700">
      <AnimatePresence>
        {selectedApp && <ApplicationModal app={selectedApp} onClose={() => setSelectedApp(null)} startEditing={startEditing} />}
      </AnimatePresence>

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">National Registry</h1>
          <p className="text-slate-500 font-medium tracking-tight">Passport Application Management & Civil Records System</p>
        </div>
        
        <button 
          onClick={() => { resetForm(); setView('form'); }}
          className="flex items-center gap-4 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 active:scale-95 transition-all shadow-2xl shadow-indigo-600/20"
        >
          <Plus size={18} />
          Begin Registration
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon size={64} />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{stat.label}</p>
            <p className={cn("text-4xl font-black tracking-tighter", stat.color)}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
        <div className="p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text"
              placeholder="Filter by name or NID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-all font-medium"
            />
          </div>
          <button className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-all">
            <Filter size={14} />
            Advanced
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="bg-white/[0.02]">
                   <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Applicant Name</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Record Status</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Submission Date</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Querying Identity Server...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest italic">
                      Zero matching records found
                    </td>
                  </tr>
                ) : filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-white/10 flex items-center justify-center text-indigo-400 font-bold uppercase">
                          {app.firstNameEn?.[0]}{app.lastNameEn?.[0]}
                        </div>
                        <span className="text-sm font-bold text-white tracking-tight uppercase">{app.firstNameEn} {app.lastNameEn}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                        app.currentStep === 3 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      )}>
                        {app.currentStep === 3 ? 'Finalized' : `Step ${app.currentStep + 1} Pending`}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-medium text-slate-500">
                        {app.updatedAt && typeof app.updatedAt.toDate === 'function' ? app.updatedAt.toDate().toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => setSelectedApp(app)}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            View
                        </button>
                        <button 
                          onClick={() => startEditing(app.id, app)}
                          className="px-4 py-2 bg-indigo-600/20 border border-indigo-600/30 rounded-lg text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                        >
                            Edit
                        </button>
                       </div>
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
