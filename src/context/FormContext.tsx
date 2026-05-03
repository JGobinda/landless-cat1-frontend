import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FormData } from '../lib/schema';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

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
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [step, setStep] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'form'>('dashboard');
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth Listener (Keeping for session identification)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser && currentUser.email === 'test@gmail.com') {
        setView('dashboard');
      } else if (currentUser) {
        setView('form');
        setEditingUid(currentUser.uid);
        // Load data from custom API
        try {
          const response = await fetch(`/api/applications?userId=${currentUser.uid}`);
          const apps = await response.json();
          if (apps && apps.length > 0) {
            const data = apps[0];
            setFormData(data as Partial<FormData>);
            setStep(data.currentStep || 0);
          }
        } catch (error) {
          console.error("Error loading data:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setFormData({});
    setStep(0);
    // Use the custom API generated ID or just let Mongo handle it
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
      userId: user.uid,
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
    }
  };

  const deleteApplication = async (uid: string) => {
    try {
      await fetch(`/api/applications/${uid}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error("Delete failed:", error);
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
      deleteApplication
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
