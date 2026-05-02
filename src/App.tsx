import React from 'react';
import { FormProvider, useFormContext } from './context/FormContext';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './components/auth/Login';
import { Dashboard } from './components/dashboard/Dashboard';
import { Step0Applicant } from './components/forms/Step0Applicant';
import { Step1Contact } from './components/forms/Step1Contact';
import { Step2Family } from './components/forms/Step2Family';
import { Step4Review } from './components/forms/Step4Review';

const FormStepper = () => {
  const { step, user, loading, view } = useFormContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1a4a8c]/20 border-t-[#1a4a8c] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (view === 'dashboard') {
    return (
      <MainLayout>
        <Dashboard />
      </MainLayout>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 0: return <Step0Applicant />;
      case 1: return <Step1Contact />;
      case 2: return <Step2Family />;
      case 3: return <Step4Review />;
      default: return <Step0Applicant />;
    }
  };

  return (
    <MainLayout>
      {renderStep()}
    </MainLayout>
  );
};

export default function App() {
  return (
    <FormProvider>
      <FormStepper />
    </FormProvider>
  );
}
