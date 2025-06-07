import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Copy, 
  Download, 
  Share2, 
  FileText, 
  CheckCircle 
} from 'lucide-react';
import './EssayHeader.css';

/**
 * Header component for SchoolEssaySingle
 * Displays navigation, title, status, and action buttons
 */
const EssayHeader = ({ 
  essay, 
  school, 
  version, 
  onBack, 
  onCopy, 
  onDownload, 
  onShare,
  inFocusMode
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Listen for scroll to add shadow on header when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Determine status based on version
  const getStatusInfo = () => {
    if (!version) {
      return {
        label: 'Not Generated',
        color: 'warning',
        icon: <FileText size={14} />
      };
    }
    
    return {
      label: 'Generated',
      color: 'success',
      icon: <CheckCircle size={14} />
    };
  };
  
  const status = getStatusInfo();
  
  // Format the limit text based on the essay configuration
  const formatLimitText = () => {
    if (!essay) return '';
    
    const type = essay.limitType || 'words';
    const limit = type === 'words' 
      ? essay.wordLimit || 500 
      : essay.characterLimit || 2500;
    
    return `${limit} ${type}`;
  };
  
  // Only show minimal header in focus mode
  if (inFocusMode) {
    return (
      <header className={`ses-essay-header-focus ${isScrolled ? 'ses-scrolled' : ''}`}>
        <button 
          className="ses-essay-header-back-button"
          onClick={onBack}
          aria-label="Back to essay list"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="ses-essay-header-title-minimal">
          {essay?.subject || 'Essay'}
        </h1>
      </header>
    );
  }
  
  return (
    <header className={`ses-essay-header ${isScrolled ? 'ses-scrolled' : ''}`}>
      <div className="ses-essay-header-container">
        {/* Left section: Navigation and title */}
        <div className="ses-essay-header-left">
          <div className="ses-essay-breadcrumbs">
            <button 
              className="ses-essay-back-button"
              onClick={onBack}
              aria-label="Back to essay list"
            >
              <ChevronLeft size={16} />
              <span>Back to Essays</span>
            </button>
            
            <div className="ses-essay-breadcrumbs-path">
              <span className="ses-breadcrumb-item">Schools</span>
              <span className="ses-breadcrumb-separator">/</span>
              <span className="ses-breadcrumb-item">{school?.name || 'School'}</span>
              <span className="ses-breadcrumb-separator">/</span>
              <span className="ses-breadcrumb-item">Essays</span>
              <span className="ses-breadcrumb-separator">/</span>
              <span className="ses-breadcrumb-item ses-current">{essay?.subject || 'Essay'}</span>
            </div>
          </div>
          
          <div className="ses-essay-header-title-container">
            <div className="ses-essay-header-icon">
              <FileText size={24} />
            </div>
            <div className="ses-essay-header-text">
              <h1 className="ses-essay-title">{essay?.subject || 'Essay'}</h1>
              <div className="ses-essay-header-meta">
                <div className={`ses-essay-status-badge ses-status-${status.color}`}>
                  {status.icon}
                  <span>{status.label}</span>
                </div>
                <div className="ses-essay-limit-badge">
                  <span>{formatLimitText()}</span>
                </div>
                {version?.date && (
                  <div className="ses-essay-date-badge">
                    <span>Updated {new Date(version.date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right section: Action buttons */}
        <div className="ses-essay-header-actions">
          <button 
            className="ses-essay-action-button"
            onClick={onCopy}
            aria-label="Copy essay to clipboard"
            title="Copy to clipboard"
          >
            <Copy size={18} />
          </button>
          
          <button 
            className="ses-essay-action-button"
            onClick={onDownload}
            aria-label="Download essay as PDF"
            title="Download as PDF"
          >
            <Download size={18} />
          </button>
          
          <button 
            className="ses-essay-action-button"
            onClick={onShare}
            aria-label="Share essay"
            title="Share"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default EssayHeader; 