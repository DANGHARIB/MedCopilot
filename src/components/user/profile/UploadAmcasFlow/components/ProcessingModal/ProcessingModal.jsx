import React, { useState, useEffect } from 'react';
import { CheckCircle, FileText, Award, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProcessingModal.css';

const ProcessingModal = ({ file, onComplete }) => {
  const [processingStage, setProcessingStage] = useState('uploading'); // uploading, processing, extracting, complete
  const [extractedData, setExtractedData] = useState({
    personalStatement: false,
    experiences: false,
    academicInfo: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!file) return;

    const stages = [
      { stage: 'uploading', duration: 1500 },
      { stage: 'processing', duration: 2000 },
      { stage: 'extracting', duration: 2500 },
      { stage: 'complete', duration: 0 }
    ];

    let currentStageIndex = 0;

    const processNextStage = () => {
      if (currentStageIndex < stages.length) {
        const currentStage = stages[currentStageIndex];
        setProcessingStage(currentStage.stage);

        // Simuler l'extraction progressive des données
        if (currentStage.stage === 'extracting') {
          setTimeout(() => setExtractedData(prev => ({ ...prev, personalStatement: true })), 500);
          setTimeout(() => setExtractedData(prev => ({ ...prev, experiences: true })), 1200);
          setTimeout(() => setExtractedData(prev => ({ ...prev, academicInfo: true })), 1800);
        }

        if (currentStage.duration > 0) {
          setTimeout(() => {
            currentStageIndex++;
            processNextStage();
          }, currentStage.duration);
        }
      }
    };

    processNextStage();
  }, [file]);

  const handleGoToProfile = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigate('/profile/information');
    }
  };

  const getStageInfo = () => {
    switch (processingStage) {
      case 'uploading':
        return {
          title: 'Uploading your AMCAS PDF',
          description: 'Securely uploading your document...',
          icon: <Loader2 className="processing-spinner" size={48} />
        };
      case 'processing':
        return {
          title: 'Processing document',
          description: 'Analyzing your AMCAS application structure...',
          icon: <Loader2 className="processing-spinner" size={48} />
        };
      case 'extracting':
        return {
          title: 'Extracting information',
          description: 'Identifying and extracting key sections...',
          icon: <Loader2 className="processing-spinner" size={48} />
        };
      case 'complete':
        return {
          title: 'Extraction complete!',
          description: 'Your AMCAS information has been successfully processed and is now available in your profile.',
          icon: <CheckCircle className="success-icon" size={48} />
        };
      default:
        return {
          title: '',
          description: '',
          icon: null
        };
    }
  };

  const stageInfo = getStageInfo();

  return (
    <div className="processing-modal-overlay">
      <div className="processing-modal">
        <div className="processing-content">
          {/* Header avec icône */}
          <div className="processing-header">
            <div className="processing-icon-container">
              {stageInfo.icon}
            </div>
            <h2 className="processing-title">{stageInfo.title}</h2>
            <p className="processing-description">{stageInfo.description}</p>
          </div>

          {/* Barre de progression */}
          <div className="processing-progress">
            <div className="progress-bar">
              <div 
                className={`progress-fill ${processingStage}`}
                style={{
                  width: processingStage === 'uploading' ? '25%' :
                         processingStage === 'processing' ? '50%' :
                         processingStage === 'extracting' ? '75%' :
                         processingStage === 'complete' ? '100%' : '0%'
                }}
              />
            </div>
          </div>

          {/* Étapes d'extraction (visible pendant extracting et complete) */}
          {(processingStage === 'extracting' || processingStage === 'complete') && (
            <div className="extraction-steps">
              <div className={`extraction-item ${extractedData.personalStatement ? 'completed' : ''}`}>
                <div className="extraction-icon">
                  {extractedData.personalStatement ? <CheckCircle size={20} /> : <FileText size={20} />}
                </div>
                <span>Personal Statement</span>
              </div>
              <div className={`extraction-item ${extractedData.experiences ? 'completed' : ''}`}>
                <div className="extraction-icon">
                  {extractedData.experiences ? <CheckCircle size={20} /> : <Award size={20} />}
                </div>
                <span>Experiences & Activities</span>
              </div>
              <div className={`extraction-item ${extractedData.academicInfo ? 'completed' : ''}`}>
                <div className="extraction-icon">
                  {extractedData.academicInfo ? <CheckCircle size={20} /> : <GraduationCap size={20} />}
                </div>
                <span>Academic Information</span>
              </div>
            </div>
          )}

          {/* Actions (visible uniquement quand complete) */}
          {processingStage === 'complete' && (
            <div className="processing-actions">
              <div className="success-message">
                <CheckCircle size={24} className="success-check" />
                <div>
                  <h3>Ready to review</h3>
                  <p>You can now view and edit your extracted information in your profile.</p>
                </div>
              </div>
              
              <button 
                className="btn-go-to-profile"
                onClick={handleGoToProfile}
              >
                <span>Go to Profile</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingModal; 