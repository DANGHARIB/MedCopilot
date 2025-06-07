import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Download, 
  Copy, 
  Share2, 
  CheckCircle, 
  Clock, 
  Save,
  FileText,
  HistoryIcon,
  ChevronDown,
  ChevronRight,
  School,
  Award,
  Calendar,
  MessageSquare,
  Edit3,
  Settings,
  Book,
  Type,
  BarChart2,
  Target,
  Bookmark,
  Users,
  Mail,
  Link,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Star,
  ArrowRight,
  BookOpen,
  X,
  Lightbulb,
  Check
} from "lucide-react";
import { jsPDF } from "jspdf";
import { useNavigate } from 'react-router-dom';
import "./EssayStep4.css";

/**
 * Enhanced component for finalizing, saving and sharing the essay
 * Redesigned to match the design system used across the essay generator flow
 * Improved modal accessibility and scrolling behavior
 */
const EssayStep4 = ({ 
  essayData, 
  school = { name: 'Medical School' },
  onCopy,
  onDownload
}) => {
  // Navigation
  const navigate = useNavigate();
  
  // State management
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  // const [darkMode, setDarkMode] = useState(false);
  
  // Scroll position state for shadow effects
  const [scrolled, setScrolled] = useState(false);
  
  // Refs
  const essayContainerRef = useRef(null);
  const shareModalRef = useRef(null);
  const tipsModalRef = useRef(null);
  const previousFocusRef = useRef(null);
  
  // Custom hook for scroll lock management
  const useScrollLock = () => {
    const scrollPosition = useRef(0);
    
    const lockScroll = useCallback(() => {
      // Store current scroll position
      scrollPosition.current = window.pageYOffset || document.documentElement.scrollTop;
      
      // Calculate scrollbar width to prevent layout shift when removing scrollbar
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Apply styles to lock scroll while maintaining position
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = '100%';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }, []);
    
    const unlockScroll = useCallback(() => {
      // Restore normal behavior and scroll position
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollPosition.current);
    }, []);
    
    return { lockScroll, unlockScroll };
  };
  
  const { lockScroll, unlockScroll } = useScrollLock();
  
  // Stats & metrics calculations
  const calculateStats = () => {
    const essayText = essayData.revisedEssay || essayData.generatedEssay || "";
    const words = essayText.split(/\s+/).filter(word => word.length > 0);
    const sentences = essayText.split(/[.!?]+/).filter(sent => sent.trim().length > 0);
    const paragraphs = essayText.split(/\n\n+/).filter(para => para.trim().length > 0);
    
    return {
      wordCount: words.length,
      characterCount: essayText.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      avgWordsPerSentence: sentences.length ? Math.round((words.length / sentences.length) * 10) / 10 : 0,
      readingTime: Math.max(1, Math.round(words.length / 225)) // Based on average reading speed
    };
  };
  
  const stats = calculateStats();
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Handle scroll events for shadow effects
  useEffect(() => {
    const handleScroll = () => {
      if (essayContainerRef.current) {
        setScrolled(essayContainerRef.current.scrollTop > 10);
      }
    };
    
    const currentRef = essayContainerRef.current;
    
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
  // Fade out success notification after delay
  useEffect(() => {
    if (showSuccessNotification) {
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessNotification]);
  
  // Handle clipboard copy with visual feedback
  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle essay saving with visual feedback
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  // Handle PDF download with visual feedback
  const handleDownload = () => {
    setDownloading(true);
    
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      // Configure styling
      const fontSize = 11;
      // const lineHeight = 7;
      const margin = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - 2 * margin;
      
      // Add header
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text(school?.name || 'Medical School Essay', pageWidth / 2, margin, { align: "center" });
      
      // Add metadata
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on ${new Date().toLocaleDateString()} • ${stats.wordCount} words • ${stats.readingTime} min read`, pageWidth / 2, margin + 10, { align: "center" });
      
      // Add content
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", "normal");
      
      const essayText = essayData.revisedEssay || essayData.generatedEssay || "";
      const splitText = pdf.splitTextToSize(essayText, contentWidth);
      
      let yPosition = margin + 20;
      
      // Check if content fits on first page
      if (yPosition + (splitText.length * (fontSize * 0.35)) > pageHeight - margin) {
        const linesPerPage = Math.floor((pageHeight - margin - yPosition) / (fontSize * 0.35));
        let currentLine = 0;
        
        // First page
        pdf.text(splitText.slice(currentLine, linesPerPage), margin, yPosition);
        currentLine += linesPerPage;
        
        // Additional pages as needed
        while (currentLine < splitText.length) {
          pdf.addPage();
          pdf.text(splitText.slice(currentLine, currentLine + linesPerPage), margin, margin);
          currentLine += linesPerPage;
        }
      } else {
        pdf.text(splitText, margin, yPosition);
      }
      
      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated with MedSchool Copilot • ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      
      // Save PDF
      const schoolNameFormatted = (school?.name || 'MedicalSchool').replace(/\s+/g, '_');
      pdf.save(`${schoolNameFormatted}_Essay_${new Date().toLocaleDateString()}.pdf`);
      
      onDownload();
      
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setDownloading(false);
    }
  };
  
  // Modal management functions
  const openModal = (modalType) => {
    // Store the currently focused element
    previousFocusRef.current = document.activeElement;
    
    // Lock scroll when modal opens
    lockScroll();
    
    // Set the appropriate modal state
    if (modalType === 'share') {
      setShowShareModal(true);
    } else if (modalType === 'tips') {
      setShowTipsModal(true);
    }
  };
  
  const closeModal = (modalType) => {
    // Unlock scroll
    unlockScroll();
    
    // Restore focus to the element that was focused before opening the modal
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
    
    // Set the appropriate modal state
    if (modalType === 'share') {
      setShowShareModal(false);
    } else if (modalType === 'tips') {
      setShowTipsModal(false);
    }
  };
  
  // Toggle share modal with improved accessibility
  const handleShareClick = () => {
    openModal('share');
  };
  
  // Close share modal
  const handleCloseShareModal = () => {
    closeModal('share');
  };
  
  // Toggle tips modal with improved accessibility
  const handleTipsClick = () => {
    openModal('tips');
  };
  
  // Close tips modal
  const handleCloseTipsModal = () => {
    closeModal('tips');
  };
  
  // Handle escape key for modals
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        if (showShareModal) {
          handleCloseShareModal();
        }
        if (showTipsModal) {
          handleCloseTipsModal();
        }
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showShareModal, showTipsModal]);
  
  // Focus trap for modals
  const handleTabKey = (e, modalRef) => {
    if (!modalRef.current || e.key !== 'Tab') return;
    
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      // If Shift+Tab and focus is on first element, move to last element
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // If Tab and focus is on last element, move to first element
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  // Setup focus trap for share modal
  useEffect(() => {
    if (!showShareModal) return;
    
    const handleKeyDown = (e) => handleTabKey(e, shareModalRef);
    document.addEventListener('keydown', handleKeyDown);
    
    // Focus the first focusable element when modal opens
    if (shareModalRef.current) {
      const focusableElements = shareModalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        setTimeout(() => focusableElements[0].focus(), 50);
      }
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showShareModal]);
  
  // Setup focus trap for tips modal
  useEffect(() => {
    if (!showTipsModal) return;
    
    const handleKeyDown = (e) => handleTabKey(e, tipsModalRef);
    document.addEventListener('keydown', handleKeyDown);
    
    // Focus the first focusable element when modal opens
    if (tipsModalRef.current) {
      const focusableElements = tipsModalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        setTimeout(() => focusableElements[0].focus(), 50);
      }
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showTipsModal]);
  
  // Handle email sharing
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Essay for ${school?.name || 'Medical School'}`);
    const body = encodeURIComponent(`Here's my essay for ${school?.name || 'Medical School'}:\n\n${essayData.revisedEssay || essayData.generatedEssay}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    handleCloseShareModal();
  };
  
  // Handle mentor sharing
  const handleMentorShare = (mentorId) => {
    console.log(`Sharing essay with mentor ID: ${mentorId}`);
    handleCloseShareModal();
  };
  
  // Detect if modal content is scrollable
  const checkModalContentScrollable = (modalRef) => {
    if (!modalRef.current) return;
    
    const contentElement = modalRef.current.querySelector('.essay-modal-content');
    if (!contentElement) return;
    
    const isScrollable = contentElement.scrollHeight > contentElement.clientHeight;
    
    if (isScrollable) {
      modalRef.current.classList.add('has-scrollable-content');
    } else {
      modalRef.current.classList.remove('has-scrollable-content');
    }
  };
  
  // Check if modal content is scrollable after render
  useEffect(() => {
    if (showShareModal) {
      setTimeout(() => checkModalContentScrollable(shareModalRef), 100);
    }
    if (showTipsModal) {
      setTimeout(() => checkModalContentScrollable(tipsModalRef), 100);
    }
  }, [showShareModal, showTipsModal]);

  // Handle confirming the essay and redirecting to MySchoolTab
  const handleConfirmEssay = () => {
    setConfirming(true);
    
    try {
      // Récupérer les informations nécessaires de localStorage
      const selectedSchoolData = JSON.parse(localStorage.getItem("selectedSchoolForEssay") || '{}');
      const selectedEssayConfig = JSON.parse(localStorage.getItem("selectedEssayConfig") || '{}');
      
      if (!selectedSchoolData.id || !selectedEssayConfig.id) {
        console.error("School or essay configuration not found");
        setConfirming(false);
        return;
      }
      
      const schoolId = selectedSchoolData.id;
      const essayId = selectedEssayConfig.id;
      
      // Récupérer l'historique des essais
      const essayHistory = JSON.parse(localStorage.getItem('essayGenerationHistory') || '{}');
      
      if (!essayHistory[schoolId]) {
        essayHistory[schoolId] = {};
      }
      
      if (!essayHistory[schoolId][essayId]) {
        essayHistory[schoolId][essayId] = {};
      }
      
      // Créer une nouvelle version
      const now = new Date();
      const newVersion = {
        id: 1,
        date: now.toISOString(),
        content: essayData.revisedEssay || essayData.generatedEssay,
        instructions: "Initial generation"
      };
      
      // Mettre à jour l'historique
      essayHistory[schoolId][essayId] = {
        date: now.toISOString(),
        lastGeneratedAt: now.toISOString(),
        versions: [newVersion] // Ajouter la version pour marquer l'essai comme généré
      };
      
      // Sauvegarder dans localStorage
      localStorage.setItem('essayGenerationHistory', JSON.stringify(essayHistory));
      
      // Marquer comme confirmé
      setIsConfirmed(true);
      
      // Rediriger vers MySchoolTab après un court délai
      setTimeout(() => {
        navigate('/schools');
      }, 1000);
    } catch (error) {
      console.error("Error confirming essay:", error);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="essay-finalized-container">
      {/* Success notification (visible initially and fades out) */}
      {showSuccessNotification && (
        <div className="essay-success-notification">
          <div className="success-icon-container">
            <CheckCircle size={20} />
          </div>
          <div className="success-message-container">
            <h4>Essay successfully finalized!</h4>
            <p>Your essay is ready to use for your application to {school?.name || 'Medical School'}.</p>
          </div>
          <button 
            className="notification-close-button"
            onClick={() => setShowSuccessNotification(false)}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main content grid */}
      <div className="essay-final-grid">
        {/* Left column - Essay content only */}
        <div className="essay-main-column">
          {/* Enhanced Essay card */}
          <div className="essay-final-card" style={{ marginBottom: '1.5rem' }}>
            <div className={`essay-final-header ${scrolled ? 'scrolled' : ''}`}>
              <div className="essay-final-header-content">
                <div className="essay-final-title">
                  <School size={20} className="essay-icon" />
                  <h2>{school?.name || 'Medical School'}</h2>
                </div>
                <div className="essay-final-meta">
                  <div className="essay-final-tag success">
                    <CheckCircle size={14} />
                    <span>Finalized</span>
                  </div>
                  <div className="essay-meta-item">
                    <Type size={14} />
                    <span>{stats.wordCount} words</span>
                  </div>
                  <div className="essay-meta-item">
                    <Clock size={14} />
                    <span>{stats.readingTime} min read</span>
                  </div>
                </div>
              </div>
              
              <div className="essay-final-actions">
                <button 
                  className={`essay-action-button ${saved ? 'success' : ''}`}
                  onClick={handleSave}
                  aria-label="Save to my essays"
                >
                  {saved ? <CheckCircle size={16} /> : <Bookmark size={16} />}
                  <span>{saved ? 'Saved!' : 'Save'}</span>
                </button>
                
                <button 
                  className={`essay-action-button ${copied ? 'success' : ''}`}
                  onClick={handleCopy}
                  aria-label="Copy to clipboard"
                >
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                
                <button 
                  className={`essay-action-button ${downloading ? 'processing' : ''}`}
                  onClick={handleDownload}
                  disabled={downloading}
                  aria-label="Download as PDF"
                >
                  <Download size={16} />
                  <span>{downloading ? 'Processing...' : 'Download'}</span>
                </button>
                
                <button 
                  className="essay-action-button"
                  onClick={handleShareClick}
                  aria-label="Share essay"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
                
                <button 
                  className="essay-icon-button essay-help-button"
                  onClick={handleTipsClick}
                  aria-label="Show tips and help"
                >
                  <Lightbulb size={18} />
                </button>
              </div>
            </div>
            
            <div className="essay-final-content" ref={essayContainerRef}>
              {(essayData.revisedEssay || essayData.generatedEssay || "").split(/\n\n+/).map((paragraph, index) => (
                <p key={`paragraph-${index}`} className="essay-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
            
            <div className="essay-final-footer">
              <div className="essay-final-timestamp">
                <Calendar size={14} />
                <span>Finalized on {formatDate(new Date().toISOString())}</span>
              </div>
              
              <div className="essay-final-styleguide">
                <span className="essay-style-tag">
                  {essayData.tone === 'professional' ? 'Professional' : 'Conversational'} Tone
                </span>
                <span className="essay-style-tag">
                  {essayData.style === 'narrative' ? 'Narrative' : 'Analytical'} Style
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Metrics and history */}
        <div className="essay-sidebar-column">
          {/* Essay Metrics Card */}
          <div className="essay-sidebar-card">
            <div 
              className="essay-section-header"
              onClick={() => setShowMetrics(!showMetrics)}
            >
              <div className="section-title-container">
                <BarChart2 size={18} />
                <h3>Essay Metrics</h3>
              </div>
              <button 
                className="toggle-section-button"
                aria-label={showMetrics ? "Hide metrics" : "Show metrics"}
                aria-expanded={showMetrics}
              >
                {showMetrics ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>
            
            {showMetrics && (
              <div className="essay-metrics-grid">
                <div className="essay-metric-item">
                  <div className="metric-icon word-count">
                    <Type size={18} />
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">{stats.wordCount}</div>
                    <div className="metric-label">Words</div>
                  </div>
                </div>
                
                <div className="essay-metric-item">
                  <div className="metric-icon character-count">
                    <FileText size={18} />
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">{stats.characterCount}</div>
                    <div className="metric-label">Characters</div>
                  </div>
                </div>
                
                <div className="essay-metric-item">
                  <div className="metric-icon paragraph-count">
                    <BookOpen size={18} />
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">{stats.paragraphCount}</div>
                    <div className="metric-label">Paragraphs</div>
                  </div>
                </div>
                
                <div className="essay-metric-item">
                  <div className="metric-icon reading-time">
                    <Clock size={18} />
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">{stats.readingTime}<span className="metric-unit">min</span></div>
                    <div className="metric-label">Reading Time</div>
                  </div>
                </div>
                
                <div className="essay-metric-item full-width">
                  <div className="metric-icon sentence-average">
                    <Target size={18} />
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">{stats.avgWordsPerSentence}</div>
                    <div className="metric-label">Words per Sentence</div>
                  </div>
                  <div className="metric-gauge">
                    <div className="metric-gauge-bar">
                      <div 
                        className={`metric-gauge-fill ${
                          stats.avgWordsPerSentence < 10 ? 'low' : 
                          stats.avgWordsPerSentence > 25 ? 'high' : 'optimal'
                        }`}
                        style={{ width: `${Math.min(100, (stats.avgWordsPerSentence / 30) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="metric-gauge-labels">
                      <span>Short</span>
                      <span>Optimal</span>
                      <span>Long</span>
                    </div>
                  </div>
                </div>
                
                <div className="word-limit-indicator full-width">
                  <div className="word-limit-header">
                    <span>Word Count</span>
                    <span>{stats.wordCount} / {essayData.wordLimit || 500}</span>
                  </div>
                  <div className="word-limit-progress">
                    <div 
                      className={`word-limit-bar ${
                        stats.wordCount > (essayData.wordLimit || 500) ? 'over-limit' :
                        stats.wordCount > (essayData.wordLimit || 500) * 0.9 ? 'near-limit' : 'under-limit'
                      }`}
                      style={{ width: `${Math.min(100, (stats.wordCount / (essayData.wordLimit || 500)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* History/Revision Timeline - Moved to the sidebar */}
          <div className="essay-history-section">
            <div 
              className="essay-section-header"
              onClick={() => setShowHistory(!showHistory)}
            >
              <div className="section-title-container">
                <HistoryIcon size={18} />
                <h3>Revision History</h3>
                <div className="history-count-badge">
                  {essayData.revisionHistory?.length || 1}
                </div>
              </div>
              <button 
                className="toggle-section-button"
                aria-label={showHistory ? "Hide revision history" : "Show revision history"}
                aria-expanded={showHistory}
              >
                {showHistory ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>
            
            {showHistory && (
              <div className="revision-timeline">
                {(essayData.revisionHistory || [{
                  version: 1,
                  date: new Date().toISOString(),
                  content: essayData.generatedEssay,
                  instructions: "Initial generation"
                }]).map((revision, index, array) => (
                  <div 
                    key={`revision-${index}`} 
                    className={`revision-timeline-item ${index === array.length - 1 ? 'active' : ''}`}
                  >
                    <div className="revision-timeline-connector">
                      <div className="revision-timeline-line"></div>
                      <div className="revision-timeline-dot"></div>
                    </div>
                    
                    <div className="revision-timeline-content">
                      <div className="revision-header">
                        <div className="revision-title">
                          <span className="revision-version">Version {revision.version}</span>
                          {index === array.length - 1 && (
                            <span className="revision-current-badge">Current</span>
                          )}
                        </div>
                        <div className="revision-date">
                          <Clock size={14} />
                          <span>{formatDate(revision.date)}</span>
                        </div>
                      </div>
                      
                      <div className="revision-details">
                        <div className="revision-instructions">
                          <div className="revision-label">Instructions:</div>
                          <p>{revision.instructions || "Initial generation"}</p>
                        </div>
                        
                        {index < array.length - 1 && (
                          <button className="revision-compare-button">
                            <FileText size={14} />
                            <span>Compare with current</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Confirm button - Moved to sidebar */}
          <div className="essay-sidebar-confirm-container">
            <button 
              className={`essay-confirm-button ${isConfirmed ? 'confirmed' : ''} ${confirming ? 'confirming' : ''}`}
              onClick={handleConfirmEssay}
              disabled={isConfirmed || confirming}
              aria-label="Confirm and save essay"
            >
              {isConfirmed ? (
                <>
                  <Check size={20} />
                  <span>Confirmed</span>
                </>
              ) : confirming ? (
                <>
                  <div className="confirm-spinner"></div>
                  <span>Confirming...</span>
                </>
              ) : (
                <>
                  <Check size={20} />
                  <span>Confirm & Return to Schools</span>
                </>
              )}
            </button>
            
            {!isConfirmed && (
              <p className="essay-confirm-description">
                Clicking confirm will save this essay to your school profile and mark it as generated.
              </p>
            )}
          </div>
          
          {/* Help and resources */}
          <div className="essay-help-section">
            <HelpCircle size={14} />
            <p>Need help? <a href="#" className="essay-help-link">Contact our support team</a></p>
          </div>
        </div>
      </div>
      
      {/* Share Modal - Improved accessibility and scrolling */}
      {showShareModal && (
        <div 
          className="essay-modal-overlay" 
          onClick={handleCloseShareModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          <div 
            className="essay-modal" 
            ref={shareModalRef}
            onClick={e => e.stopPropagation()}
            tabIndex="-1"
          >
            <div className="essay-modal-header">
              <div className="essay-modal-title">
                <Share2 size={20} />
                <h2 id="share-modal-title">Share Your Essay</h2>
              </div>
              <button 
                className="essay-modal-close"
                onClick={handleCloseShareModal}
                aria-label="Close sharing options"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="essay-modal-content">
              <h3 className="share-section-title">Quick Share Options</h3>
              <div className="share-options-grid">
                <div 
                  className="share-option-item"
                  onClick={handleEmailShare}
                  tabIndex="0"
                  role="button"
                  aria-label="Share via email"
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailShare()}
                >
                  <div className="share-option-icon email">
                    <Mail size={24} />
                  </div>
                  <h4>Email</h4>
                  <p>Send via your email client</p>
                </div>
                
                <div 
                  className="share-option-item"
                  onClick={() => {
                    navigator.clipboard.writeText(`Essay for ${school?.name || 'Medical School'}: ${essayData.revisedEssay || essayData.generatedEssay}`);
                    alert('Link copied to clipboard!');
                  }}
                  tabIndex="0"
                  role="button"
                  aria-label="Copy link to clipboard"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigator.clipboard.writeText(`Essay for ${school?.name || 'Medical School'}: ${essayData.revisedEssay || essayData.generatedEssay}`);
                      alert('Link copied to clipboard!');
                    }
                  }}
                >
                  <div className="share-option-icon link">
                    <Link size={24} />
                  </div>
                  <h4>Copy Link</h4>
                  <p>Copy shareable link</p>
                </div>
                
                <div 
                  className="share-option-item"
                  onClick={handleDownload}
                  tabIndex="0"
                  role="button"
                  aria-label="Download as PDF"
                  onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
                >
                  <div className="share-option-icon download">
                    <Download size={24} />
                  </div>
                  <h4>Download</h4>
                  <p>Save as PDF file</p>
                </div>
              </div>
              
              <div className="share-divider">
                <span>OR</span>
              </div>
              
              <h3 className="share-section-title">Share with Mentors</h3>
              <div className="share-mentors-list">
                <div className="share-mentor-item">
                  <div className="mentor-avatar">JD</div>
                  <div className="mentor-info">
                    <h4 className="mentor-name">Dr. Jane Doe</h4>
                    <p className="mentor-title">Academic Advisor</p>
                  </div>
                  <button 
                    className="mentor-share-button"
                    onClick={() => handleMentorShare('mentor-1')}
                    aria-label="Share with Dr. Jane Doe"
                  >
                    Share
                  </button>
                </div>
                
                <div className="share-mentor-item">
                  <div className="mentor-avatar">JS</div>
                  <div className="mentor-info">
                    <h4 className="mentor-name">John Smith</h4>
                    <p className="mentor-title">Writing Coach</p>
                  </div>
                  <button 
                    className="mentor-share-button"
                    onClick={() => handleMentorShare('mentor-2')}
                    aria-label="Share with John Smith"
                  >
                    Share
                  </button>
                </div>
              </div>
              
              <div className="share-privacy-note">
                <AlertCircle size={16} />
                <p>Essays are shared securely and only visible to your selected recipients.</p>
              </div>
            </div>
            
            <div className="essay-modal-footer">
              <button 
                className="essay-modal-button"
                onClick={handleCloseShareModal}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Tips Modal - Improved accessibility and scrolling */}
      {showTipsModal && (
        <div 
          className="essay-modal-overlay" 
          onClick={handleCloseTipsModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tips-modal-title"
        >
          <div 
            className="essay-modal" 
            ref={tipsModalRef}
            onClick={e => e.stopPropagation()}
            tabIndex="-1"
          >
            <div className="essay-modal-header">
              <div className="essay-modal-title">
                <Lightbulb size={18} />
                <h2 id="tips-modal-title">Next Steps</h2>
              </div>
              
              <button 
                className="essay-modal-close"
                onClick={handleCloseTipsModal}
                aria-label="Close tips"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="essay-modal-content">
              <div className="essay-tip-list">
                <div className="essay-tip-item">
                  <div className="essay-tip-number">1</div>
                  <div className="essay-tip-text">
                    <strong>Final Review</strong> - Carefully proofread your essay before submitting it with your application.
                  </div>
                </div>
                
                <div className="essay-tip-item">
                  <div className="essay-tip-number">2</div>
                  <div className="essay-tip-text">
                    <strong>Get Feedback</strong> - Share your essay with trusted advisors or mentors for additional input.
                  </div>
                </div>
                
                <div className="essay-tip-item">
                  <div className="essay-tip-number">3</div>
                  <div className="essay-tip-text">
                    <strong>Submit Application</strong> - Include this polished essay with your medical school application.
                  </div>
                </div>
              </div>
              
              <div className="essay-shortcut-section">
                <h3>Additional Resources</h3>
                <div className="essay-resources-grid">
                  <div className="essay-resource-item">
                    <ExternalLink size={14} />
                    <a href="#" className="resource-link">Medical School Application Guide</a>
                  </div>
                  
                  <div className="essay-resource-item">
                    <ExternalLink size={14} />
                    <a href="#" className="resource-link">Sample Successful Essays</a>
                  </div>
                  
                  <div className="essay-resource-item">
                    <ExternalLink size={14} />
                    <a href="#" className="resource-link">Interview Preparation Tips</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="essay-modal-footer">
              <button 
                className="essay-modal-button"
                onClick={handleCloseTipsModal}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EssayStep4;