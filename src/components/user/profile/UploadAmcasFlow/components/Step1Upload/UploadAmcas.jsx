import React, { useState, useRef } from 'react';
import { Upload, FileUp, XCircle, File, ArrowLeft, ArrowRight, Sparkles, Shield, Zap, Clock } from 'lucide-react';
import './UploadAmcas.css';

const UploadAmcas = ({ formData, updateFormData, onNext, onBack, onStartProcessing }) => {
  const [file, setFile] = useState(formData?.amcasFile || null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showTips, setShowTips] = useState(false);
  const fileInputRef = useRef(null);

  // Gérer le glisser-déposer
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  // Valider et définir le fichier
  const handleFileSelect = (selectedFile) => {
    setUploadError('');
    
    if (!selectedFile) {
      return;
    }

    // Vérifier que c'est un PDF
    if (selectedFile.type !== 'application/pdf') {
      setUploadError('Please upload a PDF file');
      return;
    }

    // Vérifier la taille du fichier (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit');
      return;
    }

    setFile(selectedFile);
    updateFormData({ amcasFile: selectedFile });
  };

  // Gérer le clic sur le bouton "Browse files"
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  // Gérer le changement du champ de fichier
  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files[0]);
  };

  // Supprimer le fichier sélectionné
  const handleRemoveFile = () => {
    setFile(null);
    updateFormData({ amcasFile: null });
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Passer à l'étape suivante (déclencher le processing)
  const handleContinue = () => {
    if (file) {
      // Déclencher le processing
      if (onStartProcessing) {
        onStartProcessing(file);
      } else {
        onNext();
      }
    } else {
      setUploadError('Please upload your AMCAS PDF file to continue');
    }
  };

  return (
    <div className="upload-amcas-step">
      <div className="upload-amcas-container">
        {/* Header */}
        <div className="upload-amcas-header">
          <div className="header-main-row">
            <div className="header-text-group">
              <div className="header-title">
                Upload Your{" "}
                <span className="header-title-highlight">AMCAS PDF</span>
              </div>
              <p className="header-subtitle">
                Upload your PDF to automatically extract your Personal Statement, Experiences <br/> and Academic Information.
              </p>
            </div>
            
            <button 
              className="help-toggle"
              onClick={() => setShowTips(!showTips)}
              aria-label="Show upload tips"
            >
              <Sparkles className="help-toggle-icon" />
              <span>Upload Tips</span>
            </button>
          </div>

          {/* Panel de conseils */}
          {showTips && (
            <div className="help-panel">
              <div className="help-content">
                <h3 className="help-title">Upload Guidelines</h3>
                <div className="help-tips">
                  <div className="tip">
                    <Shield className="tip-icon" />
                    <span>Your data is secure and encrypted</span>
                  </div>
                  <div className="tip">
                    <Zap className="tip-icon" />
                    <span>Automatic extraction of key information</span>
                  </div>
                  <div className="tip">
                    <Clock className="tip-icon" />
                    <span>Fast and efficient process</span>
                  </div>
                  <div className="tip">
                    <File className="tip-icon" />
                    <span>Only PDF files accepted (max 10MB)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="upload-amcas-body">
          <div 
            className={`upload-amcas-dropzone ${isDragging ? 'dragging' : ''} ${uploadError ? 'error' : ''} ${file ? 'success' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={!file ? handleBrowseClick : undefined}
            tabIndex={!file ? 0 : -1}
            role={!file ? "button" : "presentation"}
            aria-label={!file ? "Click to select AMCAS PDF file or drag and drop here" : undefined}
            onKeyDown={!file ? (e) => e.key === 'Enter' && handleBrowseClick() : undefined}
          >
            <div className="upload-amcas-content">
              {!file ? (
                <>
                  <div className="upload-amcas-main-content">
                    <div className="upload-amcas-icon">
                      <Upload size={56} />
                    </div>
                    
                    <div className="upload-amcas-text-content">
                      <h3 className="upload-amcas-dropzone-title">
                        Upload your AMCAS PDF
                      </h3>
                      <p className="upload-amcas-dropzone-info">
                        Drag and drop or click to browse (max 10MB)
                      </p>
                    </div>
                  </div>
                  
                  {uploadError && (
                    <div className="upload-amcas-error">
                      <XCircle size={16} />
                      <span>{uploadError}</span>
                    </div>
                  )}
                  
                  <button 
                    type="button" 
                    className="upload-amcas-browse-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBrowseClick();
                    }}
                  >
                    <FileUp size={18} />
                    <span>Browse files</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="upload-amcas-icon success">
                    <File size={56} />
                  </div>
                  
                  <h3 className="upload-amcas-dropzone-title">
                    File uploaded successfully
                  </h3>
                  
                  <div className="upload-amcas-file-info">
                    <div className="file-details">
                      <strong>{file.name}</strong>
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                  
                  <button 
                    type="button" 
                    className="upload-amcas-remove-button"
                    onClick={handleRemoveFile}
                  >
                    <XCircle size={18} />
                    <span>Remove file</span>
                  </button>
                </>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                className="upload-amcas-file-input"
                accept="application/pdf"
                onChange={handleFileInputChange}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="upload-amcas-navigation">
          <div className="nav-progress">
            {file && (
              <div className="success-indicator">
                <File size={16} />
                <span>File ready for extraction</span>
              </div>
            )}
          </div>

          <div className="nav-actions">
            <button
              type="button"
              className="nav-btn nav-btn-secondary"
              onClick={onBack}
              aria-label="Go back to previous step"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
            
            <button
              type="button"
              className={`nav-btn nav-btn-primary ${!file ? 'disabled' : ''}`}
              onClick={handleContinue}
              disabled={!file}
              aria-label="Start processing your AMCAS file"
            >
              <span>Start Processing</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAmcas; 