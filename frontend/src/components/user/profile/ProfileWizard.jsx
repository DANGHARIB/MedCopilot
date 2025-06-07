import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProfileWizard.css';

// Import des composants existants
import ProfileStep2 from './ProfileStep2';
import Step2UploadAmcas from './Step2UploadAmcas';
import Step2ExtractedInfo from './Step2ExtractedInfo';
import ProfileSetupComplete from './ProfileSetupComplete';

// Import du nouveau flow Manual AMCAS
import ManualAmcasFlow from './ManualAmcasFlow/ManualAmcasFlow';

const ProfileWizard = ({ onCompleteProfile, initialFormData = {} }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const totalSteps = 4;
  const navigate = useNavigate();

  // État pour le nouveau flow Manual AMCAS (4 étapes)
  const [isInManualAmcasFlow, setIsInManualAmcasFlow] = useState(false);

  const [formData, setFormData] = useState({
    importMethod: '',
    amcasFile: null,
    extractedData: null,
    // Nouvelles données pour le flow Manual AMCAS
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
  
  // Avancer à l'étape suivante du wizard principal avec animation
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      // Si nous sommes à la dernière étape, terminer le processus
      handleComplete();
    }
  };
  
  // Revenir à l'étape précédente du wizard principal avec animation
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };
  
  // Terminer le processus de complétion du profil
  const handleComplete = () => {
    // This function is called when the setup is truly complete.
    // It's now called when transitioning to ProfileSetupComplete.
    onCompleteProfile(formData);
  };

  const handleFinalStepCompleted = () => {
    // Ne pas appeler handleComplete() immédiatement
    // Cette fonction sera appelée lorsque l'utilisateur cliquera sur "Let's get started" dans ProfileSetupComplete
    setIsSetupComplete(true); // Afficher d'abord le composant ProfileSetupComplete
  };

  // Fonction pour gérer l'entrée dans le flow Manual AMCAS
  const handleEnterManualAmcasFlow = () => {
    setIsInManualAmcasFlow(true);
    setCurrentStep(2); // Rester sur l'étape 2 mais avec le nouveau flow
  };

  // Fonction pour gérer la sortie du flow Manual AMCAS (retour au choix)
  const handleExitManualAmcasFlow = () => {
    setIsInManualAmcasFlow(false);
    setCurrentStep(1); // Retour au choix de méthode
  };

  // Fonction pour gérer la finalisation du flow Manual AMCAS
  const handleManualAmcasComplete = () => {
    // Sauvegarder les données finales
    onCompleteProfile(formData);
    
    // Rediriger directement vers MySchoolTab
    navigate('/schools');
  };

  // Rendu du contenu basé sur l'étape actuelle
  const renderStepContent = () => {
    if (isSetupComplete) {
      return <ProfileSetupComplete onGetStarted={handleComplete} />;
    }

    // Si nous sommes dans le nouveau flow Manual AMCAS
    if (isInManualAmcasFlow) {
      return (
        <div className={`wizard-step-content ${isAnimating ? 'fade-exit-active' : 'fade-enter-active'}`}>
          <ManualAmcasFlow
            formData={formData}
            updateFormData={updateFormData}
            onComplete={handleManualAmcasComplete}
            onBack={handleExitManualAmcasFlow}
          />
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        // ProfileStep2 devient la première étape (choix de méthode)
        return (
          <div className={`wizard-step-content ${isAnimating ? 'fade-exit-active' : 'fade-enter-active'}`}>
            <ProfileStep2 
              formData={formData} 
              updateFormData={updateFormData} 
              onNext={(data) => {
                // Déterminer quel flow utiliser selon la méthode choisie
                updateFormData(data);
                if (data.importMethod === 'manual') {
                  // Utiliser le nouveau flow Manual AMCAS
                  handleEnterManualAmcasFlow();
                } else {
                  // Utiliser le flow PDF AMCAS existant
                  goToNextStep();
                }
              }}
              // Pas de onBack car c'est la première étape maintenant
            />
          </div>
        );
      case 2:
        // Cette étape n'est utilisée que pour le flow AMCAS PDF
        if (formData.importMethod === 'amcas') {
          return (
            <div className={`wizard-step-content ${isAnimating ? 'fade-exit-active' : 'fade-enter-active'}`}>
              <Step2UploadAmcas
                formData={formData}
                updateFormData={updateFormData}
                onNext={goToNextStep}
                onBack={goToPreviousStep}
              />
            </div>
          );
        }
        // Si manual, nous serions dans ManualAmcasFlow
        return null;

      case 3:
        // Pour AMCAS PDF : extraction des données
        if (formData.importMethod === 'amcas') {
          return (
            <div className={`wizard-step-content ${isAnimating ? 'fade-exit-active' : 'fade-enter-active'}`}>
              <Step2ExtractedInfo
                formData={formData}
                updateFormData={updateFormData}
                onSetupComplete={handleFinalStepCompleted}
                onBack={goToPreviousStep}
              />
            </div>
          );
        }
        // Pour Manual, on ne devrait jamais arriver ici
        return null;

      case 4:
        // Étape de finalisation pour le flow AMCAS PDF uniquement
        return (
          <div className={`wizard-step-content ${isAnimating ? 'fade-exit-active' : 'fade-enter-active'}`}>
            <ProfileSetupComplete onGetStarted={handleComplete} />
          </div>
        );

      default:
        return null;
    }
  };

  // Calculer l'étape actuelle pour la barre de progression
  const getCurrentProgressStep = () => {
    if (isInManualAmcasFlow) {
      // Dans le flow Manual AMCAS, nous sommes techniquement à l'étape 2
      // mais ManualAmcasFlow gère sa propre progression interne
      return 2;
    }
    
    // Flow AMCAS : Step2 (choix) → Upload → Extract → Complete
    return currentStep;
  };

  const progressStep = getCurrentProgressStep();

  return (
    <div className="wizard-container">
      {/* Ne pas afficher la barre de progression pendant le flow Manual AMCAS car il a sa propre progression */}
      {!isInManualAmcasFlow && (
        <div className="wizard-progress" role="progressbar" aria-valuenow={progressStep} aria-valuemin="1" aria-valuemax="4">
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
