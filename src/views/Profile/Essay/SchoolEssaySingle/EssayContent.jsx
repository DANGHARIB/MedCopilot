import React, { useState, useRef, useEffect } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Clock,
  Type
} from 'lucide-react';
import './EssayContent.css';

/**
 * Content component for displaying essay text and information
 */
const EssayContent = ({ 
  essay, 
  version, 
  school, 
  inFocusMode, 
  onToggleFocus 
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const contentRef = useRef(null);
  
  // Calculate word and character count
  useEffect(() => {
    if (version?.content) {
      const text = version.content;
      // Word count: split by whitespace and filter empty strings
      const words = text.split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      
      // Character count: just length of the string
      setCharacterCount(text.length);
    } else {
      setWordCount(0);
      setCharacterCount(0);
    }
  }, [version]);
  
  // Get paragraphs from essay content
  const getParagraphs = () => {
    if (!version?.content) {
      return [];
    }
    
    return version.content.split(/\n\n+/).filter(p => p.trim() !== '');
  };
  
  // Determine if we're counting words or characters based on essay config
  const isCountingCharacters = essay?.limitType === 'characters';
  
  // Get the appropriate limit based on the essay configuration
  const getLimit = () => {
    if (!essay) return 500;
    
    return isCountingCharacters 
      ? (essay.characterLimit || 2500) 
      : (essay.wordLimit || 500);
  };
  
  // Get current count (either words or characters)
  const getCurrentCount = () => {
    return isCountingCharacters ? characterCount : wordCount;
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not yet generated';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // If no essay version yet, display placeholder
  if (!version) {
    return (
      <div className="ses-essay-content-container">
        <div className="ses-essay-content-card ses-no-content">
          <div className="ses-no-content-icon">
            <FileText size={48} />
          </div>
          <h2>No Essay Generated Yet</h2>
          <p>Use the "Generate Essay" button to create your first version.</p>
        </div>
      </div>
    );
  }
  
  const paragraphs = getParagraphs();
  
  return (
    <div className="ses-essay-content-container">
      <div className="ses-essay-content-card">
        <div className="ses-essay-content-header">
          <div className="ses-essay-content-title-container">
            <h2 className="ses-essay-content-title">
              Current Version
              <span className="ses-version-badge">v{version.id || 1}</span>
            </h2>
            
            <div className="ses-essay-content-meta">
              <div className="ses-essay-word-counter">
                <Type size={14} />
                <span>{getCurrentCount()}</span>
                <span className="ses-counter-separator">/</span>
                <span>{getLimit()}</span>
                <span className="ses-counter-type">
                  {isCountingCharacters ? 'characters' : 'words'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="ses-essay-content-actions">
            <button 
              className="ses-essay-toggle-info-button"
              onClick={() => setShowInfo(!showInfo)}
              aria-label={showInfo ? 'Hide essay information' : 'Show essay information'}
            >
              {showInfo ? 'Hide details' : 'Show details'}
              {showInfo ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            
            <button 
              className="ses-essay-focus-button"
              onClick={onToggleFocus}
              aria-label={inFocusMode ? 'Exit focus mode' : 'Enter focus mode'}
              title={inFocusMode ? 'Exit focus mode' : 'Enter focus mode'}
            >
              {inFocusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>
        
        {/* Collapsible information panel */}
        {showInfo && (
          <div className="ses-essay-info-panel">
            <div className="ses-essay-info-section">
              <h3 className="ses-essay-info-title">Prompt</h3>
              <p className="ses-essay-info-text ses-prompt">
                {essay?.subject || 'No prompt available'}
              </p>
            </div>
            
            <div className="ses-essay-info-grid">
              <div className="ses-essay-info-item">
                <h4 className="ses-essay-info-label">School</h4>
                <p className="ses-essay-info-value">{school?.name || 'Medical School'}</p>
              </div>
              
              <div className="ses-essay-info-item">
                <h4 className="ses-essay-info-label">Generated on</h4>
                <p className="ses-essay-info-value">{formatDate(version?.date)}</p>
              </div>
              
              <div className="ses-essay-info-item">
                <h4 className="ses-essay-info-label">Tone</h4>
                <p className="ses-essay-info-value">{essay?.tone === 'professional' ? 'Professional' : 'Conversational'}</p>
              </div>
              
              <div className="ses-essay-info-item">
                <h4 className="ses-essay-info-label">Style</h4>
                <p className="ses-essay-info-value">{essay?.style === 'narrative' ? 'Narrative' : 'Analytical'}</p>
              </div>
            </div>
            
            {essay?.context && (
              <div className="ses-essay-info-section">
                <h3 className="ses-essay-info-title">Additional Context</h3>
                <p className="ses-essay-info-text ses-context">
                  {essay.context}
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Essay content */}
        <div className="ses-essay-content-text" ref={contentRef}>
          {paragraphs.map((paragraph, index) => (
            <p key={`paragraph-${index}`} className="ses-essay-paragraph">
              {paragraph}
            </p>
          ))}
        </div>
        
        {/* Footer */}
        <div className="ses-essay-content-footer">
          <div className="ses-essay-generated-info">
            <Clock size={14} />
            <span>Generated on {formatDate(version?.date)}</span>
          </div>
          
          <div className="ses-essay-style-info">
            <span className="ses-essay-style-tag">
              {essay?.tone === 'professional' ? 'Professional' : 'Conversational'}
            </span>
            <span className="ses-essay-style-tag">
              {essay?.style === 'narrative' ? 'Narrative' : 'Analytical'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Word counter visible in focus mode */}
      {inFocusMode && (
        <div className="ses-focus-mode-counter">
          <Type size={14} />
          <span>
            {getCurrentCount()}
            <span className="ses-focus-counter-separator">/</span>
            {getLimit()}
          </span>
          <span className="ses-focus-counter-type">
            {isCountingCharacters ? 'characters' : 'words'}
          </span>
        </div>
      )}
      
      {/* Exit button visible in focus mode */}
      {inFocusMode && (
        <button 
          className="ses-focus-mode-exit-button"
          onClick={onToggleFocus}
          aria-label="Exit focus mode"
        >
          <Minimize2 size={20} />
        </button>
      )}
    </div>
  );
};

export default EssayContent; 