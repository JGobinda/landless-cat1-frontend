import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FormData } from '../lib/schema';
import { auth, db, OperationType, handleFirestoreError } from '../lib/firebase';
import { onAuthStateChanged, User, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';

interface FormContextType {
  formData: Partial<FormData>;
  updateFormData: (data: Partial<FormData>) => void;
  step: number;
  setStep: (step: number) => void;
  user: User | null;
  loading: boolean;
  view: 'dashboard' | 'form' | 'list';
  setView: (view: 'dashboard' | 'form' | 'list') => void;
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
  const [view, setView] = useState<'dashboard' | 'form' | 'list'>('dashboard');
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser && currentUser.email === 'test@gmail.com') {
        setView('dashboard');
      } else if (currentUser) {
        setView('form');
        setEditingUid(currentUser.uid);
        // UI ONLY MODE: Bypass Firestore Loading
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setFormData({});
    setStep(-1);
    // Generate a fresh unique ID for NEW applications to prevent overwriting
    const newAppId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setEditingUid(newAppId);
  };

  const startEditing = (uid: string, data: any) => {
    setFormData(data);
    setStep(0);
    setEditingUid(uid);
    setView('form');
  };

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => {
      const { id: _, ...rest } = prev;
      const newData = { ...rest, ...data };
      const targetUid = editingUid || user?.uid;
      
      // DB Save bypassed for UI-ONLY mode
      return newData;
    });
  };

  const handleSetStep = (newStep: number) => {
    setStep(newStep);
    // const targetUid = editingUid || user?.uid;
    // DB Save bypassed for UI-ONLY mode
  };

  const saveData = async () => {
    // DB Save bypassed for UI-ONLY mode
  };

  const deleteApplication = async (uid: string) => {
    // DB Save bypassed for UI-ONLY mode
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
