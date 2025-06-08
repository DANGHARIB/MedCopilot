import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ArrowLeft, ArrowRight, Download, Copy, School, FileText, Settings, Edit, CheckCircle } from "lucide-react";
import UserLayout from "../../../components/user/layout/UserLayout";
import "./EssayGenerator.css";
// Import commenté car nous n'utilisons plus EssayStep1 dans le nouveau flux
// import EssayStep1 from "../../../components/user/essayFlow/EssayStep1";
import EssayStep2 from "../../../components/user/essayFlow/EssayStep2";
import EssayStep3 from "../../../components/user/essayFlow/EssayStep3";
import EssayStep4 from "../../../components/user/essayFlow/EssayStep4";
import EditedEssayInterface from "../../../components/user/essayFlow/EditedEssayInterface";
import { generateMockEssay, reviseMockEssay } from "../../../services/mockEssayService/essayProvider";

/**
 * Essay generation component with a modern and clean user interface
 * Now skips Step 1 (Configuration) as this is done in SchoolOnboarding
 * New flow:
 * 1. Preview Generated Essay (formerly Step 2)
 * 2. Revision Essay Interface (formerly Step 3)
 * 3. Save Essay and Export and Share (formerly Step 4)
 */
const EssayGenerator = () => {
  const navigate = useNavigate();
  // Commencer directement à l'étape 2 (qui devient l'étape 1 dans le nouveau flux)
  const [currentStep, setCurrentStep] = useState(1);
  const [school, setSchool] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  // Ajuster le nombre total d'étapes car nous sautons l'étape 1
  const totalSteps = 3;
  
  // États pour EditedEssayInterface
  const [showEditedEssayInterface, setShowEditedEssayInterface] = useState(false);
  const [essayForEditingOriginal, setEssayForEditingOriginal] = useState("");
  const [essayForEditingRevised, setEssayForEditingRevised] = useState("");
  const [currentRevisionNotesForInterface, setCurrentRevisionNotesForInterface] = useState([]);
  
  const [essayData, setEssayData] = useState({
    prompt: "",
    selectedPrompt: "",
    wordLimit: 500,
    characterLimit: 2500,
    limitType: "words", // Ajout explicite du limitType
    schoolMission: "",
    tone: "professional",
    style: "narrative",
    generatedEssay: "",
    revisionInstructions: "",
    revisedEssay: "",
    revisionHistory: []
  });

  // Load school and essay data from localStorage
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Charger les données de l'école
        const storedSchool = localStorage.getItem("selectedSchoolForEssay");
        
        if (!storedSchool) {
          navigate("/schools");
          return;
        }
        
        const parsedSchool = JSON.parse(storedSchool);
        setSchool(parsedSchool);
        
        // Charger les données de l'essai configuré
        const storedEssay = localStorage.getItem("selectedEssayConfig");
        
        if (!storedEssay) {
          navigate("/schools");
          return;
        }
        
        const parsedEssay = JSON.parse(storedEssay);
        console.log("Loaded essay config:", parsedEssay); // Debug log

        // S'assurer que les valeurs limitType, wordLimit et characterLimit sont correctement définies
        const limitType = parsedEssay.limitType || "words";
        const wordLimit = limitType === "words" ? (parsedEssay.wordLimit || 500) : 500;
        const characterLimit = limitType === "characters" ? (parsedEssay.characterLimit || 2500) : 2500;
        
        // Mise à jour de l'état avec les données de l'essai
        setEssayData(prev => ({
          ...prev,
          prompt: parsedEssay.subject || "",
          selectedPrompt: parsedEssay.subject || "",
          limitType: limitType, // Définir explicitement le type de limite
          wordLimit: wordLimit,
          characterLimit: characterLimit,
          schoolMission: parsedSchool?.missionFocus || 
            "To create and nurture a diverse community of the best people committed to leadership in alleviating human suffering caused by disease.",
          tone: parsedEssay.tone || "professional",
          style: parsedEssay.style || "narrative",
          context: parsedEssay.context || "",
          category: parsedEssay.category || "other"
        }));
        
        // Générer immédiatement l'essai puisque nous sautons l'étape 1
        generateInitialEssay({
          prompt: parsedEssay.subject || "",
          limitType: limitType, // Inclure le type de limite pour la génération
          wordLimit: wordLimit,
          characterLimit: characterLimit,
          tone: parsedEssay.tone || "professional",
          style: parsedEssay.style || "narrative",
          context: parsedEssay.context || "",
          category: parsedEssay.category || "other",
          schoolMission: parsedSchool?.missionFocus || 
            "To create and nurture a diverse community of the best people committed to leadership in alleviating human suffering caused by disease."
        });
      } catch (error) {
        console.error("Failed to load data:", error);
        navigate("/schools");
      }
    };

    loadData();
  }, [navigate]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Handle changes in essay data
  const handleEssayDataChange = (newData) => {
    setEssayData(prev => ({ ...prev, ...newData }));
  };

  // Step navigation with animation
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      handleComplete();
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    } else {
      navigate("/schools");
    }
  };

  const handleClose = () => navigate("/schools");

  // Generate initial essay - appelé automatiquement au chargement
  const generateInitialEssay = (configData) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const mockEssayV1 = generateMockEssay(configData);
      setEssayData(prev => ({
        ...prev,
        generatedEssay: mockEssayV1,
        revisionHistory: [{
          version: 1,
          date: new Date().toISOString(),
          content: mockEssayV1,
          instructions: "Initial generation"
        }]
      }));
      setIsLoading(false);
    }, 1500);
  };

  // Cette fonction n'est plus nécessaire car la génération est automatique
  // Mais on la conserve commentée au cas où
  /*
  const handleGenerateEssay = () => {
    console.log("Generating essay with data:", essayData);
    setIsLoading(true);
    
    setTimeout(() => {
      const mockEssayV1 = generateMockEssay(essayData);
      setEssayData(prev => ({
        ...prev,
        generatedEssay: mockEssayV1,
        revisionHistory: [{
          version: 1,
          date: new Date().toISOString(),
          content: mockEssayV1,
          instructions: "Initial generation"
        }]
      }));
      goToNextStep();
      setIsLoading(false);
    }, 1500);
  };
  */

  // Request essay revision
  const handleRequestRevision = () => {
    goToNextStep();
  };

  // Handle saving essay (skip to step 3 - était anciennement step 4)
  const handleSaveEssay = () => {
    // Set original essay as revised essay
    setEssayData(prev => ({
      ...prev,
      revisedEssay: prev.generatedEssay
    }));
    
    // Go directly to final step
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(3);
      setIsAnimating(false);
    }, 300);
  };

  // Submit revision request
  const handleSubmitRevision = (revisionInstructionsText, allRevisionNotes) => {
    setIsLoading(true);
    
    const baseEssayForRevision = essayData.revisedEssay || essayData.generatedEssay;

    setTimeout(() => {
      const candidateRevisedEssay = reviseMockEssay(baseEssayForRevision, allRevisionNotes, essayData);
      
      setEssayForEditingOriginal(baseEssayForRevision);
      setEssayForEditingRevised(candidateRevisedEssay);
      setCurrentRevisionNotesForInterface(allRevisionNotes || []);
      
      setEssayData(prev => ({
        ...prev,
        revisionInstructions: revisionInstructionsText, 
      }));
      
      setShowEditedEssayInterface(true);
      setIsLoading(false);
    }, 1500); 
  };

  // Appelée lorsque l'utilisateur accepte les révisions depuis EditedEssayInterface
  const handleAcceptEditedEssay = () => {
    // Pour l'instant, nous utilisons essayForEditingRevised de l'état de EssayGenerator.
    // Si EditedEssayInterface modifie l'essai, il faudra passer l'essai modifié ici.
    
    setEssayData(prev => ({
      ...prev,
      revisedEssay: essayForEditingRevised, // Mettre à jour l'essai révisé final
      revisionHistory: [...prev.revisionHistory, {
        version: prev.revisionHistory.length + 1,
        date: new Date().toISOString(),
        content: essayForEditingRevised, // Utiliser l'essai qui a été montré et accepté
        instructions: prev.revisionInstructions // Les instructions qui ont mené à cet essai
      }]
    }));
    
    setShowEditedEssayInterface(false);
    goToNextStep(); // Aller à l'étape finale
  };

  // Appelée si l'utilisateur veut continuer à réviser depuis EditedEssayInterface
  const handleReturnToEditStep = () => {
    setShowEditedEssayInterface(false);
    // currentStep reste à l'étape de révision
  };

  // When the setup is complete
  const handleComplete = () => {
    setIsSetupComplete(true);
    // Navigation could be handled here
  };

  // Actions for generated essay
  const handleCopyToClipboard = () => {
    const textToCopy = currentStep === 3 ? essayData.revisedEssay : essayData.generatedEssay;
    navigator.clipboard.writeText(textToCopy);
    // Add success notification here
  };

  const handleDownloadPDF = () => {
    console.log("Downloading essay as PDF");
  };

  // Step title mapping - ajusté pour le nouveau flux
  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return `Generated Essay Preview for ${school?.name || 'Medical School'}`;
      case 2: return "Request Revisions";
      case 3: return "Final Essay";
      default: return "";
    }
  };

  // Render steps
  const renderStepContent = () => {
    if (isSetupComplete) {
      return (
        <div className="essay-complete-section">
          <h3>Essay Successfully Created!</h3>
          <p>Your essay has been created and saved. You can now use it for your application.</p>
          <button 
            className="wizard-btn wizard-btn-primary" 
            onClick={handleClose}
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    // Afficher l'interface d'édition si elle est active
    if (showEditedEssayInterface) {
      return (
        <div className={`wizard-step-content ${isAnimating ? 'fade-exit-active' : 'fade-enter-active'}`}>
          <EditedEssayInterface
            originalEssay={essayForEditingOriginal}
            revisedEssay={essayForEditingRevised}
            revisionNotes={currentRevisionNotesForInterface}
            onAcceptRevisions={handleAcceptEditedEssay}
            onContinueRevision={handleReturnToEditStep}
            darkMode={false}
            school={school}
          />
        </div>
      );
    }

    switch(currentStep) {
      // Étape 1 est maintenant l'ancien Step2 (prévisualisation de l'essai généré)
      case 1:
        return (
          <div className={`wizard-step-content ${isAnimating ? 'fade-exit-active' : 'fade-enter-active'}`}>
            <EssayStep2
              essayData={essayData}
              onChange={handleEssayDataChange}
              school={school}
              onRequestRevisions={handleRequestRevision}
              onSaveEssay={handleSaveEssay}
            />
          </div>
        );
      
      // Étape 2 est maintenant l'ancien Step3 (demande de révisions)
      case 2:
        return (
          <div className={`wizard-step-content ${isAnimating ? 'fade-exit-active' : 'fade-enter-active'}`}>
            <EssayStep3
              essayData={essayData}
              onChange={handleEssayDataChange}
              school={school}
              onSubmitRevision={handleSubmitRevision}
            />
          </div>
        );
      
      // Étape 3 est maintenant l'ancien Step4 (essai final)
      case 3:
        return (
          <div className={`wizard-step-content ${isAnimating ? 'fade-exit-active' : 'fade-enter-active'}`}>
            <EssayStep4
              essayData={essayData}
              onChange={handleEssayDataChange}
              school={school}
              onCopy={handleCopyToClipboard}
              onDownload={handleDownloadPDF}
              onComplete={handleComplete}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  // Loading indicator
  if (isLoading) {
    return (
      <UserLayout>
        <div className="wizard-container">
          <div className="essay-loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </UserLayout>
    );
  }
  
  // Main wizard progress steps
  const renderMainProgressSteps = () => {
    return (
      <div className="wizard-progress" role="progressbar" aria-valuenow={currentStep} aria-valuemin="1" aria-valuemax={totalSteps}>
        {[...Array(totalSteps)].map((_, index) => (
          <div 
            key={index} 
            className={`wizard-progress-step ${index + 1 <= currentStep ? 'active' : ''}`}
          >
            <div className="wizard-step-indicator" aria-hidden="true">
              {index + 1 < currentStep ? (
                <CheckCircle className="wizard-step-number" size={18} />
              ) : (
                <span className="wizard-step-number">{index + 1}</span>
              )}
            </div>
            {index < totalSteps - 1 && (
              <div className={`wizard-step-connector ${index + 1 < currentStep ? 'active' : ''}`} aria-hidden="true"></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <UserLayout>
      <div className="wizard-container">
        <div className="wizard-header">
          <h2 className="wizard-title">{getStepTitle()}</h2>
          <p className="wizard-subtitle">
            Preview and refine your personalized essay for your medical school application
          </p>
          <button 
            className="wizard-close-button" 
            onClick={handleClose} 
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toujours afficher la barre de progression car nous commençons à l'étape 1 (ancien step 2) */}
        {!showEditedEssayInterface && renderMainProgressSteps()}

        <div className="wizard-body">
          {renderStepContent()}
        </div>

        {/* Afficher les boutons de navigation sauf pour l'interface d'édition et lorsque le processus est terminé */}
        {!isSetupComplete && !showEditedEssayInterface && (
          <div className="wizard-btn-container">
            <button 
              className="wizard-btn wizard-btn-secondary" 
              onClick={goToPreviousStep}
            >
              <ArrowLeft size={16} className="wizard-btn-icon" />
              <span>Back</span>
            </button>
            
            {/* Cette partie est vide car chaque étape a ses propres actions */}
            <div></div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default EssayGenerator;