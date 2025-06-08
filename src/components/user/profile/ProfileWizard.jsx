import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProfileWizard.css';

// Import des composants existants
import ProfileStep2 from './ProfileStep2';

// Import des flows organisés
import ManualAmcasFlow from './ManualAmcasFlow/ManualAmcasFlow';
import UploadAmcasFlow from './UploadAmcasFlow/UploadAmcasFlow';

const ProfileWizard = ({ onCompleteProfile, initialFormData = {} }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSetupComplete] = useState(false);
  const totalSteps = 2; // 2 étapes principales : choix de méthode → flow spécifique
  const navigate = useNavigate();

  // États pour les différents flows
  const [isInManualAmcasFlow, setIsInManualAmcasFlow] = useState(false);
  const [isInUploadAmcasFlow, setIsInUploadAmcasFlow] = useState(false);

  const [formData, setFormData] = useState({
    importMethod: '',
    amcasFile: null,
    extractedData: null,
    amcasManualData: null,
    ...initialFormData,
  });

  // Gérer le défilement vers le haut lors des changements d'étape
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Mettre à jour les données du formulaire
  const updateFormData = (newData) => {
    setFormData(prevData => ({ ...prevData, ...newData }));
  };
  
  // Terminer le processus de complétion du profil
  const handleComplete = () => {
    // This function is called when the setup is truly complete.
    // It's now called when transitioning to ProfileSetupComplete.
    onCompleteProfile(formData);
  };

  // Fonction non utilisée - supprimée car le flow ne passe plus par Step2ExtractedInfo
  // const handleFinalStepCompleted = () => {
  //   setIsSetupComplete(true);
  // };

  // Fonction pour gérer l'entrée dans le flow Manual AMCAS
  const handleEnterManualAmcasFlow = () => {
    setIsInManualAmcasFlow(true);
    setCurrentStep(2);
  };

  // Fonction pour gérer la sortie du flow Manual AMCAS (retour au choix)
  const handleExitManualAmcasFlow = () => {
    setIsInManualAmcasFlow(false);
    setCurrentStep(1);
  };

  // Fonction pour gérer la finalisation du flow Manual AMCAS
  const handleManualAmcasComplete = () => {
    onCompleteProfile(formData);
    navigate('/schools');
  };

  // Fonction pour gérer l'entrée dans le flow Upload AMCAS
  const handleEnterUploadAmcasFlow = () => {
    setIsInUploadAmcasFlow(true);
    setCurrentStep(2);
  };

  // Fonction pour gérer la sortie du flow Upload AMCAS (retour au choix)
  const handleExitUploadAmcasFlow = () => {
    setIsInUploadAmcasFlow(false);
    setCurrentStep(1);
  };

  // Fonction pour gérer la finalisation du flow Upload AMCAS
  const handleUploadAmcasComplete = () => {
    onCompleteProfile(formData);
    navigate('/profile/information');
  };

  // Rendu du contenu basé sur l'étape actuelle
  const renderStepContent = () => {
    if (isSetupComplete) {
      return <ProfileSetupComplete onGetStarted={handleComplete} />;
    }

    // Si nous sommes dans le flow Manual AMCAS
    if (isInManualAmcasFlow) {
      return (
        <div className="wizard-step-content">
          <ManualAmcasFlow
            formData={formData}
            updateFormData={updateFormData}
            onComplete={handleManualAmcasComplete}
            onBack={handleExitManualAmcasFlow}
          />
        </div>
      );
    }

    // Si nous sommes dans le flow Upload AMCAS
    if (isInUploadAmcasFlow) {
      return (
        <div className="wizard-step-content">
          <UploadAmcasFlow
            formData={formData}
            updateFormData={updateFormData}
            onComplete={handleUploadAmcasComplete}
            onBack={handleExitUploadAmcasFlow}
          />
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        // ProfileStep2 devient la première étape (choix de méthode)
        return (
          <div className="wizard-step-content">
            <ProfileStep2 
              formData={formData} 
              updateFormData={updateFormData} 
              onNext={(data) => {
                // Déterminer quel flow utiliser selon la méthode choisie
                updateFormData(data);
                if (data.importMethod === 'manual') {
                  handleEnterManualAmcasFlow();
                } else if (data.importMethod === 'amcas') {
                  handleEnterUploadAmcasFlow();
                }
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Calculer l'étape actuelle pour la barre de progression
  const getCurrentProgressStep = () => {
    if (isInManualAmcasFlow || isInUploadAmcasFlow) {
      // Dans les flows spécialisés, ils gèrent leur propre progression
      return 2;
    }
    
    return currentStep;
  };

  const progressStep = getCurrentProgressStep();

  return (
    <div className="wizard-container">
      {/* Ne pas afficher la barre de progression pendant les flows spécialisés */}
      {!isInManualAmcasFlow && !isInUploadAmcasFlow && (
        <div className="wizard-progress" role="progressbar" aria-valuenow={progressStep} aria-valuemin="1" aria-valuemax="2">
          {[...Array(totalSteps)].map((_, index) => (
            <div 
              key={index} 
              className={`wizard-progress-step ${index + 1 <= progressStep ? 'active' : ''}`}
            >
              <div className="wizard-step-indicator" aria-hidden="true">
                {index + 1 < progressStep ? (
                  <CheckCircle className="wizard-step-number" size={18} />
                ) : (
                  <span className="wizard-step-number">{index + 1}</span>
                )}
              </div>
              {index < totalSteps - 1 && (
                <div className={`wizard-step-connector ${index + 1 < progressStep ? 'active' : ''}`} aria-hidden="true"></div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="wizard-body" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {renderStepContent()}
      </div>
    </div>
  );
};

export default ProfileWizard;

