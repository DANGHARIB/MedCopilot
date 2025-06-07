import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Copy, 
  Download, 
  Edit3, 
  SaveAll,
  CheckCircle, 
  ThumbsUp, 
  ThumbsDown,
  Info,
  BookOpen,
  HelpCircle,
  FileText,
  MessageSquare,
  Star,
  Type,
  Clock,
  BarChart2,
  Lightbulb,
  Maximize2,
  Minimize2,
  Bookmark,
  X,
  ChevronDown,
  ChevronRight,
  Share2,
  Settings,
  Layout
} from "lucide-react";
import { jsPDF } from "jspdf";
import "./EssayStep2.css";

/**
 * Enhanced component to display the generated essay with improved UI/UX
 * Redesigned to match the design language of Step1 and Step3
 */
const EssayStep2 = ({ 
  essayData, 
  school = { name: 'Medical School' },
  onRequestRevisions,
  onSaveEssay
}) => {
  // State management
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showEssayInfo, setShowEssayInfo] = useState(false);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [paragraphs, setParagraphs] = useState([]);
  
  // Refs
  const essayContentRef = useRef(null);
  const tipsModalRef = useRef(null);
  
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
  
  // Toggle focus mode function
  const toggleFocusMode = useCallback(() => {
    const enteringFocusMode = !focusMode;
    setFocusMode(enteringFocusMode);
    
    if (enteringFocusMode) {
      // On ferme les panneaux ouverts quand on entre en mode focus
      setShowEssayInfo(false);
      setShowStats(false);
      
      // Afficher une notification temporaire
      const toast = document.createElement('div');
      toast.className = 'essay-viewer-toast';
      
      toast.innerHTML = `
        <div class="essay-viewer-toast-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </div>
        <div>
          <div class="essay-viewer-toast-title">Mode Focus activé</div>
          <div class="essay-viewer-toast-message">Appuyez sur Échap ou utilisez le bouton pour quitter</div>
        </div>
      `;
      
      document.body.appendChild(toast);
      
      // Animer l'apparition
      setTimeout(() => {
        toast.classList.add('visible');
      }, 10);
      
      // Supprimer après délai
      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    }
  }, [focusMode]);

  // Update current count when essayData changes or component mounts
  useEffect(() => {
    const updateCount = () => {
      const essayText = essayData?.generatedEssay || 
                       (essayContentRef.current ? essayContentRef.current.innerText : "");
                       
      if (essayText) {
        const count = isCountingCharacters 
          ? countCharacters(essayText) 
          : countWords(essayText);
          
        setCurrentCount(count);
      }
    };
    
    // Initial count
    updateCount();
    
    // Set up observer to recount when content might change
    const observer = new MutationObserver(updateCount);
    if (essayContentRef.current) {
      observer.observe(essayContentRef.current, { 
        characterData: true, 
        childList: true, 
        subtree: true 
      });
    }
    
    return () => observer.disconnect();
  }, [essayData?.generatedEssay, isCountingCharacters]);

  // Animated count effect
  useEffect(() => {
    if (animatedCount !== currentCount) {
      const step = Math.ceil(Math.abs(currentCount - animatedCount) / 20);
      const timer = setTimeout(() => {
        if (animatedCount < currentCount) {
          setAnimatedCount(prev => Math.min(prev + step, currentCount));
        } else if (animatedCount > currentCount) {
          setAnimatedCount(prev => Math.max(prev - step, currentCount));
        }
      }, 20);
      
      return () => clearTimeout(timer);
    }
  }, [animatedCount, currentCount]);

  // Handle copy to clipboard
  const handleCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(essayData?.generatedEssay || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [essayData?.generatedEssay]);

  // Handle PDF download
  const handleDownloadPDF = useCallback(() => {
    setDownloading(true);

    try {
      // Create a new instance of jsPDF (A4 format, portrait)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Configure text styles
      const fontSize = 12;
      const lineHeight = 7;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(fontSize);

      // Page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;

      // Add header with logo or title
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("MedSchool Copilot", pageWidth / 2, margin, { align: "center" });
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text("Generated Essay", pageWidth / 2, margin + 8, { align: "center" });

      // Starting position for content
      let yPosition = margin + 20;

      // Add essay information
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");

      // Create a section for information
      pdf.setDrawColor(67, 97, 238); // Primary color
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      
      yPosition += 6;
      pdf.text("Essay Information", margin, yPosition);
      yPosition += lineHeight;

      // Style for labels
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      
      // First column
      pdf.text("SCHOOL:", margin, yPosition);
      yPosition += 4;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      pdf.text(school?.name || 'Medical School', margin, yPosition);
      
      yPosition += 8;
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 100, 100);
      pdf.text("PROMPT:", margin, yPosition);
      yPosition += 4;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      
      // Format prompt to fit width
      const prompt = essayData?.selectedPrompt || essayData?.prompt || 'Describe a challenge or obstacle you have faced and how it has shaped your perspective on medicine and healthcare.';
      const splitPrompt = pdf.splitTextToSize(prompt, contentWidth);
      pdf.text(splitPrompt, margin, yPosition);
      
      yPosition += (splitPrompt.length * 5) + 5;
      
      // Second section - additional information
      const infoColumnWidth = (contentWidth - 10) / 3;
      
      // First info line
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 100, 100);
      
      // Display correct count type (words or characters)
      const countType = isCountingCharacters ? "CHARACTER COUNT:" : "WORD COUNT:";
      pdf.text(countType, margin, yPosition);
      pdf.text("TONE:", margin + infoColumnWidth, yPosition);
      pdf.text("STYLE:", margin + infoColumnWidth * 2, yPosition);
      
      yPosition += 4;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${currentCount}/${maxCount}`, margin, yPosition);
      pdf.text(essayData?.tone === 'professional' ? 'Professional' : 'Conversational', margin + infoColumnWidth, yPosition);
      pdf.text(essayData?.style === 'narrative' ? 'Narrative' : 'Analytical', margin + infoColumnWidth * 2, yPosition);
      
      // Add separation
      yPosition += 8;
      pdf.setDrawColor(67, 97, 238);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      
      // Prepare for essay content
      yPosition += 8;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("Essay Content", margin, yPosition);
      
      yPosition += lineHeight;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(fontSize);

      // Split the essay text into lines to avoid overflow
      const essayText = essayData?.generatedEssay || "";
      const splitText = pdf.splitTextToSize(essayText, contentWidth);

      // Check if we need a new page
      if (yPosition + (splitText.length * (fontSize * 0.35)) > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      // Add essay content
      pdf.text(splitText, margin, yPosition);

      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      const today = new Date();
      const dateStr = today.toLocaleDateString();
      pdf.text(`Generated on ${dateStr} by MedSchool Copilot`, pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Download PDF
      const schoolName = (school?.name || 'Medical School').replace(/\s+/g, '_');
      pdf.save(`Essay_${schoolName}_${dateStr}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setDownloading(false);
    }
  }, [currentCount, maxCount, isCountingCharacters, school?.name, essayData?.tone, essayData?.style, essayData?.selectedPrompt, essayData?.prompt]);

  // Handle feedback
  const handleFeedback = (type) => {
    setFeedback(type);
  };

  // Handle saving the essay (skip to step 4)
  const handleSaveEssay = () => {
    if (onSaveEssay) {
      onSaveEssay();
    }
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Quitter le mode focus avec Échap
      if (e.key === 'Escape' && focusMode) {
        e.preventDefault();
        toggleFocusMode();
        return;
      }
      
      // Toggle focus mode with Ctrl+F
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        toggleFocusMode();
      }
      
      // Copy to clipboard with Ctrl+C
      if (e.ctrlKey && e.key === 'c' && !window.getSelection().toString()) {
        e.preventDefault();
        handleCopyToClipboard();
      }
      
      // Download PDF with Ctrl+P
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        handleDownloadPDF();
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        if (showTipsModal) setShowTipsModal(false);
        if (showStats) setShowStats(false);
        if (showShareModal) setShowShareModal(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusMode, showTipsModal, showStats, showShareModal, handleCopyToClipboard, handleDownloadPDF, toggleFocusMode]);
  
  // Analyze essay and get statistics
  const getEssayStats = () => {
    const essayText = essayData?.generatedEssay || '';
    const paragraphs = essayText.split(/\n+/).filter(p => p.trim() !== "");
    const words = essayText.split(/\s+/).filter(Boolean);
    const sentences = essayText.split(/[.!?]+/).filter(Boolean);
    
    return {
      paragraphs: paragraphs.length,
      sentences: sentences.length,
      words: words.length,
      characters: essayText.length,
      avgWordsPerSentence: sentences.length ? Math.round((words.length / sentences.length) * 10) / 10 : 0,
      readingTime: Math.max(1, Math.round(words.length / 225)) // Based on average reading speed
    };
  };
  
  const essayStats = getEssayStats();
  
  // Center Modal Logic
  const centerModal = (modalRef) => {
    if (!modalRef.current) return () => {};

    const timerId = setTimeout(() => {
      if (modalRef.current) {
        const modalElement = modalRef.current;
        const modalRect = modalElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate the desired scroll position to center the modal
        const desiredScrollTop = window.scrollY + modalRect.top - (viewportHeight - modalRect.height) / 2;
        const finalScrollTop = Math.max(0, desiredScrollTop); // Prevent scrolling above the top

        // Scroll the window
        window.scrollTo({ top: finalScrollTop, behavior: 'smooth' });
      }
    }, 50); // 50ms delay

    return () => clearTimeout(timerId);
  };

  // Center the tips modal when it opens
  useEffect(() => {
    let cleanupScroll = null;
    if (showTipsModal && tipsModalRef.current) {
      cleanupScroll = centerModal(tipsModalRef);
    }
    
    return () => {
      if (cleanupScroll) {
        cleanupScroll();
      }
    };
  }, [showTipsModal]);

  // Body scroll lock for modals
  useEffect(() => {
    const hasActiveModal = showTipsModal || showShareModal;
    
    if (hasActiveModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [showTipsModal, showShareModal]);

  // Déplacer la définition de dummyEssay avant qu'elle ne soit utilisée dans useEffect
  // Le contenu de l'essai par défaut pour demo/test
  const dummyEssay = `During my sophomore year of college, I faced a significant challenge when my mother was diagnosed with an aggressive form of breast cancer. As the eldest child in a single-parent household, I suddenly found myself balancing my pre-medical studies with family responsibilities, including caring for my younger siblings and accompanying my mother to chemotherapy appointments.

The hospital became my second classroom. While sitting with my mother during her treatments, I observed the medical team's approach—not just their technical expertise, but their communication styles and bedside manner. Some physicians took the time to explain complex procedures in accessible language, addressing our concerns with patience. Others, though clinically competent, seemed detached, leaving us with unanswered questions and anxiety.

This contrast was illuminating. I realized that excellent healthcare requires both scientific knowledge and genuine human connection. When a compassionate oncology nurse taught me how to monitor my mother's post-treatment symptoms, I experienced firsthand how empowerment through education can transform a patient's family from helpless bystanders to engaged participants in the healing process.

The challenge of balancing academics with caregiving responsibilities taught me valuable lessons in time management and prioritization—all essential for a physician. I learned to use every available moment efficiently, studying between classes and during hospital waits. More importantly, I developed emotional resilience. When my mother experienced severe treatment side effects, I couldn't allow myself to collapse under stress; instead, I needed to remain calm and focused to support her.

My academic performance initially suffered, with my GPA dropping during that difficult semester. However, rather than use my circumstances as an excuse, I sought help from professors and academic resources, eventually recovering academically while maintaining my caregiving responsibilities. This experience taught me the importance of seeking support when faced with overwhelming challenges—another crucial lesson for my future in medicine.

Today, my mother is in remission, and this journey has fundamentally shaped my approach to medicine. I no longer view healthcare as simply diagnosing and treating illnesses; I see it as a partnership between medical professionals, patients, and their families. I understand that behind every medical case is a human story with emotional, social, and practical dimensions that significantly impact treatment outcomes.

This perspective has influenced my volunteer work at the student-run clinic, where I make a conscious effort to listen deeply to patients' concerns, considering their life circumstances when discussing treatment options. It has also guided my research interests toward studying how social support networks affect cancer treatment adherence and outcomes.

The obstacle I faced didn't deter me from pursuing medicine—it clarified why I want to become a physician: to provide the kind of comprehensive, compassionate care that treats the person, not just the disease. This challenge has equipped me with empathy, resilience, and perspective that textbooks alone could never teach, preparing me to be the kind of physician who recognizes that healing involves both science and humanity.`;

  // Fonction pour diviser le texte en paragraphes
  useEffect(() => {
    // Diviser l'essai en paragraphes quand essayData change
    const essayText = essayData?.generatedEssay || dummyEssay;
    const split = essayText.split(/\n+/).filter(p => p.trim() !== "");
    setParagraphs(split);
  }, [essayData?.generatedEssay]);

  return (
    <div className={`essay-viewer-container ${focusMode ? 'focus-mode' : ''}`}>
      {/* Top Navigation */}
      <header className="essay-viewer-header">
        <div className="essay-viewer-nav-left">
          <h1 className="essay-viewer-title">
            <FileText size={20} />
            <span>Your Generated Essay</span>
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
            className="essay-viewer-icon-button"
            onClick={toggleFocusMode}
            aria-label={`${focusMode ? 'Exit' : 'Enter'} focus mode`}
            title={`${focusMode ? 'Exit' : 'Enter'} focus mode`}
          >
            <Maximize2 size={18} />
          </button>
          
          <button 
            className="essay-viewer-icon-button essay-viewer-help-button"
            onClick={() => setShowTipsModal(true)}
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
                <span className="essay-viewer-stat-value">{essayStats.words}</span>
                <span className="essay-viewer-stat-label">Words</span>
              </div>
            </div>
            <div className="essay-viewer-stat-item">
              <FileText size={16} />
              <div className="essay-viewer-stat-info">
                <span className="essay-viewer-stat-value">{essayStats.characters}</span>
                <span className="essay-viewer-stat-label">Characters</span>
              </div>
            </div>
            <div className="essay-viewer-stat-item">
              <MessageSquare size={16} />
              <div className="essay-viewer-stat-info">
                <span className="essay-viewer-stat-value">{essayStats.sentences}</span>
                <span className="essay-viewer-stat-label">Sentences</span>
              </div>
            </div>
            <div className="essay-viewer-stat-item">
              <BookOpen size={16} />
              <div className="essay-viewer-stat-info">
                <span className="essay-viewer-stat-value">{essayStats.paragraphs}</span>
                <span className="essay-viewer-stat-label">Paragraphs</span>
              </div>
            </div>
            <div className="essay-viewer-stat-item">
              <Star size={16} />
              <div className="essay-viewer-stat-info">
                <span className="essay-viewer-stat-value">{essayStats.avgWordsPerSentence}</span>
                <span className="essay-viewer-stat-label">Words per Sentence</span>
              </div>
            </div>
            <div className="essay-viewer-stat-item">
              <Clock size={16} />
              <div className="essay-viewer-stat-info">
                <span className="essay-viewer-stat-value">{essayStats.readingTime} min</span>
                <span className="essay-viewer-stat-label">Reading Time</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="essay-viewer-main">
        {/* Success notification */}
        <div className="essay-viewer-notification">
          <CheckCircle size={20} />
          <div>
            <p className="essay-viewer-notification-title">Essay successfully generated!</p>
            <p className="essay-viewer-notification-message">Your essay is ready. Review it below and make any necessary adjustments.</p>
          </div>
        </div>
        
        {/* Main content grid */}
        <div className="essay-viewer-grid">
          {/* Left column - Essay content */}
          <div className="essay-viewer-content-column">
            {/* Enhanced Essay content card with integrated information */}
            <div className="essay-viewer-card essay-viewer-essay-card">
              <div className="essay-viewer-card-header">
                <div className="essay-viewer-card-icon accent">
                  <BookOpen size={20} />
                </div>
                
                <div className="essay-viewer-header-content">
                  <h2 className="essay-viewer-card-title">Essay for {school?.name || 'Medical School'}</h2>
                  <div className="essay-viewer-header-meta">
                    <span className="essay-viewer-meta-item">{essayData?.tone === 'professional' ? 'Professional' : 'Conversational'} Tone</span>
                    <span className="essay-viewer-meta-item">{essayData?.style === 'narrative' ? 'Narrative' : 'Analytical'} Style</span>
                  </div>
                </div>
                
                <button 
                  className="essay-viewer-view-details-button"
                  onClick={() => setShowEssayInfo(!showEssayInfo)}
                  aria-label={showEssayInfo ? "Hide essay details" : "View essay details"}
                >
                  {showEssayInfo ? "Hide details" : "View details"}
                  {showEssayInfo ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                
              </div>
              
              {/* Expandable Essay Information Panel */}
              {showEssayInfo && (
                <div className="essay-viewer-info-panel">
                  <div className="essay-viewer-info-grid">
                    <div className="essay-viewer-info-group">
                      <label>PROMPT</label>
                      <p>{essayData?.selectedPrompt || essayData?.prompt || 'Describe a challenge or obstacle you have faced and how it has shaped your perspective on medicine and healthcare.'}</p>
                    </div>
                    
                    <div className="essay-viewer-info-stats">
                      <div className="essay-viewer-info-stat">
                        <label>{isCountingCharacters ? "CHARACTERS" : "WORDS"}</label>
                        <p>
                          <span className="essay-viewer-info-highlight">{currentCount}</span>
                          <span className="essay-viewer-info-separator">/</span>
                          <span>{maxCount}</span>
                        </p>
                      </div>
                      
                      <div className="essay-viewer-info-stat">
                        <label>PARAGRAPHS</label>
                        <p>{essayStats.paragraphs}</p>
                      </div>
                      
                      <div className="essay-viewer-info-stat">
                        <label>READING TIME</label>
                        <p>{essayStats.readingTime} min</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div 
                className="essay-viewer-essay-content" 
                ref={essayContentRef}
              >
                {paragraphs.map((paragraph, index) => (
                  <p 
                    key={index}
                    className="essay-paragraph"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right column - Actions panel */}
          <div className="essay-viewer-actions-column">
            {/* Feedback card */}
            <div className="essay-viewer-card">
              <div className="essay-viewer-card-header">
                <div className="essay-viewer-card-icon secondary">
                  <MessageSquare size={18} />
                </div>
                <h2 className="essay-viewer-card-title">Provide Feedback</h2>
              </div>
              
              <div className="essay-viewer-card-content">
                <p className="essay-viewer-feedback-prompt">How do you feel about this essay?</p>
                
                <div className="essay-viewer-feedback-options">
                  <button 
                    className={`essay-viewer-feedback-button ${feedback === 'positive' ? 'active' : ''}`}
                    onClick={() => handleFeedback('positive')}
                    aria-pressed={feedback === 'positive'}
                    aria-label="I like this essay"
                  >
                    <ThumbsUp size={20} />
                    <span>I like it</span>
                  </button>
                  
                  <button 
                    className={`essay-viewer-feedback-button ${feedback === 'negative' ? 'active' : ''}`}
                    onClick={() => handleFeedback('negative')}
                    aria-pressed={feedback === 'negative'}
                    aria-label="I don't like this essay"
                  >
                    <ThumbsDown size={20} />
                    <span>Needs work</span>
                  </button>
                </div>
                
                {feedback && (
                  <div className="essay-viewer-feedback-message">
                    <CheckCircle size={16} />
                    <span>Thank you for your feedback!</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions & Next Steps card - Combined */}
            <div className="essay-viewer-card">
              <div className="essay-viewer-card-header">
                <div className="essay-viewer-card-icon success">
                  <Settings size={18} />
                </div>
                <h2 className="essay-viewer-card-title">Actions & Next Steps</h2>
              </div>
              
              <div className="essay-viewer-card-content">
                <div className="essay-viewer-actions-group">
                  <button 
                    className={`essay-viewer-action-button ${copied ? 'success' : ''}`}
                    onClick={handleCopyToClipboard}
                    aria-label="Copy to clipboard"
                  >
                    {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                    <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                  </button>
                  
                  <button 
                    className={`essay-viewer-action-button ${downloading ? 'processing' : ''}`}
                    onClick={handleDownloadPDF}
                    disabled={downloading}
                    aria-label="Download as PDF"
                  >
                    <Download size={18} />
                    <span>{downloading ? 'Processing...' : 'Download as PDF'}</span>
                  </button>
                </div>
                
                <div className="essay-viewer-actions-divider"></div>
                
                <div className="essay-viewer-next-steps">
                  <button 
                    className="essay-viewer-secondary-button"
                    onClick={onRequestRevisions}
                    aria-label="Request revisions"
                  >
                    <Edit3 size={18} />
                    <span>Request Revisions</span>
                  </button>
                  
                  <button 
                    className="essay-viewer-primary-button"
                    onClick={handleSaveEssay}
                    aria-label="Save & Continue"
                  >
                    <SaveAll size={18} />
                    <span>Save & Continue</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Help link (always visible at bottom) */}
        <div className="essay-viewer-help">
          <HelpCircle size={14} />
          <p>Need help? <a href="#" className="essay-viewer-link">Contact our support team</a></p>
        </div>
      </main>
      
      {/* Tips Modal */}
      {showTipsModal && (
        <div className="essay-viewer-modal-overlay" onClick={() => setShowTipsModal(false)}>
          <div 
            className="essay-viewer-modal" 
            ref={tipsModalRef}
            onClick={e => e.stopPropagation()}
          >
            <div className="essay-viewer-modal-header">
              <div className="essay-viewer-modal-title">
                <Lightbulb size={18} />
                <h2>Tips & Keyboard Shortcuts</h2>
              </div>
              
              <button 
                className="essay-viewer-modal-close"
                onClick={() => setShowTipsModal(false)}
                aria-label="Close tips"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="essay-viewer-modal-content">
              <div className="essay-viewer-modal-section">
                <h3>Essay Review Tips</h3>
                <ul className="essay-viewer-modal-list">
                  <li>Check that word or character count meets your application requirements</li>
                  <li>Ensure the tone and style match what you requested</li>
                  <li>Verify that all key aspects of the prompt are addressed</li>
                  <li>Look for a clear introduction, well-developed body, and strong conclusion</li>
                  <li>Consider requesting revisions if any parts need adjustment</li>
                </ul>
              </div>
              
              <div className="essay-viewer-modal-section">
                <h3>Keyboard Shortcuts</h3>
                <div className="essay-viewer-shortcuts-grid">
                  <div className="essay-viewer-shortcut">
                    <div className="essay-viewer-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>C</kbd>
                    </div>
                    <div className="essay-viewer-shortcut-desc">Copy Essay</div>
                  </div>
                  
                  <div className="essay-viewer-shortcut">
                    <div className="essay-viewer-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>P</kbd>
                    </div>
                    <div className="essay-viewer-shortcut-desc">Download PDF</div>
                  </div>
                  
                  <div className="essay-viewer-shortcut">
                    <div className="essay-viewer-shortcut-keys">
                      <kbd>Ctrl</kbd> + <kbd>F</kbd>
                    </div>
                    <div className="essay-viewer-shortcut-desc">Toggle Focus Mode</div>
                  </div>
                  
                  <div className="essay-viewer-shortcut">
                    <div className="essay-viewer-shortcut-keys">
                      <kbd>Esc</kbd>
                    </div>
                    <div className="essay-viewer-shortcut-desc">Close Popups</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="essay-viewer-modal-footer">
              <button 
                className="essay-viewer-modal-button"
                onClick={() => setShowTipsModal(false)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Bouton flottant pour quitter le mode focus */}
      <button 
        className="focus-mode-exit-button"
        onClick={toggleFocusMode}
        aria-label="Exit focus mode"
        title="Exit focus mode"
      >
        <Minimize2 size={20} />
      </button>

      {/* Compteur de mots flottant en mode focus */}
      {focusMode && (
        <div className="focus-mode-word-counter">
          <Type size={14} />
          <span>{animatedCount} / {maxCount} {countLabel}</span>
        </div>
      )}
    </div>
  );
};

export default EssayStep2;