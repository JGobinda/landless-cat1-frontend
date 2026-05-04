import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FormData } from '../lib/schema';
import { AuthUser, logoutUser } from '../services/authService';
import { tokenStorage } from '../services/api';

interface FormContextType {
  formData: any;
  updateFormData: (data: any) => void;
  resetForm: () => void;
  view: 'dashboard' | 'form' | 'list';
  setView: (view: 'dashboard' | 'form' | 'list') => void;
  step: number;
  setStep: (step: number) => void;
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  loading: boolean;
  editingUid: string | null;
  startEditing: (uid: string, data: any) => void;
  deleteApplication: (uid: string) => Promise<void>;
  processId: string | null;
  setProcessId: (id: string | null) => void;
  saveData: () => Promise<void>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<any>({ category: 'CAT1' });
  const [view, setView] = useState<'dashboard' | 'form' | 'list'>('dashboard');
  const [step, setStep] = useState(-1);
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [processId, setProcessId] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedForm = localStorage.getItem('form_data');
    if (savedForm) setFormData(JSON.parse(savedForm));
    
    const savedProcessId = localStorage.getItem('process_id');
    if (savedProcessId) setProcessId(savedProcessId);

    const token = tokenStorage.getAccess();
    if (!token) {
      setLoading(false);
      return;
    }

    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        const parsed: AuthUser = JSON.parse(storedUser);
        setUser(parsed);
      } catch {
        tokenStorage.clear();
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false);
  }, []);

  // global logout
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('authUser');
      localStorage.removeItem('process_id');
      setProcessId(null);
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const handleSetUser = (u: AuthUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('authUser', JSON.stringify(u));
    } else {
      localStorage.removeItem('authUser');
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error('Logout failed', e);
    }
    handleSetUser(null);
    setProcessId(null);
    localStorage.removeItem('process_id');
  };

  const updateFormData = (data: any) => {
    setFormData((prev: any) => {
      const updated = { ...prev, ...data };
      localStorage.setItem('form_data', JSON.stringify(updated));
      return updated;
    });
  };

  const updateProcessId = (id: string | null) => {
    setProcessId(id);
    if (id) {
      localStorage.setItem('process_id', id);
    } else {
      localStorage.removeItem('process_id');
    }
  };

  const resetForm = () => {
    setFormData({ category: 'CAT1' });
    setStep(-1);
    setEditingUid(null);
    setProcessId(null);
    localStorage.removeItem('form_data');
    localStorage.removeItem('process_id');
  };

  const startEditing = (uid: string, data: any) => {
    setFormData(data);
    setStep(0);
    setEditingUid(uid);
    setView('form');
  };

  const saveData = async () => {
    // save left
  };

  const deleteApplication = async (uid: string) => {
    // delete left
  };

  return (
    <FormContext.Provider value={{
      formData,
      updateFormData,
      resetForm,
      view,
      setView,
      step,
      setStep,
      user,
      setUser: handleSetUser,
      logout,
      loading,
      editingUid,
      startEditing,
      deleteApplication,
      processId,
      setProcessId: updateProcessId,
      saveData
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error('useFormContext must be used within a FormProvider');
  return context;
};
