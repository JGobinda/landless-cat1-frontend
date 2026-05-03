import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FormData } from '../lib/schema';

interface User {
  id: string;
  email: string;
  role?: string;
}

interface FormContextType {
  formData: Partial<FormData>;
  updateFormData: (data: Partial<FormData>) => void;
  step: number;
  setStep: (step: number) => void;
  user: User | null;
  loading: boolean;
  view: 'dashboard' | 'form';
  setView: (view: 'dashboard' | 'form') => void;
  resetForm: () => void;
  startEditing: (uid: string, data: any) => void;
  saveData: () => Promise<void>;
  editingUid: string | null;
  deleteApplication: (uid: string) => Promise<void>;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [step, setStep] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'form'>('dashboard');
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check auth on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Login failed');
    }
    const userData = await response.json();
    setUser(userData);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setView('dashboard');
  };

  const resetForm = () => {
    setFormData({});
    setStep(0);
    setEditingUid(null);
  };

  const startEditing = (uid: string, data: any) => {
    setFormData(data);
    setStep(data.currentStep || 0);
    setEditingUid(uid);
    setView('form');
  };

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...data };
      return newData;
    });
  };

  const handleSetStep = (newStep: number) => {
    setStep(newStep);
  };

  const saveData = async () => {
    const targetUid = editingUid;
    if (!user) return;
    
    const payload = {
      ...formData,
      userId: user.id,
      currentStep: step,
    };

    try {
      if (targetUid) {
        // Update existing
        await fetch(`/api/applications/${targetUid}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new
        const response = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        setEditingUid(result.id);
      }
    } catch (error) {
      console.error("Save failed:", error);
      throw error;
    }
  };

  const deleteApplication = async (uid: string) => {
    try {
      await fetch(`/api/applications/${uid}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error("Delete failed:", error);
      throw error;
    }
  };

  return (
    <FormContext.Provider value={{ 
      formData, 
      updateFormData, 
      step, 
      setStep: handleSetStep, 
      user, 
      loading,
      view,
      setView,
      resetForm,
      startEditing,
      saveData,
      editingUid,
      deleteApplication,
      login,
      logout
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
