import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  CheckCircle, 
  Clock, 
  FileText,
  HistoryIcon,
  ChevronDown,
  ChevronRight,
  School,
  Calendar,
  Edit3,
  Type,
  BarChart2,
  Target,
  HelpCircle,
  ArrowRight,
  BookOpen,
  X,
  Lightbulb,
  Check,
  MessageSquare,
  Star
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import "./EssayStep4.css";

/**
 * Enhanced component for finalizing and confirming the essay
 * Redesigned to match the design system used across the essay generator flow
 */
const EssayStep4 = ({ 
  essayData, 
  school = { name: 'Medical School' }
}) => {
  // Navigation
  const navigate = useNavigate();
  
  // State management
  const [showStats, setShowStats] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showVersioningModal, setShowVersioningModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [hasUnseenVersions, setHasUnseenVersions] = useState(false);
  
  // Scroll position state for shadow effects
  const [scrolled, setScrolled] = useState(false);
  
  // Refs
  const essayContainerRef = useRef(null);
  const tipsModalRef = useRef(null);
  const versioningModalRef = useRef(null);
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
  
  // Function to center modal position
  const centerModal = useCallback((modalRef) => {
    if (!modalRef.current) return;
    
    const modal = modalRef.current;
    const rect = modal.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate center position
    const centerX = (viewportWidth - rect.width) / 2;
    const centerY = (viewportHeight - rect.height) / 2;
    
    // Ensure modal doesn't go outside viewport bounds
    const minX = 16; // 1rem padding
    const minY = 16; // 1rem padding
    const maxX = viewportWidth - rect.width - 16;
    const maxY = viewportHeight - rect.height - 16;
    
    const finalX = Math.max(minX, Math.min(centerX, maxX));
    const finalY = Math.max(minY, Math.min(centerY, maxY));
    
    // Apply positioning
    modal.style.position = 'fixed';
    modal.style.left = `${finalX}px`;
    modal.style.top = `${finalY}px`;
    modal.style.transform = 'none';
    modal.style.margin = '0';
  }, []);
  
  // Determine if we're counting characters or words based on limitType
  const isCountingCharacters = essayData?.limitType === 'characters';
  
  // Maximum count (words or characters) based on user's choice in Step 1
  const maxCount = isCountingCharacters 
    ? (essayData?.characterLimit || 2500) 
    : (essayData?.wordLimit || 500);
  
  // Label for the count (words or characters)
  const countLabel = isCountingCharacters ? "characters" : "words";

  // Calculate word count
  const countWords = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };
  
  // Calculate character count
  const countCharacters = (text) => {
    if (!text) return 0;
    return text.length;
  };

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
  
  // Update current count when essayData changes
  useEffect(() => {
    const updateCount = () => {
      const essayText = essayData?.revisedEssay || essayData?.generatedEssay || "";
      if (essayText) {
        const count = isCountingCharacters 
          ? countCharacters(essayText) 
          : countWords(essayText);
        setCurrentCount(count);
      }
    };
    
    updateCount();
  }, [essayData?.revisedEssay, essayData?.generatedEssay, isCountingCharacters, countWords, countCharacters]);

  // Animated count effect
  useEffect(() => {
    if (animatedCount !== currentCount) {
      const step = Math.ceil(Math.abs(currentCount - animatedCount) / 20);
      const timer = setTimeout(() => {
        if (animatedCount < currentCount) {
          setAnimatedCount(Math.min(animatedCount + step, currentCount));
        } else {
          setAnimatedCount(Math.max(animatedCount - step, currentCount));
        }
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [currentCount, animatedCount]);

  // Fade out success notification after delay
  useEffect(() => {
    if (showSuccessNotification) {
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessNotification]);
  
  // Modal management functions
  const openModal = (modalType) => {
    // Store the currently focused element
    previousFocusRef.current = document.activeElement;
    
    // Lock scroll when modal opens
    lockScroll();
    
    // Set the appropriate modal state
    if (modalType === 'tips') {
      setShowTipsModal(true);
    }
    if (modalType === 'versioning') {
      setShowVersioningModal(true);
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
    if (modalType === 'tips') {
      setShowTipsModal(false);
    }
    if (modalType === 'versioning') {
      setShowVersioningModal(false);
    }
  };

  // Toggle tips modal with improved accessibility
  const handleTipsClick = () => {
    openModal('tips');
  };
  
  // Close tips modal
  const handleCloseTipsModal = () => {
    closeModal('tips');
  };

  // Close versioning modal
  const handleCloseVersioningModal = () => {
    closeModal('versioning');
  };
  
  // Handle escape key for modals
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        if (showTipsModal) {
          handleCloseTipsModal();
        }
        if (showVersioningModal) {
          handleCloseVersioningModal();
        }
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showTipsModal, showVersioningModal]);
  
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

  // Setup focus trap for versioning modal
  useEffect(() => {
    if (!showVersioningModal) return;
    
    const handleKeyDown = (e) => handleTabKey(e, versioningModalRef);
    document.addEventListener('keydown', handleKeyDown);
    
    // Focus the first focusable element when modal opens
    if (versioningModalRef.current) {
      const focusableElements = versioningModalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        setTimeout(() => focusableElements[0].focus(), 50);
      }
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showVersioningModal]);
  
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
  
  // Auto-center modals when they open
  useEffect(() => {
    if (showVersioningModal && versioningModalRef.current) {
      // Small delay to ensure modal is rendered
      setTimeout(() => centerModal(versioningModalRef), 10);
    }
  }, [showVersioningModal, centerModal]);
  
  useEffect(() => {
    if (showTipsModal && tipsModalRef.current) {
      setTimeout(() => centerModal(tipsModalRef), 10);
    }
  }, [showTipsModal, centerModal]);
  
  // Handle window resize to re-center modals
  useEffect(() => {
    const handleResize = () => {
      if (showVersioningModal && versioningModalRef.current) {
        centerModal(versioningModalRef);
      }
      if (showTipsModal && tipsModalRef.current) {
        centerModal(tipsModalRef);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showVersioningModal, showTipsModal, centerModal]);

  // Check if modal content is scrollable after render
  useEffect(() => {
    if (showTipsModal) {
      setTimeout(() => checkModalContentScrollable(tipsModalRef), 100);
    }
    if (showVersioningModal) {
      setTimeout(() => checkModalContentScrollable(versioningModalRef), 100);
    }
  }, [showTipsModal, showVersioningModal]);

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
      {/* Top Navigation */}
      <header className="essay-viewer-header">
        <div className="essay-viewer-nav-left">
          <h1 className="essay-viewer-title">
            <FileText size={20} />
            <span>Your Finalized Essay</span>
          </h1>
        </div>
        
        <div className="essay-viewer-nav-right">
          <div 
            className="essay-viewer-word-count"
            onClick={() => setShowStats(!showStats)}
            aria-label="Show statistics"
            role="button"
          >
            <span className="essay-viewer-count-current">{animatedCount}</span>
            <span className="essay-viewer-count-separator">/</span>
            <span className="essay-viewer-count-limit">{maxCount}</span>
            <span className="essay-viewer-count-label">{countLabel}</span>
            <ChevronDown size={14} className="essay-viewer-count-icon" />
          </div>
          
          <button 
            className={`essay-viewer-action-button secondary ${
              (essayData.revisionHistory?.length || 1) > 1 ? 'has-versions' : ''
            }`}
            onClick={() => {
              setShowVersioningModal(true);
              setHasUnseenVersions(false);
            }}
            aria-label="View revision versions"
          >
            <HistoryIcon size={16} />
            <span>
              Versioning ({essayData.revisionHistory?.length || 1})
            </span>
            {hasUnseenVersions && (essayData.revisionHistory?.length || 1) > 1 && (
              <div className="essay-versions-badge" />
            )}
          </button>
          

          
          <button 
            className="essay-viewer-icon-button essay-viewer-help-button"
            onClick={handleTipsClick}
            aria-label="Show tips"
            title="Show tips"
          >
            <Lightbulb size={18} />
          </button>
        </div>
      </header>

      {/* Statistics Panel (Conditional) */}
      {showStats && (
        <div className="essay-viewer-stats-panel">
          <div className="essay-viewer-stats-header">
            <BarChart2 size={16} />
            <h2>Essay Statistics</h2>
            <button 
              className="essay-viewer-close-button"
              onClick={() => setShowStats(false)}
              aria-label="Close statistics"
            >
              <X size={16} />
            </button>
          </div>
          <div className="essay-viewer-stats-content">
            <div className="essay-viewer-stat-item">
              <Type size={16} />
              <div className="essay-viewer-stat-info">
                <span className="essay-viewer-stat-value">{stats.wordCount}</span>
                <span className="essay-viewer-stat-label">Words</span>
              </div>
            </div>
            <div className="essay-viewer-stat-item">
              <FileText size={16} />
              <div className="essay-viewer-stat-info">
                <span className="essay-viewer-stat-value">{stats.characterCount}</span>
                <span className="essay-viewer-stat-label">Characters</span>
              </div>
            </div>
            <div className="essay-viewer-stat-item">
              <MessageSquare size={16} />
              <div className="essay-viewer-stat-info">
                <span className="essay-viewer-stat-value">{stats.sentenceCount}</span>
                <span className="essay-viewer-stat-label">Sentences</span>
              </div>
            </div>
            <div className="essay-viewer-stat-item">
              <BookOpen size={16} />
              <div className="essay-viewer-stat-info">
                <span className="essay-viewer-stat-value">{stats.paragraphCount}</span>
                <span className="essay-viewer-stat-label">Paragraphs</span>
              </div>
            </div>
            <div className="essay-viewer-stat-item">
              <Star size={16} />
              <div className="essay-viewer-stat-info">
                <span className="essay-viewer-stat-value">{stats.avgWordsPerSentence}</span>
                <span className="essay-viewer-stat-label">Words per Sentence</span>
              </div>
            </div>
            <div className="essay-viewer-stat-item">
              <Clock size={16} />
              <div className="essay-viewer-stat-info">
                <span className="essay-viewer-stat-value">{stats.readingTime} min</span>
                <span className="essay-viewer-stat-label">Reading Time</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="essay-viewer-main">
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

        {/* Main content - Full width */}
        <div className="essay-final-content-container">
          {/* Enhanced Essay card - Full width */}
          <div className="essay-final-card">
            <div className={`essay-final-header ${scrolled ? 'scrolled' : ''}`}>
              <div className="essay-final-header-content">
                <div className="essay-final-title">
                  <School size={36} className="essay-icon" />
                  <h2>{school?.name || 'Medical School'}</h2>
                  <div className="essay-final-tag success">
                    <CheckCircle size={14} />
                    <span>Finalized</span>
                  </div>
                </div>
              </div>
              
              <div className="essay-final-actions">
                <button 
                  className={`essay-confirm-button ${isConfirmed ? 'confirmed' : ''} ${confirming ? 'confirming' : ''}`}
                  onClick={handleConfirmEssay}
                  disabled={isConfirmed || confirming}
                  aria-label="Confirm and save essay"
                >
                  {isConfirmed ? (
                    <>
                      <Check size={18} />
                      <span>Confirmed</span>
                    </>
                  ) : confirming ? (
                    <>
                      <div className="confirm-spinner"></div>
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      <span>Confirm</span>
                    </>
                  )}
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
            </div>
          </div>
        </div>
      </div>
      
      {/* Versioning Modal - Revision History */}
      {showVersioningModal && (
        <div 
          className="essay-modal-overlay" 
          onClick={handleCloseVersioningModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="versioning-modal-title"
        >
          <div 
            className="essay-versioning-modal" 
            ref={versioningModalRef}
            onClick={e => e.stopPropagation()}
            tabIndex="-1"
          >
            <div className="essay-modal-header">
              <div className="essay-modal-title">
                <HistoryIcon size={18} />
                <h2 id="versioning-modal-title">Revision History</h2>
              </div>
              
              <button 
                className="essay-modal-close"
                onClick={handleCloseVersioningModal}
                aria-label="Close versioning"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="essay-modal-content">
              <div className="essay-versioning-timeline">
                {(essayData.revisionHistory || [{
                  version: 1,
                  date: new Date().toISOString(),
                  content: essayData.generatedEssay,
                  instructions: "Initial generation"
                }]).map((revision, index, array) => (
                  <div 
                    key={`revision-${index}`} 
                    className={`essay-versioning-item ${index === array.length - 1 ? 'active' : ''}`}
                  >
                    <div className="essay-versioning-connector">
                      <div className="essay-versioning-line"></div>
                      <div className="essay-versioning-dot"></div>
                    </div>
                    
                    <div className="essay-versioning-content">
                      <div className="essay-versioning-header">
                        <div className="essay-versioning-title">
                          <span className="essay-versioning-version">Version {revision.version}</span>
                          {index === array.length - 1 && (
                            <span className="essay-versioning-current-badge">Current</span>
                          )}
                        </div>
                        <div className="essay-versioning-date">
                          <Clock size={14} />
                          <span>{formatDate(revision.date)}</span>
                        </div>
                      </div>
                      
                      <div className="essay-versioning-details">
                        <div className="essay-versioning-instructions">
                          <div className="essay-versioning-label">Instructions:</div>
                          <p>{revision.instructions || "Initial generation"}</p>
                        </div>
                        
                        <div className="essay-versioning-preview">
                          <div className="essay-versioning-label">Content Preview:</div>
                          <p className="essay-versioning-text-preview">
                            {(revision.content || "").substring(0, 200)}
                            {(revision.content || "").length > 200 ? "..." : ""}
                          </p>
                        </div>
                        
                        {index < array.length - 1 && (
                          <button className="essay-versioning-compare-button">
                            <FileText size={14} />
                            <span>Compare with current</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="essay-modal-footer">
              <button 
                className="essay-modal-button"
                onClick={handleCloseVersioningModal}
              >
                Close
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
                    <strong>Review Versions</strong> - Click the <strong>Versioning</strong> button in the header to see all revision history and track your essay's evolution.
                  </div>
                </div>
                
                <div className="essay-tip-item">
                  <div className="essay-tip-number">2</div>
                  <div className="essay-tip-text">
                    <strong>Final Review</strong> - Carefully proofread your essay before submitting it with your application.
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
                    <ArrowRight size={14} />
                    <a href="#" className="resource-link">Medical School Application Guide</a>
                  </div>
                  
                  <div className="essay-resource-item">
                    <ArrowRight size={14} />
                    <a href="#" className="resource-link">Sample Successful Essays</a>
                  </div>
                  
                  <div className="essay-resource-item">
                    <ArrowRight size={14} />
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