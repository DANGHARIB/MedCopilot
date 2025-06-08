import React, { useState } from 'react';

// Import des composants du flow
import UploadAmcas from './components/Step1Upload/UploadAmcas';
import ProcessingModal from './components/ProcessingModal/ProcessingModal';

// Import du CSS principal
import './UploadAmcasFlow.css';

const UploadAmcasFlow = ({ 
  formData,           // Données du formulaire principal (ProfileWizard)
  updateFormData,     // Function pour mettre à jour les données principales
  onComplete,         // Callback quand le flow est terminé
  onBack             // Callback pour retourner au choix de méthode
}) => {
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Fonction pour démarrer le processing AMCAS
  const handleStartProcessing = (file) => {
    setUploadedFile(file);
    setShowProcessingModal(true);
    
    // Mettre à jour les données avec le fichier
    updateFormData({
      amcasFile: file,
      extractedData: null // Sera rempli après le processing
    });
  };

  // Fonction pour gérer la completion du processing
  const handleProcessingComplete = () => {
    // Simuler l'extraction des données (en réalité, ceci viendrait du backend)
    const mockExtractedData = {
      personalStatement: {
        text: "Sample extracted personal statement content...",
        wordCount: 450,
        charCount: 2800,
        lastModified: new Date().toISOString()
      },
      experiences: [
        {
          id: 1,
          title: "Research Assistant",
          organization: "University Medical Center",
          description: "Conducted research on cardiovascular diseases...",
          type: "Research",
          startDate: "2022-06-01",
          endDate: "2023-05-01",
          isMeaningful: true
        }
      ],
      academicInfo: {
        gpa: 3.8,
        mcatScore: 515,
        graduationDate: "2023-05-15"
      }
    };

    // Mettre à jour les données avec les informations extraites
    const consolidatedData = {
      ...formData,
      extractedData: mockExtractedData,
      importMethod: 'amcas',
      profileCompleted: true
    };
    
    updateFormData(consolidatedData);
    
    // Fermer le modal et compléter le flow
    setShowProcessingModal(false);
    onComplete();
  };

  return (
    <div className="upload-amcas-flow">
      {/* Étape d'upload */}
      <UploadAmcas
        formData={formData}
        updateFormData={updateFormData}
        onNext={handleProcessingComplete}
        onBack={onBack}
        onStartProcessing={handleStartProcessing}
      />
      
      {/* Modal de processing */}
      {showProcessingModal && (
        <ProcessingModal 
          file={uploadedFile}
          onComplete={handleProcessingComplete}
        />
      )}
    </div>
  );
};

export default UploadAmcasFlow; 