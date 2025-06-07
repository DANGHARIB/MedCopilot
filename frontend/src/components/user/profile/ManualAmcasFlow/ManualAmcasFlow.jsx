import React, { useState, useEffect } from 'react';
import './ManualAmcasFlow.css';

// Import des composants d'étapes
import PersonalComments from './components/Step1PersonalComments/PersonalComments';
import Experiences from './components/Step2Experiences/Experiences';
import OtherImpactful from './components/Step3OtherImpactful/OtherImpactful';
import SchoolPicker from './components/Step4SchoolList/SchoolPicker';

// Import des composants partagés
import ProgressIndicator from './components/shared/ProgressIndicator';

const ManualAmcasFlow = ({ 
  formData,           // Données du formulaire principal (ProfileWizard)
  updateFormData,     // Function pour mettre à jour les données principales
  onComplete,         // Callback quand le flow est terminé
  onBack             // Callback pour retourner au choix de méthode
}) => {
  // État local pour les données AMCAS
  const [amcasFormData, setAmcasFormData] = useState({
    personalComments: {
      text: formData?.amcasManualData?.personalComments?.text || "",
      wordCount: 0,
      charCount: 0,
      lastModified: null
    },
    experiences: formData?.amcasManualData?.experiences || [],
    hasOtherImpactfulExperiences: formData?.amcasManualData?.hasOtherImpactfulExperiences || null,
    otherImpactfulExperiences: formData?.amcasManualData?.otherImpactfulExperiences || [],
    schoolList: formData?.amcasManualData?.schoolList || [],
    metadata: {
      currentStep: 1,
      completedSteps: [],
      totalSteps: 4,
      lastModified: new Date().toISOString(),
      autoSaveEnabled: true,
      validationErrors: {},
      isComplete: false
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-sauvegarde locale des données
  useEffect(() => {
    const draftKey = 'amcas_manual_draft';
    localStorage.setItem(draftKey, JSON.stringify(amcasFormData));
  }, [amcasFormData]);

  // Chargement des données sauvegardées au montage du composant
  useEffect(() => {
    const draftKey = 'amcas_manual_draft';
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setAmcasFormData(prev => ({ ...prev, ...parsedDraft }));
      } catch (error) {
        console.warn('Erreur lors du chargement de la sauvegarde:', error);
      }
    }
  }, []);

  // Scroll vers le haut lors des changements d'étape
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Mettre à jour les données AMCAS
  const updateAmcasFormData = (stepData) => {
    setAmcasFormData(prev => {
      const newData = {
        ...prev,
        ...stepData,
        metadata: {
          ...prev.metadata,
          lastModified: new Date().toISOString()
        }
      };
      
      // Mettre à jour les étapes complétées automatiquement
      const completedSteps = [];
      
      // Étape 1: Personal Comments complétée si text présent
      if (newData.personalComments?.text?.trim()?.length > 0) {
        completedSteps.push(1);
      }
      
      // Étape 2: Experiences complétée si au moins une expérience
      if (newData.experiences?.length > 0 && 
          newData.experiences.some(exp => exp.title?.trim() && exp.description?.trim())) {
        completedSteps.push(2);
      }
      
      // Étape 3: Other Impactful complétée si réponse donnée
      if (newData.hasOtherImpactfulExperiences !== null) {
        completedSteps.push(3);
      }
      
      // Étape 4: School List complétée si au moins une école
      if (newData.schoolList?.length > 0) {
        completedSteps.push(4);
      }
      
      newData.metadata.completedSteps = completedSteps;
      return newData;
    });
  };

  // Navigation vers l'étape précédente
  const handleBack = () => {
    if (currentStep > 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 200);
    } else {
      handleBackToWizard();
    }
  };

  // Navigation vers l'étape suivante
  const handleNext = () => {
    if (currentStep < 4) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 200);
    } else {
      handleComplete();
    }
  };

  // Navigation directe vers une étape spécifique
  const goToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= 4 && stepNumber !== currentStep) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(stepNumber);
        setIsAnimating(false);
      }, 200);
    }
  };

  // Complétion du flow
  const handleComplete = () => {
    // Merger les données AMCAS avec les données principales
    const consolidatedData = {
      ...formData,
      amcasManualData: {
        ...amcasFormData,
        metadata: {
          ...amcasFormData.metadata,
          isComplete: true,
          completedAt: new Date().toISOString()
        }
      },
      importMethod: 'manual',
      profileCompleted: true
    };
    
    // Mettre à jour les données du formulaire principal
    updateFormData(consolidatedData);
    
    // Nettoyer la sauvegarde locale
    localStorage.removeItem('amcas_manual_draft');
    
    // Appeler le callback qui redirigera vers MySchoolTab
    onComplete();
  };

  // Retour vers ProfileWizard (choix de méthode)
  const handleBackToWizard = () => {
    // Sauvegarder les données avant de quitter
    const consolidatedData = {
      ...formData,
      amcasManualData: amcasFormData
    };
    updateFormData(consolidatedData);
    
    onBack();
  };

  // Rendu du contenu selon l'étape actuelle
  const renderStepContent = () => {
    // Composants temporaires en attendant l'implémentation
    const StepPlaceholder = ({ stepNumber, title, description }) => (
      <div className="manual-amcas-step-placeholder">
        <div className="placeholder-content">
          <h2 className="placeholder-title">Step {stepNumber}: {title}</h2>
          <p className="placeholder-description">{description}</p>
          <div className="placeholder-status">
            <p>⏳ This component will be available soon</p>
            <p>Continue with the following steps to complete your profile.</p>
          </div>
          <div className="placeholder-navigation">
            <button
              type="button"
              className="nav-btn nav-btn-secondary"
              onClick={handleBack}
            >
              Previous
            </button>
            <button
              type="button"
              className="nav-btn nav-btn-primary"
              onClick={handleNext}
            >
              {currentStep === 4 ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    );

    switch (currentStep) {
      case 1:
        return (
          <PersonalComments
            formData={amcasFormData}
            updateFormData={updateAmcasFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <Experiences
            formData={amcasFormData}
            updateFormData={updateAmcasFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <OtherImpactful
            formData={amcasFormData}
            updateFormData={updateAmcasFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <SchoolPicker
            formData={amcasFormData}
            updateFormData={updateAmcasFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      default:
        return (
          <div className="manual-amcas-error">
            <h2>Step not found</h2>
            <p>The requested step does not exist.</p>
          </div>
        );
    }
  };

  return (
    <div className="manual-amcas-flow">
      {/* Indicateur de progression */}
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={4}
        completedSteps={amcasFormData.metadata.completedSteps}
        onStepClick={goToStep}
      />
      
      {/* Contenu principal */}
      <div className={`manual-amcas-content ${isAnimating ? 'fade-transition' : ''}`}>
        {renderStepContent()}
      </div>
    </div>
  );
};

export default ManualAmcasFlow; 