import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FormData } from '../lib/schema';
import { auth, db, OperationType, handleFirestoreError } from '../lib/firebase';
import { onAuthStateChanged, User, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

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
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [step, setStep] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'form'>('dashboard');
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
        // Load data from Firestore
        const docRef = doc(db, 'applications', currentUser.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
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
    setEditingUid(user?.uid || null);
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
      
      // Async save to firestore if user exists
      if (user && targetUid) {
        const docRef = doc(db, 'applications', targetUid);
        const { id: __, ...saveData } = newData;
        setDoc(docRef, {
          ...saveData,
          userId: targetUid,
          currentStep: step,
          updatedAt: serverTimestamp()
        }, { merge: true }).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, `applications/${targetUid}`);
        });
      }
      return newData;
    });
  };

  const handleSetStep = (newStep: number) => {
    setStep(newStep);
    const targetUid = editingUid || user?.uid;
    if (user && targetUid) {
      const docRef = doc(db, 'applications', targetUid);
      updateDoc(docRef, {
        currentStep: newStep,
        updatedAt: serverTimestamp()
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `applications/${targetUid}`);
      });
    }
  };

  const saveData = async () => {
    const targetUid = editingUid || user?.uid;
    if (!user || !targetUid) return;
    
    const docRef = doc(db, 'applications', targetUid);
    const { id: _, ...rest } = formData;
    try {
      await setDoc(docRef, {
        ...rest,
        userId: targetUid,
        currentStep: step,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `applications/${targetUid}`);
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
      saveData 
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
