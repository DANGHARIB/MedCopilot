import React, { useState, useRef } from 'react';
import { Upload, FileUp, XCircle, File, ArrowLeft, ArrowRight } from 'lucide-react';
import './Step2UploadAmcas.css';

const Step2UploadAmcas = ({ updateFormData, onNext, onBack }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Passer à l'étape suivante
  const handleContinue = () => {
    if (file) {
      onNext();
    } else {
      setUploadError('Please upload your AMCAS PDF file to continue');
    }
  };

  return (
    <>
      <h2 className="upload-amcas-title">Upload AMCAS application</h2>
      <p className="upload-amcas-description">
        Upload your AMCAS PDF to automatically extract your personal statement, experiences, and academic information.
        We'll help you review the extracted data in the next step.
      </p>
      
      <div 
        className={`upload-amcas-dropzone ${isDragging ? 'dragging' : ''} ${uploadError ? 'error' : ''}`}
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
              <div className="upload-amcas-icon">
                <Upload size={56} />
              </div>
              
              <h3 className="upload-amcas-dropzone-title">
                Upload your AMCAS PDF
              </h3>
              
              <p className="upload-amcas-dropzone-text">
                Drag and drop your PDF file here, or click to browse your files
              </p>
              
              <p className="upload-amcas-dropzone-info">
                Only PDF files are accepted (max 10MB)
              </p>
              
              {uploadError && (
                <p className="upload-amcas-error">
                  <XCircle size={16} style={{ marginRight: '8px' }} />
                  {uploadError}
                </p>
              )}
              
              <button 
                type="button" 
                className="upload-amcas-browse-button"
                onClick={(e) => {
                  e.stopPropagation(); // Empêcher le double déclenchement
                  handleBrowseClick();
                }}
              >
                <FileUp size={18} style={{ marginRight: '8px' }} />
                Browse files
              </button>
            </>
          ) : (
            <>
              <div className="upload-amcas-icon" style={{ color: 'var(--color-success)' }}>
                <File size={56} />
              </div>
              
              <h3 className="upload-amcas-dropzone-title">
                File uploaded successfully
              </h3>
              
              <div className="upload-amcas-file-info">
                <strong>{file.name}</strong> - {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
              
              <button 
                type="button" 
                className="upload-amcas-browse-button"
                onClick={handleRemoveFile}
                style={{ 
                  backgroundColor: 'var(--color-error-light)', 
                  color: 'var(--color-error)'
                }}
              >
                <XCircle size={18} style={{ marginRight: '8px' }} />
                Remove file
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
      
      <div className="upload-amcas-actions">
        <button
          type="button"
          className="profile-button-secondary"
          onClick={onBack}
          aria-label="Go back to previous step"
        >
          <ArrowLeft size={18} style={{ marginRight: '8px' }} />
          Back
        </button>
        <button
          type="button"
          className={`profile-button-primary ${!file ? 'button-disabled' : ''}`}
          onClick={handleContinue}
          disabled={!file}
          aria-label="Proceed to next step"
        >
          Next
          <ArrowRight size={18} style={{ marginLeft: '8px' }} />
        </button>
      </div>
    </>
  );
};

export default Step2UploadAmcas;
