import React from 'react';
import { FormProvider, useFormContext } from './context/FormContext';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './components/auth/Login';
import { Step0Applicant } from './components/forms/Step0Applicant';
import { Step1Contact } from './components/forms/Step1Contact';
import { Step2Family } from './components/forms/Step2Family';
import { Step4Review } from './components/forms/Step4Review';

const FormStepper = () => {
  const { step } = useFormContext();

  switch (step) {
    case 0: return <Step0Applicant />;
    case 1: return <Step1Contact />;
    case 2: return <Step2Family />;
    case 3: return <Step4Review />;
    default: return <Step0Applicant />;
  }
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <FormProvider>
      <MainLayout>
        <FormStepper />
      </MainLayout>
    </FormProvider>
  );
}
